using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class UserController : ControllerBase
{
  private readonly AppDbContext _db;

  public UserController(AppDbContext db)
  {
    _db = db;
  }

  [HttpGet("/api/Users")]
  public async Task<ActionResult<List<UserPublicDto>>> GetUsers()
  {
    var users = await _db.Users
      .Select(u => new UserPublicDto(u.UserId, u.Name, u.Avatar, u.JobOrCommonMan, u.ProductName, u.CreateAt))
      .ToListAsync();
    return Ok(users);
  }

  [HttpGet("/api/User/{id}")]
  public async Task<ActionResult<UserPublicDto>> GetUser(Guid id)
  {
    var user = await _db.Users
      .Where(u => u.UserId == id)
      .Select(u => new UserPublicDto(u.UserId, u.Name, u.Avatar, u.JobOrCommonMan, u.ProductName, u.CreateAt))
      .FirstOrDefaultAsync();
    return user is null ? NotFound() : Ok(user);
  }

  [Authorize]
  [HttpGet("/api/User/account/{id}")]
  public async Task<ActionResult<UserAccountDto>> GetUserAccount(Guid id)
  {
    var user = await _db.Users
      .Where(u => u.UserId == id)
      .Select(u => new UserAccountDto(u.UserId, u.Name, u.Email, u.Avatar, u.JobOrCommonMan, u.Address, u.ProductName, u.CreateAt))
      .FirstOrDefaultAsync();
    return user is null ? NotFound() : Ok(user);
  }

  [Authorize]
  [HttpPatch("/api/User/Patch")]
  public async Task<ActionResult<UserAccountDto>> PatchUser(UserPatchRequestDto request)
  {
    var userId = User.GetUserId();
    var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
    if (user is null)
    {
      return NotFound();
    }

    if (request.Name is not null) user.Name = request.Name;
    if (request.Avatar is not null) user.Avatar = request.Avatar;
    if (request.Address is not null) user.Address = request.Address;
    if (request.ProductName is not null) user.ProductName = request.ProductName;

    await _db.SaveChangesAsync();

    return Ok(new UserAccountDto(user.UserId, user.Name, user.Email, user.Avatar, user.JobOrCommonMan, user.Address, user.ProductName, user.CreateAt));
  }

  [Authorize]
  [HttpDelete("/api/User/delete")]
  public async Task<IActionResult> DeleteUser()
  {
    var userId = User.GetUserId();
    var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
    if (user is null)
    {
      return NotFound();
    }

    var relatedFollows = await _db.Follows
      .Where(f => f.FollowerId == userId || f.FollowedId == userId)
      .ToListAsync();
    _db.Follows.RemoveRange(relatedFollows);

    _db.Users.Remove(user);
    await _db.SaveChangesAsync();
    return NoContent();
  }
}
