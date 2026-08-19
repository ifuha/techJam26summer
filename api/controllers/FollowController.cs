using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class FollowController : ControllerBase
{
  private readonly AppDbContext _db;

  public FollowController(AppDbContext db)
  {
    _db = db;
  }

  [Authorize]
  [HttpPost("/api/follow/{targetId}")]
  public async Task<IActionResult> Follow(Guid targetId)
  {
    var userId = User.GetUserId();
    if (userId == targetId)
    {
      return BadRequest("自分自身をフォローすることはできません。");
    }

    var targetExists = await _db.Users.AnyAsync(u => u.UserId == targetId);
    if (!targetExists)
    {
      return NotFound();
    }

    var exists = await _db.Follows
      .AnyAsync(f => f.FollowerId == userId && f.FollowedId == targetId);
    if (exists)
    {
      return Conflict("既にフォローしています。");
    }

    _db.Follows.Add(new Model.Follow
    {
      FollowId = Guid.NewGuid(),
      FollowerId = userId,
      FollowedId = targetId,
      CreateAt = DateTime.UtcNow,
    });
    await _db.SaveChangesAsync();

    return Ok(new FollowStatusDto(true));
  }

  [Authorize]
  [HttpDelete("/api/follow/{targetId}")]
  public async Task<IActionResult> UnFollow(Guid targetId)
  {
    var userId = User.GetUserId();
    var follow = await _db.Follows
      .FirstOrDefaultAsync(f => f.FollowerId == userId && f.FollowedId == targetId);
    if (follow is null)
    {
      return NotFound();
    }

    _db.Follows.Remove(follow);
    await _db.SaveChangesAsync();
    return NoContent();
  }

  [HttpGet("/api/follow/{userId}/followers")]
  public async Task<ActionResult<FollowerCountDto>> GetFollowerCount(Guid userId)
  {
    var count = await _db.Follows.CountAsync(f => f.FollowedId == userId);
    return Ok(new FollowerCountDto(count));
  }

  [Authorize]
  [HttpGet("/api/follow/{targetId}/status")]
  public async Task<ActionResult<FollowStatusDto>> IsFollowing(Guid targetId)
  {
    var userId = User.GetUserId();
    var isFollowing = await _db.Follows
      .AnyAsync(f => f.FollowerId == userId && f.FollowedId == targetId);
    return Ok(new FollowStatusDto(isFollowing));
  }
}
