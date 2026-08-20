using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Api.Model;
using Microsoft.IdentityModel.Tokens;

namespace Api.Services;

public class JwtTokenService
{
  private readonly IConfiguration _configuration;

  public JwtTokenService(IConfiguration configuration)
  {
    _configuration = configuration;
  }

  public string CreateToken(User user)
  {
    var key = _configuration["Jwt:Key"]!;
    var issuer = _configuration["Jwt:Issuer"]!;
    var audience = _configuration["Jwt:Audience"]!;
    var expiresMinutes = int.Parse(_configuration["Jwt:ExpiresMinutes"] ?? "120");

    var claims = new[]
    {
      new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
      new Claim(ClaimTypes.Email, user.Email),
      new Claim(ClaimTypes.Name, user.Name),
    };

    var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
      issuer: issuer,
      audience: audience,
      claims: claims,
      expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
      signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(token);
  }

  public string CreateAdminToken(Admin admin)
  {
    var key = _configuration["Jwt:Key"]!;
    var issuer = _configuration["Jwt:Issuer"]!;
    var audience = _configuration["Jwt:Audience"]!;
    var expiresMinutes = int.Parse(_configuration["Jwt:ExpiresMinutes"] ?? "120");

    var claims = new[]
    {
      new Claim(ClaimTypes.NameIdentifier, admin.AdminId.ToString()),
      new Claim(ClaimTypes.Email, admin.Email),
      new Claim(ClaimTypes.Name, admin.Name),
      new Claim(ClaimTypes.Role, "Admin"),
    };

    var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
      issuer: issuer,
      audience: audience,
      claims: claims,
      expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
      signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
