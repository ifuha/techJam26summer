using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class CraftFavoriteController : ControllerBase
{
  private readonly AppDbContext _db;

  public CraftFavoriteController(AppDbContext db)
  {
    _db = db;
  }

  [Authorize]
  [HttpPost("/api/craftFavorite/{craftId}")]
  public async Task<IActionResult> AddFavorite(Guid craftId)
  {
    var userId = User.GetUserId();

    var craftExists = await _db.Crafts.AnyAsync(c => c.CraftId == craftId);
    if (!craftExists)
    {
      return NotFound();
    }

    var exists = await _db.CraftFavorites
      .AnyAsync(cf => cf.UserId == userId && cf.CraftId == craftId);
    if (exists)
    {
      return Conflict("既にお気に入りに登録しています。");
    }

    _db.CraftFavorites.Add(new Model.CraftFavorite
    {
      CraftFavoriteId = Guid.NewGuid(),
      UserId = userId,
      CraftId = craftId,
      CreateAt = DateTime.UtcNow,
    });
    await _db.SaveChangesAsync();

    return Ok(new CraftFavoriteStatusDto(true));
  }

  [Authorize]
  [HttpDelete("/api/craftFavorite/{craftId}")]
  public async Task<IActionResult> RemoveFavorite(Guid craftId)
  {
    var userId = User.GetUserId();
    var favorite = await _db.CraftFavorites
      .FirstOrDefaultAsync(cf => cf.UserId == userId && cf.CraftId == craftId);
    if (favorite is null)
    {
      return NotFound();
    }

    _db.CraftFavorites.Remove(favorite);
    await _db.SaveChangesAsync();
    return NoContent();
  }

  [Authorize]
  [HttpGet("/api/craftFavorite/{craftId}/status")]
  public async Task<ActionResult<CraftFavoriteStatusDto>> GetFavoriteStatus(Guid craftId)
  {
    var userId = User.GetUserId();
    var isFavorited = await _db.CraftFavorites
      .AnyAsync(cf => cf.UserId == userId && cf.CraftId == craftId);
    return Ok(new CraftFavoriteStatusDto(isFavorited));
  }

  [Authorize]
  [HttpGet("/api/craftFavorite/mine")]
  public async Task<ActionResult<List<MyCraftFavoriteDto>>> GetMyFavorites()
  {
    var userId = User.GetUserId();

    var favorites = await _db.CraftFavorites
      .Where(cf => cf.UserId == userId)
      .Include(cf => cf.Craft!).ThenInclude(c => c.Successors)
      .OrderByDescending(cf => cf.CreateAt)
      .Select(cf => new MyCraftFavoriteDto(
        cf.CraftFavoriteId,
        cf.CraftId,
        cf.Craft!.ProductName,
        cf.Craft!.Address,
        cf.Craft!.Prefecture,
        cf.Craft!.Image,
        cf.Craft!.Successors.Count,
        cf.CreateAt))
      .ToListAsync();

    return Ok(favorites);
  }
}
