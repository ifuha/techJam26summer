using Api.Data;
using Api.Dto;
using Api.Model;
using Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class AdminController : ControllerBase
{
  private readonly AppDbContext _db;
  private readonly JwtTokenService _jwtTokenService;

  public AdminController(AppDbContext db, JwtTokenService jwtTokenService)
  {
    _db = db;
    _jwtTokenService = jwtTokenService;
  }

  [HttpPost("/api/admin/register")]
  public async Task<ActionResult<AdminAuthResponseDto>> Register(AdminRegisterRequestDto request)
  {
    var emailTaken = await _db.Admins.AnyAsync(a => a.Email == request.Email);
    if (emailTaken)
    {
      return Conflict("このメールアドレスは既に使用されています。");
    }

    var admin = new Admin
    {
      AdminId = Guid.NewGuid(),
      Name = request.Name,
      Email = request.Email,
      Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
      CreateAt = DateTime.UtcNow,
    };

    _db.Admins.Add(admin);
    await _db.SaveChangesAsync();

    var token = _jwtTokenService.CreateAdminToken(admin);
    return Ok(new AdminAuthResponseDto(token, admin.AdminId, admin.Name, admin.Email));
  }

  [HttpPost("/api/admin/login")]
  public async Task<ActionResult<AdminAuthResponseDto>> Login(AdminLoginRequestDto request)
  {
    var admin = await _db.Admins.FirstOrDefaultAsync(a => a.Email == request.Email);
    if (admin is null || !BCrypt.Net.BCrypt.Verify(request.Password, admin.Password))
    {
      return Unauthorized("メールアドレスまたはパスワードが正しくありません。");
    }

    var token = _jwtTokenService.CreateAdminToken(admin);
    return Ok(new AdminAuthResponseDto(token, admin.AdminId, admin.Name, admin.Email));
  }
}
