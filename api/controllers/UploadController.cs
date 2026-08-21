using Amazon.S3;
using Amazon.S3.Model;
using Api.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using R2.NET.Configuration;

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

  private readonly CloudflareR2Options _r2Options;
  private readonly IConfiguration _configuration;

  public UploadController(IOptions<CloudflareR2Options> r2Options, IConfiguration configuration)
  {
    _r2Options = r2Options.Value;
    _configuration = configuration;
  }

  [HttpPost("/api/upload/image")]
  [RequestSizeLimit(ImageMaxBytes)]
  public Task<ActionResult<UploadResultDto>> UploadImage(IFormFile file, CancellationToken cancellationToken)
  {
    var bucketName = _configuration["R2:ImageBucket"];
    var publicBaseUrl = _configuration["R2:ImagePublicBaseUrl"];
    return UploadAsync(file, bucketName, publicBaseUrl, ImageContentTypes, ImageMaxBytes, cancellationToken);
  }

  [HttpPost("/api/upload/movie")]
  [RequestSizeLimit(MovieMaxBytes)]
  [RequestFormLimits(MultipartBodyLengthLimit = MovieMaxBytes)]
  public Task<ActionResult<UploadResultDto>> UploadMovie(IFormFile file, CancellationToken cancellationToken)
  {
    var bucketName = _configuration["R2:MovieBucket"];
    var publicBaseUrl = _configuration["R2:MoviePublicBaseUrl"];
    return UploadAsync(file, bucketName, publicBaseUrl, MovieContentTypes, MovieMaxBytes, cancellationToken);
  }

  private async Task<ActionResult<UploadResultDto>> UploadAsync(
    IFormFile file,
    string? bucketName,
    string? publicBaseUrl,
    HashSet<string> allowedContentTypes,
    long maxBytes,
    CancellationToken cancellationToken)
  {
    if (string.IsNullOrEmpty(bucketName))
    {
      return StatusCode(StatusCodes.Status500InternalServerError, new { message = "R2のバケットが設定されていません。" });
    }
    if (file.Length == 0)
    {
      return BadRequest(new { message = "ファイルが空です。" });
    }
    if (file.Length > maxBytes)
    {
      return BadRequest(new { message = $"ファイルサイズが上限({maxBytes}バイト)を超えています。" });
    }
    if (!allowedContentTypes.Contains(file.ContentType))
    {
      return BadRequest(new { message = $"対応していないファイル形式です: {file.ContentType}" });
    }

    var blobName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var tempPath = Path.GetTempFileName();

    try
    {
      await using (var tempFile = new FileStream(tempPath, FileMode.Create, FileAccess.Write))
      {
        await file.CopyToAsync(tempFile, cancellationToken);
      }

      // R2.NET's CloudflareR2Client.UploadBlobAsync doesn't accept a
      // content-type, so it uploads every object without one; R2 then has no
      // idea how to serve/preview the file. Talk to the S3-compatible API
      // directly instead so we can set ContentType explicitly.
      var s3Config = new AmazonS3Config
      {
        ServiceURL = _r2Options.ApiBaseUri,
        ForcePathStyle = true,
      };
      using var s3Client = new AmazonS3Client(_r2Options.AccessKeyId, _r2Options.Secret, s3Config);

      await using var uploadStream = new FileStream(tempPath, FileMode.Open, FileAccess.Read);
      await s3Client.PutObjectAsync(new PutObjectRequest
      {
        BucketName = bucketName,
        Key = blobName,
        InputStream = uploadStream,
        ContentType = file.ContentType,
        AutoCloseStream = false,
        // R2 doesn't support AWS's chunked/streaming SigV4 payload signing;
        // without disabling it the SDK's default upload path fails with
        // "STREAMING-AWS4-HMAC-SHA256-PAYLOAD not implemented".
        UseChunkEncoding = false,
      }, cancellationToken);

      // The S3-compatible API endpoint used above is for authenticated API
      // calls only and is NOT publicly browsable (a GET against it 400s). If
      // a public base URL (r2.dev subdomain or a custom domain with public
      // access enabled) is configured, build the publicly viewable URL from
      // that instead.
      var url = string.IsNullOrEmpty(publicBaseUrl)
        ? $"{_r2Options.ApiBaseUri!.TrimEnd('/')}/{bucketName}/{blobName}"
        : $"{publicBaseUrl.TrimEnd('/')}/{blobName}";

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
