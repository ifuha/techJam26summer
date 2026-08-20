using Api.Data;
using Api.Dto;
using Api.Helpers;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class UserController : ControllerBase
{
  private readonly AppDbContext _db;
  private readonly GeocodingService _geocodingService;

  public UserController(AppDbContext db, GeocodingService geocodingService)
  {
    _db = db;
    _geocodingService = geocodingService;
  }

  [HttpGet("/api/Users")]
  public async Task<ActionResult<List<UserPublicDto>>> GetUsers()
  {
    var users = await _db.Users
      .Select(u => new UserPublicDto(
        u.UserId, u.Name, u.Avatar, u.JobOrCommonMan, u.ProductName, u.Address, u.Prefecture, u.Latitude, u.Longitude, u.CraftId,
        u.ProfileTags.Select(pt => pt.Tag!.TagName).ToList(), u.CreateAt))
      .ToListAsync();
    return Ok(users);
  }

  [HttpGet("/api/User/{id}")]
  public async Task<ActionResult<UserPublicDto>> GetUser(Guid id)
  {
    var user = await _db.Users
      .Where(u => u.UserId == id)
      .Select(u => new UserPublicDto(
        u.UserId, u.Name, u.Avatar, u.JobOrCommonMan, u.ProductName, u.Address, u.Prefecture, u.Latitude, u.Longitude, u.CraftId,
        u.ProfileTags.Select(pt => pt.Tag!.TagName).ToList(), u.CreateAt))
      .FirstOrDefaultAsync();
    return user is null ? NotFound() : Ok(user);
  }

  [Authorize]
  [HttpGet("/api/User/account/{id}")]
  public async Task<ActionResult<UserAccountDto>> GetUserAccount(Guid id)
  {
    var user = await _db.Users
      .Where(u => u.UserId == id)
      .Select(u => new UserAccountDto(
        u.UserId, u.Name, u.Email, u.Avatar, u.JobOrCommonMan, u.Address, u.Prefecture, u.Latitude, u.Longitude, u.ProductName, u.CraftId,
        u.ProfileTags.Select(pt => pt.Tag!.TagName).ToList(), u.CreateAt))
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

    if (request.Prefecture is not null && !Prefectures.IsValid(request.Prefecture))
    {
      return BadRequest("Prefectureが不正です(都道府県名を指定してください)。");
    }

    if (request.CraftId is not null)
    {
      if (!user.JobOrCommonMan)
      {
        return BadRequest("一般ユーザーはCraftに紐付けられません。");
      }
      var craftExists = await _db.Crafts.AnyAsync(c => c.CraftId == request.CraftId);
      if (!craftExists)
      {
        return BadRequest("指定されたCraftが存在しません。");
      }
    }

    var addressChanged = request.Address is not null && request.Address != user.Address;
    var prefectureChanged = request.Prefecture is not null && request.Prefecture != user.Prefecture;

    if (request.Name is not null) user.Name = request.Name;
    if (request.Avatar is not null) user.Avatar = request.Avatar;
    if (request.Address is not null) user.Address = request.Address;
    if (request.Prefecture is not null) user.Prefecture = request.Prefecture;
    if (request.ProductName is not null) user.ProductName = request.ProductName;
    if (request.CraftId is not null) user.CraftId = request.CraftId;

    if (request.CraftId is null
      && user.JobOrCommonMan
      && (request.ProductName is not null || request.Prefecture is not null || user.CraftId is null)
      && !string.IsNullOrWhiteSpace(user.ProductName)
      && user.Prefecture is not null)
    {
      var matchedCraft = await _db.Crafts.FirstOrDefaultAsync(c =>
        c.ProductName == user.ProductName && c.Prefecture == user.Prefecture);
      if (matchedCraft is not null)
      {
        user.CraftId = matchedCraft.CraftId;
      }
    }

    if (addressChanged || prefectureChanged)
    {
      var geocodeQuery = string.Join(" ", new[] { user.Prefecture, user.Address }.Where(s => !string.IsNullOrWhiteSpace(s)));
      if (geocodeQuery.Length > 0)
      {
        var geocoded = await _geocodingService.GeocodeAsync(geocodeQuery);
        if (geocoded is not null)
        {
          user.Latitude = geocoded.Latitude;
          user.Longitude = geocoded.Longitude;
        }
      }
    }

    await _db.SaveChangesAsync();

    var tags = await _db.UserTags
      .Where(ut => ut.UserId == user.UserId)
      .Select(ut => ut.Tag!.TagName)
      .ToListAsync();

    return Ok(new UserAccountDto(user.UserId, user.Name, user.Email, user.Avatar, user.JobOrCommonMan, user.Address, user.Prefecture, user.Latitude, user.Longitude, user.ProductName, user.CraftId, tags, user.CreateAt));
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
