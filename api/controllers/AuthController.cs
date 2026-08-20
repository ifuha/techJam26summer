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
      return Conflict("このメールアドレスは既に使用されています。");
    }

    if (request.Prefecture is not null && !Prefectures.IsValid(request.Prefecture))
    {
      return BadRequest("Prefectureが不正です(都道府県名を指定してください)。");
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
      var matchedCraft = await _db.Crafts.FirstOrDefaultAsync(c =>
        c.ProductName == user.ProductName && c.Prefecture == user.Prefecture);
      if (matchedCraft is not null)
      {
        user.CraftId = matchedCraft.CraftId;
      }
    }

    _db.Users.Add(user);
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
      return Unauthorized("メールアドレスまたはパスワードが正しくありません。");
    }

    var token = _jwtTokenService.CreateToken(user);
    return Ok(new AuthResponseDto(token, user.UserId, user.Name, user.Email));
  }
}
