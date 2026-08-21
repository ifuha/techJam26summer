using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class PostTagController : ControllerBase
{
  private readonly AppDbContext _db;

  public PostTagController(AppDbContext db)
  {
    _db = db;
  }

  [HttpGet("/api/postTag/{postId}")]
  public async Task<ActionResult<List<PostTagDto>>> GetPostTags(Guid postId)
  {
    var postTags = await _db.PostTags
      .Where(pt => pt.PostId == postId)
      .Select(pt => new PostTagDto(pt.PostId, pt.TagId, pt.Tag!.TagName))
      .ToListAsync();
    return Ok(postTags);
  }

  [Authorize]
  [HttpPost("/api/postTag")]
  public async Task<ActionResult<PostTagDto>> CreatePostTag(PostTagCreateRequestDto request)
  {
    var userId = User.GetUserId();

    var post = await _db.Posts.FirstOrDefaultAsync(p => p.PostId == request.PostId);
    if (post is null)
    {
      return BadRequest(new { message = "指定されたPostが存在しません。" });
    }
    if (post.UserId != userId)
    {
      return Forbid();
    }

    var tag = await _db.Tags.FirstOrDefaultAsync(t => t.TagId == request.TagId);
    if (tag is null)
    {
      return BadRequest(new { message = "指定されたTagが存在しません。" });
    }

    var exists = await _db.PostTags
      .AnyAsync(pt => pt.PostId == request.PostId && pt.TagId == request.TagId);
    if (exists)
    {
      return Conflict(new { message = "既に紐付いています。" });
    }

    _db.PostTags.Add(new Model.PostTag
    {
      PostId = request.PostId,
      TagId = request.TagId,
    });
    await _db.SaveChangesAsync();

    return Ok(new PostTagDto(request.PostId, request.TagId, tag.TagName));
  }

  [Authorize]
  [HttpDelete("/api/postTag/{postId}/{tagId}")]
  public async Task<IActionResult> DeletePostTag(Guid postId, Guid tagId)
  {
    var userId = User.GetUserId();

    var postTag = await _db.PostTags
      .Include(pt => pt.Post)
      .FirstOrDefaultAsync(pt => pt.PostId == postId && pt.TagId == tagId);
    if (postTag is null)
    {
      return NotFound();
    }
    if (postTag.Post!.UserId != userId)
    {
      return Forbid();
    }

    _db.PostTags.Remove(postTag);
    await _db.SaveChangesAsync();
    return NoContent();
  }
}
