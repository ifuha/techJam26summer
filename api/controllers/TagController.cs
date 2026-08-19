using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class TagController : ControllerBase
{
  private readonly AppDbContext _db;

  public TagController(AppDbContext db)
  {
    _db = db;
  }

  [Authorize]
  [HttpPost("/api/tag")]
  public async Task<ActionResult<TagDto>> CreateTag(TagCreateRequestDto request)
  {
    var userId = User.GetUserId();

    var tag = new Model.Tag
    {
      TagId = Guid.NewGuid(),
      TagName = request.TagName,
      UserId = userId,
      CreateAt = DateTime.UtcNow,
    };

    _db.Tags.Add(tag);
    await _db.SaveChangesAsync();

    return Ok(new TagDto(tag.TagId, tag.TagName, tag.CreateAt, tag.UserId));
  }

  [HttpGet("/api/tags")]
  public async Task<ActionResult<List<TagDto>>> GetTags()
  {
    var tags = await _db.Tags
      .Select(t => new TagDto(t.TagId, t.TagName, t.CreateAt, t.UserId))
      .ToListAsync();
    return Ok(tags);
  }
}
