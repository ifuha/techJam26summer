using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class SupportController : ControllerBase
{
  private readonly AppDbContext _db;

  public SupportController(AppDbContext db)
  {
    _db = db;
  }

  [Authorize]
  [HttpPost("/api/support")]
  public async Task<ActionResult<SupportDto>> CreateSupport(SupportCreateRequestDto request)
  {
    var userId = User.GetUserId();

    var support = new Model.Support
    {
      SupportId = Guid.NewGuid(),
      IsMonthly = request.IsMonthly,
      Amount = request.Amount,
      UserId = userId,
      CreateAt = DateTime.UtcNow,
    };

    _db.Supports.Add(support);
    await _db.SaveChangesAsync();

    var dto = new SupportDto(support.SupportId, support.IsMonthly, support.Amount, support.CreateAt, support.UserId);
    return Ok(dto);
  }

  [HttpGet("/api/support/{id}/status")]
  public async Task<ActionResult<SupportDto>> GetSupportStatus(Guid id)
  {
    var support = await _db.Supports
      .Where(s => s.SupportId == id)
      .Select(s => new SupportDto(s.SupportId, s.IsMonthly, s.Amount, s.CreateAt, s.UserId))
      .FirstOrDefaultAsync();
    return support is null ? NotFound() : Ok(support);
  }

  [Authorize]
  [HttpDelete("/api/support/{id}")]
  public async Task<IActionResult> UnSupport(Guid id)
  {
    var userId = User.GetUserId();
    var support = await _db.Supports.FirstOrDefaultAsync(s => s.SupportId == id);
    if (support is null)
    {
      return NotFound();
    }
    if (support.UserId != userId)
    {
      return Forbid();
    }

    _db.Supports.Remove(support);
    await _db.SaveChangesAsync();
    return NoContent();
  }
}
