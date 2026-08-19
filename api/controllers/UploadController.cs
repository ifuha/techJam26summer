using Api.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using R2.NET.Factories;

namespace Api.Controllers;

[ApiController]
[Authorize]
public class UploadController : ControllerBase
{
  private static readonly HashSet<string> ImageContentTypes = new(StringComparer.OrdinalIgnoreCase)
  {
    "image/jpeg", "image/png", "image/gif", "image/webp",
  };

  private static readonly HashSet<string> MovieContentTypes = new(StringComparer.OrdinalIgnoreCase)
  {
    "video/mp4", "video/quicktime", "video/webm",
  };

  private const long ImageMaxBytes = 20_000_000;
  private const long MovieMaxBytes = 500_000_000;

  private readonly ICloudflareR2ClientFactory _clientFactory;
  private readonly IConfiguration _configuration;

  public UploadController(ICloudflareR2ClientFactory clientFactory, IConfiguration configuration)
  {
    _clientFactory = clientFactory;
    _configuration = configuration;
  }

  [HttpPost("/api/upload/image")]
  [RequestSizeLimit(ImageMaxBytes)]
  public Task<ActionResult<UploadResultDto>> UploadImage(IFormFile file, CancellationToken cancellationToken)
  {
    var bucketName = _configuration["R2:ImageBucket"];
    return UploadAsync(file, bucketName, ImageContentTypes, ImageMaxBytes, cancellationToken);
  }

  [HttpPost("/api/upload/movie")]
  [RequestSizeLimit(MovieMaxBytes)]
  [RequestFormLimits(MultipartBodyLengthLimit = MovieMaxBytes)]
  public Task<ActionResult<UploadResultDto>> UploadMovie(IFormFile file, CancellationToken cancellationToken)
  {
    var bucketName = _configuration["R2:MovieBucket"];
    return UploadAsync(file, bucketName, MovieContentTypes, MovieMaxBytes, cancellationToken);
  }

  private async Task<ActionResult<UploadResultDto>> UploadAsync(
    IFormFile file,
    string? bucketName,
    HashSet<string> allowedContentTypes,
    long maxBytes,
    CancellationToken cancellationToken)
  {
    if (string.IsNullOrEmpty(bucketName))
    {
      return Problem("R2のバケットが設定されていません。", statusCode: StatusCodes.Status500InternalServerError);
    }
    if (file.Length == 0)
    {
      return BadRequest("ファイルが空です。");
    }
    if (file.Length > maxBytes)
    {
      return BadRequest($"ファイルサイズが上限({maxBytes}バイト)を超えています。");
    }
    if (!allowedContentTypes.Contains(file.ContentType))
    {
      return BadRequest($"対応していないファイル形式です: {file.ContentType}");
    }

    var blobName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var tempPath = Path.GetTempFileName();

    try
    {
      await using (var tempFile = new FileStream(tempPath, FileMode.Create, FileAccess.Write))
      {
        await file.CopyToAsync(tempFile, cancellationToken);
      }

      var client = _clientFactory.GetClient(bucketName, cancellationToken);

      await using var uploadStream = new FileStream(tempPath, FileMode.Open, FileAccess.Read);
      var url = await client.UploadBlobAsync(uploadStream, blobName, cancellationToken);

      return Ok(new UploadResultDto(url));
    }
    finally
    {
      if (System.IO.File.Exists(tempPath))
      {
        System.IO.File.Delete(tempPath);
      }
    }
  }
}
