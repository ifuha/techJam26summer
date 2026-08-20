using Api.Data;
using Api.Dto;
using Api.Helpers;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class CraftController : ControllerBase
{
  private readonly AppDbContext _db;
  private readonly GeocodingService _geocodingService;

  public CraftController(AppDbContext db, GeocodingService geocodingService)
  {
    _db = db;
    _geocodingService = geocodingService;
  }

  private static readonly Func<Model.Craft, CraftSummaryDto> ToSummaryDto = c => new CraftSummaryDto(
    c.CraftId, c.ProductName, c.Address, c.Prefecture, c.Latitude, c.Longitude, c.Image);

  [HttpGet("/api/crafts")]
  public async Task<ActionResult<List<CraftSummaryDto>>> GetCrafts()
  {
    var crafts = await _db.Crafts.ToListAsync();
    return Ok(crafts.Select(ToSummaryDto));
  }

  [HttpGet("/api/craft/{id}")]
  public async Task<ActionResult<CraftDetailDto>> GetCraft(Guid id)
  {
    var craft = await _db.Crafts
      .Include(c => c.Successors).ThenInclude(u => u.ProfileTags).ThenInclude(pt => pt.Tag)
      .FirstOrDefaultAsync(c => c.CraftId == id);

    if (craft is null)
    {
      return NotFound();
    }

    var successors = craft.Successors
      .Select(u => new UserPublicDto(
        u.UserId, u.Name, u.Avatar, u.JobOrCommonMan, u.ProductName, u.Address, u.Prefecture, u.Latitude, u.Longitude, u.CraftId,
        u.ProfileTags.Select(pt => pt.Tag!.TagName).ToList(), u.CreateAt))
      .ToList();

    var dto = new CraftDetailDto(
      craft.CraftId, craft.ProductName, craft.Address, craft.Prefecture, craft.Latitude, craft.Longitude,
      craft.Image, craft.Description, successors.Count, successors, craft.CreateAt);

    return Ok(dto);
  }

  [Authorize(Policy = "AdminOnly")]
  [HttpPost("/api/craft")]
  public async Task<ActionResult<CraftSummaryDto>> CreateCraft(CraftCreateRequestDto request)
  {
    if (request.Prefecture is not null && !Prefectures.IsValid(request.Prefecture))
    {
      return BadRequest("Prefectureが不正です(都道府県名を指定してください)。");
    }

    var craft = new Model.Craft
    {
      CraftId = Guid.NewGuid(),
      ProductName = request.ProductName,
      Address = request.Address,
      Prefecture = request.Prefecture,
      Image = request.Image,
      Description = request.Description,
      CreateAt = DateTime.UtcNow,
    };

    var geocodeQuery = string.Join(" ", new[] { craft.Prefecture, craft.Address }.Where(s => !string.IsNullOrWhiteSpace(s)));
    if (geocodeQuery.Length > 0)
    {
      var geocoded = await _geocodingService.GeocodeAsync(geocodeQuery);
      if (geocoded is not null)
      {
        craft.Latitude = geocoded.Latitude;
        craft.Longitude = geocoded.Longitude;
      }
    }

    _db.Crafts.Add(craft);
    await _db.SaveChangesAsync();

    return Ok(ToSummaryDto(craft));
  }

  [Authorize(Policy = "AdminOnly")]
  [HttpPatch("/api/craft/Patch/{id}")]
  public async Task<ActionResult<CraftSummaryDto>> PatchCraft(Guid id, CraftPatchRequestDto request)
  {
    var craft = await _db.Crafts.FirstOrDefaultAsync(c => c.CraftId == id);
    if (craft is null)
    {
      return NotFound();
    }

    if (request.Prefecture is not null && !Prefectures.IsValid(request.Prefecture))
    {
      return BadRequest("Prefectureが不正です(都道府県名を指定してください)。");
    }

    var addressChanged = request.Address is not null && request.Address != craft.Address;
    var prefectureChanged = request.Prefecture is not null && request.Prefecture != craft.Prefecture;

    if (request.ProductName is not null) craft.ProductName = request.ProductName;
    if (request.Address is not null) craft.Address = request.Address;
    if (request.Prefecture is not null) craft.Prefecture = request.Prefecture;
    if (request.Image is not null) craft.Image = request.Image;
    if (request.Description is not null) craft.Description = request.Description;

    if (addressChanged || prefectureChanged)
    {
      var geocodeQuery = string.Join(" ", new[] { craft.Prefecture, craft.Address }.Where(s => !string.IsNullOrWhiteSpace(s)));
      if (geocodeQuery.Length > 0)
      {
        var geocoded = await _geocodingService.GeocodeAsync(geocodeQuery);
        if (geocoded is not null)
        {
          craft.Latitude = geocoded.Latitude;
          craft.Longitude = geocoded.Longitude;
        }
      }
    }

    await _db.SaveChangesAsync();
    return Ok(ToSummaryDto(craft));
  }

  [Authorize(Policy = "AdminOnly")]
  [HttpDelete("/api/craft/Delete/{id}")]
  public async Task<IActionResult> DeleteCraft(Guid id)
  {
    var craft = await _db.Crafts.FirstOrDefaultAsync(c => c.CraftId == id);
    if (craft is null)
    {
      return NotFound();
    }

    _db.Crafts.Remove(craft);
    await _db.SaveChangesAsync();
    return NoContent();
  }
}
