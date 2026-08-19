using Api.Data;
using Api.Dto;
using Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
public class SubscriptionController : ControllerBase
{
  private readonly AppDbContext _db;

  public SubscriptionController(AppDbContext db)
  {
    _db = db;
  }

  [Authorize]
  [HttpPost("/api/SubScription")]
  public async Task<ActionResult<SubscriptionStatusDto>> Subscribe(SubscriptionCreateRequestDto request)
  {
    var userId = User.GetUserId();

    var supportExists = await _db.Supports.AnyAsync(s => s.SupportId == request.SupportId);
    if (!supportExists)
    {
      return BadRequest("指定されたSupportが存在しません。");
    }

    var existing = await _db.Subscriptions
      .FirstOrDefaultAsync(s => s.SupportId == request.SupportId && s.UserId == userId);
    if (existing is not null)
    {
      return Conflict("既にサブスクに入っています。");
    }

    var subscription = new Api.Model.Subscription
    {
      SubscriptionId = Guid.NewGuid(),
      SupportId = request.SupportId,
      UserId = userId,
      Status = true,
    };

    _db.Subscriptions.Add(subscription);
    await _db.SaveChangesAsync();

    return Ok(new SubscriptionStatusDto(true, subscription.Status));
  }

  [Authorize]
  [HttpDelete("/api/SubScription/{id}")]
  public async Task<IActionResult> Unsubscribe(Guid id)
  {
    var userId = User.GetUserId();
    var subscription = await _db.Subscriptions
      .FirstOrDefaultAsync(s => s.SupportId == id && s.UserId == userId);
    if (subscription is null)
    {
      return NotFound();
    }

    _db.Subscriptions.Remove(subscription);
    await _db.SaveChangesAsync();
    return NoContent();
  }

  [Authorize]
  [HttpGet("/api/SubScription/{id}/status")]
  public async Task<ActionResult<SubscriptionStatusDto>> GetSubscriptionStatus(Guid id)
  {
    var userId = User.GetUserId();
    var subscription = await _db.Subscriptions
      .FirstOrDefaultAsync(s => s.SupportId == id && s.UserId == userId);

    return Ok(new SubscriptionStatusDto(subscription is not null, subscription?.Status));
  }
}
