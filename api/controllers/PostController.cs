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

  private async Task<HashSet<Guid>> GetUnlockedSupportIdsAsync(Guid? viewerId)
  {
    if (viewerId is null)
    {
      return new HashSet<Guid>();
    }

    var supportIds = await _db.Subscriptions
      .Where(s => s.UserId == viewerId)
      .Select(s => s.SupportId)
      .ToListAsync();
    return supportIds.ToHashSet();
  }

  private static PostDto ToDto(Model.Post p, Guid? viewerId, HashSet<Guid> unlockedSupportIds)
  {
    var isLocked = p.SupportId is not null
      && p.UserId != viewerId
      && !unlockedSupportIds.Contains(p.SupportId.Value);

    return new PostDto(
      p.PostId,
      p.Title,
      p.UserId,
      isLocked ? null : p.ReportMassege,
      p.Subscription,
      p.CreateAt,
      p.SupportId,
      isLocked,
      p.Likes.Count,
      p.PostTags.Select(pt => pt.Tag!.TagName).ToList(),
      isLocked
        ? new List<PostMediaDto>()
        : p.Media
          .OrderBy(m => m.SortOrder)
          .Select(m => new PostMediaDto(m.PostMediaId, m.Url, m.Type.ToString(), m.SortOrder))
          .ToList());
  }

  private static bool TryBuildMedia(
    List<PostMediaInputDto>? input,
    out List<Model.PostMedia> media,
    out string? error)
  {
    media = new List<Model.PostMedia>();
    error = null;

    if (input is null)
    {
      return true;
    }

    for (var i = 0; i < input.Count; i++)
    {
      if (!Enum.TryParse<Model.PostMediaType>(input[i].Type, ignoreCase: true, out var type))
      {
        error = $"Media[{i}].Typeが不正です(Image または Movie を指定してください)。";
        return false;
      }

      media.Add(new Model.PostMedia
      {
        PostMediaId = Guid.NewGuid(),
        Url = input[i].Url,
        Type = type,
        SortOrder = i,
      });
    }

    return true;
  }

  [HttpGet("/api/Posts")]
  public async Task<ActionResult<List<PostDto>>> GetPosts()
  {
    var viewerId = User.TryGetUserId();
    var unlockedSupportIds = await GetUnlockedSupportIdsAsync(viewerId);

    var posts = await _db.Posts
      .Include(p => p.Likes)
      .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
      .Include(p => p.Media)
      .OrderByDescending(p => p.CreateAt)
      .ToListAsync();
    return Ok(posts.Select(p => ToDto(p, viewerId, unlockedSupportIds)));
  }

  [HttpGet("/api/Post/{id}")]
  public async Task<ActionResult<PostDto>> GetPost(Guid id)
  {
    var post = await _db.Posts
      .Include(p => p.Likes)
      .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
      .Include(p => p.Media)
      .FirstOrDefaultAsync(p => p.PostId == id);
    if (post is null)
    {
      return NotFound();
    }

    var viewerId = User.TryGetUserId();
    var unlockedSupportIds = await GetUnlockedSupportIdsAsync(viewerId);
    return Ok(ToDto(post, viewerId, unlockedSupportIds));
  }

  [Authorize]
  [HttpPost("/api/Post")]
  public async Task<ActionResult<PostDto>> CreatePost(PostCreateRequestDto request)
  {
    var userId = User.GetUserId();

    var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
    if (user is null)
    {
      return NotFound();
    }
    if (!user.JobOrCommonMan)
    {
      return BadRequest("一般ユーザーは活動記録を投稿できません。");
    }

    if (request.SupportId is not null)
    {
      var support = await _db.Supports.FirstOrDefaultAsync(s => s.SupportId == request.SupportId);
      if (support is null)
      {
        return BadRequest("指定されたSupportが存在しません。");
      }
      if (support.UserId != userId)
      {
        return Forbid();
      }
    }

    if (!TryBuildMedia(request.Media, out var media, out var mediaError))
    {
      return BadRequest(mediaError);
    }

    var post = new Model.Post
    {
      PostId = Guid.NewGuid(),
      Title = request.Title,
      UserId = userId,
      ReportMassege = request.ReportMassege,
      Subscription = request.Subscription,
      SupportId = request.SupportId,
      CreateAt = DateTime.UtcNow,
      Media = media,
    };

    _db.Posts.Add(post);
    await _db.SaveChangesAsync();

    return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, ToDto(post, userId, new HashSet<Guid>()));
  }

  [Authorize]
  [HttpPatch("/api/Post/Patch/{id}")]
  public async Task<ActionResult<PostDto>> PatchPost(Guid id, PostPatchRequestDto request)
  {
    var userId = User.GetUserId();
    var post = await _db.Posts
      .Include(p => p.Likes)
      .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
      .Include(p => p.Media)
      .FirstOrDefaultAsync(p => p.PostId == id);

    if (post is null)
    {
      return NotFound();
    }
    if (post.UserId != userId)
    {
      return Forbid();
    }

    if (request.SupportId is not null)
    {
      var support = await _db.Supports.FirstOrDefaultAsync(s => s.SupportId == request.SupportId);
      if (support is null)
      {
        return BadRequest("指定されたSupportが存在しません。");
      }
      if (support.UserId != userId)
      {
        return Forbid();
      }
    }

    if (!TryBuildMedia(request.Media, out var media, out var mediaError))
    {
      return BadRequest(mediaError);
    }

    if (request.Title is not null) post.Title = request.Title;
    if (request.ReportMassege is not null) post.ReportMassege = request.ReportMassege;
    if (request.Subscription is not null) post.Subscription = request.Subscription;
    if (request.SupportId is not null) post.SupportId = request.SupportId;
    if (request.Media is not null)
    {
      _db.PostMedia.RemoveRange(post.Media);
      foreach (var m in media)
      {
        m.PostId = post.PostId;
      }
      post.Media = media;
    }

    await _db.SaveChangesAsync();
    return Ok(ToDto(post, userId, new HashSet<Guid>()));
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
