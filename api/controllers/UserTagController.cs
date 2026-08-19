using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class UserTagController : ControllerBase
{
  private readonly AppDbContext _db;

  public UserTagController(AppDbContext db)
  {
    _db = db;
  }

  [HttpGet("/api/userTag/{userId}")]
  public async Task<ActionResult<List<UserTagDto>>> GetUserTags(Guid userId)
  {
    var tags = await _db.UserTags
      .Where(ut => ut.UserId == userId)
      .Select(ut => new UserTagDto(ut.UserId, ut.TagId, ut.Tag!.TagName))
      .ToListAsync();
    return Ok(tags);
  }

  [Authorize]
  [HttpPost("/api/userTag")]
  public async Task<ActionResult<UserTagDto>> AddUserTag(UserTagCreateRequestDto request)
  {
    var userId = User.GetUserId();

    var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
    if (user is null)
    {
      return NotFound();
    }
    if (!user.JobOrCommonMan)
    {
      return BadRequest("一般ユーザーにはTagを付けられません。");
    }

    var tag = await _db.Tags.FirstOrDefaultAsync(t => t.TagId == request.TagId);
    if (tag is null)
    {
      return BadRequest("指定されたTagが存在しません。");
    }

    var exists = await _db.UserTags
      .AnyAsync(ut => ut.UserId == userId && ut.TagId == request.TagId);
    if (exists)
    {
      return Conflict("既に紐付いています。");
    }

    _db.UserTags.Add(new Model.UserTag
    {
      UserId = userId,
      TagId = request.TagId,
    });
    await _db.SaveChangesAsync();

    return Ok(new UserTagDto(userId, request.TagId, tag.TagName));
  }

  [Authorize]
  [HttpDelete("/api/userTag/{tagId}")]
  public async Task<IActionResult> RemoveUserTag(Guid tagId)
  {
    var userId = User.GetUserId();
    var userTag = await _db.UserTags
      .FirstOrDefaultAsync(ut => ut.UserId == userId && ut.TagId == tagId);
    if (userTag is null)
    {
      return NotFound();
    }

    _db.UserTags.Remove(userTag);
    await _db.SaveChangesAsync();
    return NoContent();
  }
}
