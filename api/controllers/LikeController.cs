using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class LikeController : ControllerBase
{
  private readonly AppDbContext _db;

  public LikeController(AppDbContext db)
  {
    _db = db;
  }

  [Authorize]
  [HttpPost("/api/Like")]
  public async Task<ActionResult<LikeStatusDto>> Like(LikeCreateRequestDto request)
  {
    var userId = User.GetUserId();

    var postExists = await _db.Posts.AnyAsync(p => p.PostId == request.PostId);
    if (!postExists)
    {
      return BadRequest("指定されたPostが存在しません。");
    }

    var existing = await _db.Likes
      .FirstOrDefaultAsync(l => l.PostId == request.PostId && l.UserId == userId);
    if (existing is not null)
    {
      return Conflict("既にいいねしています。");
    }

    _db.Likes.Add(new Model.Like
    {
      LikeId = Guid.NewGuid(),
      UserId = userId,
      PostId = request.PostId,
      CreateAt = DateTime.UtcNow,
    });
    await _db.SaveChangesAsync();

    return Ok(new LikeStatusDto(true));
  }

  [Authorize]
  [HttpDelete("/api/Like/{id}")]
  public async Task<IActionResult> UnLike(Guid id)
  {
    var userId = User.GetUserId();
    var like = await _db.Likes.FirstOrDefaultAsync(l => l.PostId == id && l.UserId == userId);
    if (like is null)
    {
      return NotFound();
    }

    _db.Likes.Remove(like);
    await _db.SaveChangesAsync();
    return NoContent();
  }

  [Authorize]
  [HttpGet("/api/like/{id}/status")]
  public async Task<ActionResult<LikeStatusDto>> IsLike(Guid id)
  {
    var userId = User.GetUserId();
    var isLiked = await _db.Likes.AnyAsync(l => l.PostId == id && l.UserId == userId);
    return Ok(new LikeStatusDto(isLiked));
  }
}
