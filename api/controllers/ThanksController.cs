using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class ThanksController : ControllerBase
{
  private readonly AppDbContext _db;

  public ThanksController(AppDbContext db)
  {
    _db = db;
  }

  [Authorize]
  [HttpPost("/api/thanks")]
  public async Task<ActionResult<ThanksDto>> SendThanks(ThanksCreateRequestDto request)
  {
    var userId = User.GetUserId();

    var subscription = await _db.Subscriptions
      .Include(s => s.Support)
      .FirstOrDefaultAsync(s => s.SubscriptionId == request.SubscriptionId);
    if (subscription is null)
    {
      return NotFound();
    }
    if (subscription.Support!.UserId != userId)
    {
      return Forbid();
    }

    var existing = await _db.Thanks
      .FirstOrDefaultAsync(t => t.SubscriptionId == request.SubscriptionId);
    if (existing is not null)
    {
      return Ok(new ThanksDto(existing.ThanksId, existing.SubscriptionId, existing.CreateAt));
    }

    var thanks = new Model.Thanks
    {
      ThanksId = Guid.NewGuid(),
      SubscriptionId = request.SubscriptionId,
      CreateAt = DateTime.UtcNow,
    };

    _db.Thanks.Add(thanks);
    await _db.SaveChangesAsync();

    return Ok(new ThanksDto(thanks.ThanksId, thanks.SubscriptionId, thanks.CreateAt));
  }
}
