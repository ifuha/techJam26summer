using Api.Data;
using Api.Dto;
using Api.Helpers;
using Api.Model;
using Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class AuthController : ControllerBase
{
  private readonly AppDbContext _db;
  private readonly JwtTokenService _jwtTokenService;
  private readonly GeocodingService _geocodingService;

  public AuthController(AppDbContext db, JwtTokenService jwtTokenService, GeocodingService geocodingService)
  {
    _db = db;
    _jwtTokenService = jwtTokenService;
    _geocodingService = geocodingService;
  }

  [HttpPost("/api/register")]
  public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto request)
  {
    var emailTaken = await _db.Users.AnyAsync(u => u.Email == request.Email);
    if (emailTaken)
    {
      return Conflict(new { message = "このメールアドレスは既に使用されています。" });
    }

    if (request.Prefecture is not null && !Prefectures.IsValid(request.Prefecture))
    {
      return BadRequest(new { message = "Prefectureが不正です(都道府県名を指定してください)。" });
    }

    var user = new User
    {
      UserId = Guid.NewGuid(),
      Name = request.Name,
      Email = request.Email,
      Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
      JobOrCommonMan = request.JobOrCommonMan,
      Avatar = request.Avatar,
      Address = request.Address,
      Prefecture = request.Prefecture,
      ProductName = request.ProductName,
      Bio = request.Bio,
      CreateAt = DateTime.UtcNow,
    };

    var geocodeQuery = string.Join(" ", new[] { request.Prefecture, request.Address }.Where(s => !string.IsNullOrWhiteSpace(s)));
    if (geocodeQuery.Length > 0)
    {
      var geocoded = await _geocodingService.GeocodeAsync(geocodeQuery);
      if (geocoded is not null)
      {
        user.Latitude = geocoded.Latitude;
        user.Longitude = geocoded.Longitude;
      }
    }

    if (user.JobOrCommonMan && !string.IsNullOrWhiteSpace(user.ProductName) && user.Prefecture is not null)
    {
      var candidates = await _db.Crafts
        .Where(c => c.ProductName == user.ProductName && c.Prefecture == user.Prefecture)
        .ToListAsync();
      // Prefer a craft whose ProductionAreas explicitly includes the user's city
      // (e.g. 美濃焼 in 岐阜県 covers 多治見市/土岐市/瑞浪市, not 高山市). Crafts
      // without ProductionAreas data yet fall back to prefecture-only matching.
      var matchedCraft = candidates.FirstOrDefault(c =>
        c.ProductionAreas.Count > 0 && user.Address is not null && c.ProductionAreas.Contains(user.Address))
        ?? candidates.FirstOrDefault(c => c.ProductionAreas.Count == 0);
      if (matchedCraft is not null)
      {
        user.CraftId = matchedCraft.CraftId;

        if (!string.IsNullOrWhiteSpace(matchedCraft.Category))
        {
          var categoryTag = await _db.Tags.FirstOrDefaultAsync(t => t.TagName == matchedCraft.Category);
          if (categoryTag is null)
          {
            categoryTag = new Tag
            {
              TagId = Guid.NewGuid(),
              TagName = matchedCraft.Category,
              UserId = user.UserId,
              CreateAt = DateTime.UtcNow,
            };
            _db.Tags.Add(categoryTag);
          }
          user.ProfileTags.Add(new UserTag { UserId = user.UserId, TagId = categoryTag.TagId });
        }
      }
    }

    _db.Users.Add(user);

    // Give every new creator a starter set of support plans (matching the
    // demo data) so /account/post and the details page aren't empty by
    // default. They can edit or delete these afterward.
    if (user.JobOrCommonMan)
    {
      _db.Supports.AddRange(
        new Support
        {
          SupportId = Guid.NewGuid(),
          Name = "ライトプラン",
          IsMonthly = true,
          Amount = 500,
          Benefits = new List<string> { "活動記録の閲覧(限定コンテンツ含む)", "月1回の近況レポート" },
          UserId = user.UserId,
          CreateAt = DateTime.UtcNow,
        },
        new Support
        {
          SupportId = Guid.NewGuid(),
          Name = "スタンダードプラン",
          IsMonthly = true,
          Amount = 1000,
          Benefits = new List<string> { "活動記録の閲覧(限定コンテンツ含む)", "月1回の近況レポート", "制作過程の動画配信" },
          UserId = user.UserId,
          CreateAt = DateTime.UtcNow,
        },
        new Support
        {
          SupportId = Guid.NewGuid(),
          Name = "プレミアムプラン",
          IsMonthly = true,
          Amount = 3000,
          Benefits = new List<string> { "活動記録の閲覧(限定コンテンツ含む)", "月1回の近況レポート", "制作過程の動画配信", "オンライン相談会への参加権" },
          UserId = user.UserId,
          CreateAt = DateTime.UtcNow,
        });
    }

    await _db.SaveChangesAsync();

    var token = _jwtTokenService.CreateToken(user);
    return Ok(new AuthResponseDto(token, user.UserId, user.Name, user.Email));
  }

  [HttpPost("/api/login")]
  public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto request)
  {
    var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
    {
      return Unauthorized(new { message = "メールアドレスまたはパスワードが正しくありません。" });
    }

    var token = _jwtTokenService.CreateToken(user);
    return Ok(new AuthResponseDto(token, user.UserId, user.Name, user.Email));
  }
}
