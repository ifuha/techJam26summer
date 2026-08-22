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
      return BadRequest(new { message = "指定されたSupportが存在しません。" });
    }

    var existing = await _db.Subscriptions
      .FirstOrDefaultAsync(s => s.SupportId == request.SupportId && s.UserId == userId);
    if (existing is not null)
    {
      return Conflict(new { message = "既にサブスクに入っています。" });
    }

    var subscription = new Api.Model.Subscription
    {
      SubscriptionId = Guid.NewGuid(),
      SupportId = request.SupportId,
      UserId = userId,
      Status = true,
      CreateAt = DateTime.UtcNow,
    };

    _db.Subscriptions.Add(subscription);
    await _db.SaveChangesAsync();

    return Ok(new SubscriptionStatusDto(true, subscription.Status, subscription.CreateAt.AddMonths(1)));
  }

  [Authorize]
  [HttpGet("/api/SubScription/mine")]
  public async Task<ActionResult<List<MySubscriptionDto>>> GetMySubscriptions()
  {
    var userId = User.GetUserId();

    var subscriptions = await _db.Subscriptions
      .Where(s => s.UserId == userId)
      .Include(s => s.Support!).ThenInclude(sp => sp.User)
      .OrderByDescending(s => s.CreateAt)
      .Select(s => new MySubscriptionDto(
        s.SubscriptionId,
        s.SupportId,
        s.Support!.Name,
        s.Support!.Icon,
        s.Support!.Amount,
        s.Support!.IsMonthly,
        s.Support!.UserId,
        s.Support!.User!.Name,
        s.Support!.User!.Avatar,
        s.Support!.User!.ProductName,
        s.Support!.User!.Prefecture,
        s.Support!.User!.Address,
        s.CreateAt))
      .ToListAsync();

    return Ok(subscriptions);
  }

  [Authorize]
  [HttpGet("/api/SubScription/creator/mine")]
  public async Task<ActionResult<List<CreatorSupporterDto>>> GetMySupporters()
  {
    var userId = User.GetUserId();

    var supporters = await _db.Subscriptions
      .Where(s => s.Support!.UserId == userId)
      .Include(s => s.User)
      .Include(s => s.Support)
      .OrderByDescending(s => s.CreateAt)
      .Select(s => new CreatorSupporterDto(
        s.SubscriptionId,
        s.UserId,
        s.User!.Name,
        s.User!.Avatar,
        s.SupportId,
        s.Support!.Name,
        s.Support!.Icon,
        s.Support!.Amount,
        s.CreateAt,
        _db.Thanks.Any(t => t.SubscriptionId == s.SubscriptionId)))
      .ToListAsync();

    return Ok(supporters);
  }

  [Authorize]
  [HttpGet("/api/SubScription/creator/stats")]
  public async Task<ActionResult<CreatorSubscriptionStatsDto>> GetCreatorStats()
  {
    var userId = User.GetUserId();
    var monthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);

    var subscriberIds = await _db.Subscriptions
      .Where(s => s.Support!.UserId == userId)
      .Select(s => s.UserId)
      .Distinct()
      .ToListAsync();

    var thisMonthCount = await _db.Subscriptions
      .CountAsync(s => s.Support!.UserId == userId && s.CreateAt >= monthStart);

    return Ok(new CreatorSubscriptionStatsDto(subscriberIds.Count, thisMonthCount));
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

    var expiresAt = subscription?.CreateAt.AddMonths(1);
    return Ok(new SubscriptionStatusDto(subscription is not null, subscription?.Status, expiresAt));
  }
}
