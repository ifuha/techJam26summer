using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class PostController : ControllerBase
{
  private readonly AppDbContext _db;

  public PostController(AppDbContext db)
  {
    _db = db;
  }

  private static readonly Func<Model.Post, PostDto> ToDto = p => new PostDto(
    p.PostId,
    p.Title,
    p.UserId,
    p.ReportMassege,
    p.Image,
    p.Movie,
    p.Subscription,
    p.CreateAt,
    p.SupportId,
    p.Likes.Count,
    p.PostTags.Select(pt => pt.Tag!.TagName).ToList());

  [HttpGet("/api/Posts")]
  public async Task<ActionResult<List<PostDto>>> GetPosts()
  {
    var posts = await _db.Posts
      .Include(p => p.Likes)
      .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
      .OrderByDescending(p => p.CreateAt)
      .ToListAsync();
    return Ok(posts.Select(ToDto));
  }

  [HttpGet("/api/Post/{id}")]
  public async Task<ActionResult<PostDto>> GetPost(Guid id)
  {
    var post = await _db.Posts
      .Include(p => p.Likes)
      .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
      .FirstOrDefaultAsync(p => p.PostId == id);
    return post is null ? NotFound() : Ok(ToDto(post));
  }

  [Authorize]
  [HttpPost("/api/Post")]
  public async Task<ActionResult<PostDto>> CreatePost(PostCreateRequestDto request)
  {
    var userId = User.GetUserId();

    var supportExists = await _db.Supports.AnyAsync(s => s.SupportId == request.SupportId);
    if (!supportExists)
    {
      return BadRequest("指定されたSupportが存在しません。");
    }

    var post = new Model.Post
    {
      PostId = Guid.NewGuid(),
      Title = request.Title,
      UserId = userId,
      ReportMassege = request.ReportMassege,
      Image = request.Image,
      Movie = request.Movie,
      Subscription = request.Subscription,
      SupportId = request.SupportId,
      CreateAt = DateTime.UtcNow,
    };

    _db.Posts.Add(post);
    await _db.SaveChangesAsync();

    return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, ToDto(post));
  }

  [Authorize]
  [HttpPatch("/api/Post/Patch/{id}")]
  public async Task<ActionResult<PostDto>> PatchPost(Guid id, PostPatchRequestDto request)
  {
    var userId = User.GetUserId();
    var post = await _db.Posts
      .Include(p => p.Likes)
      .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
      .FirstOrDefaultAsync(p => p.PostId == id);

    if (post is null)
    {
      return NotFound();
    }
    if (post.UserId != userId)
    {
      return Forbid();
    }

    if (request.Title is not null) post.Title = request.Title;
    if (request.ReportMassege is not null) post.ReportMassege = request.ReportMassege;
    if (request.Image is not null) post.Image = request.Image;
    if (request.Movie is not null) post.Movie = request.Movie;
    if (request.Subscription is not null) post.Subscription = request.Subscription;
    if (request.SupportId is not null) post.SupportId = request.SupportId.Value;

    await _db.SaveChangesAsync();
    return Ok(ToDto(post));
  }

  [Authorize]
  [HttpDelete("/api/Post/Delete/{id}")]
  public async Task<IActionResult> DeletePost(Guid id)
  {
    var userId = User.GetUserId();
    var post = await _db.Posts.FirstOrDefaultAsync(p => p.PostId == id);
    if (post is null)
    {
      return NotFound();
    }
    if (post.UserId != userId)
    {
      return Forbid();
    }

    _db.Posts.Remove(post);
    await _db.SaveChangesAsync();
    return NoContent();
  }
}
