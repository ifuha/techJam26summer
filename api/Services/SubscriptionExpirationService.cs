using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class SubscriptionExpirationService : BackgroundService
{
  private static readonly TimeSpan CheckInterval = TimeSpan.FromHours(1);

  private readonly IServiceScopeFactory _scopeFactory;
  private readonly ILogger<SubscriptionExpirationService> _logger;

  public SubscriptionExpirationService(IServiceScopeFactory scopeFactory, ILogger<SubscriptionExpirationService> logger)
  {
    _scopeFactory = scopeFactory;
    _logger = logger;
  }

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    using var timer = new PeriodicTimer(CheckInterval);
    do
    {
      try
      {
        await ExpireSubscriptionsAsync(stoppingToken);
      }
      catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
      {
        // A DB hiccup here shouldn't take the whole API down; log and retry
        // on the next tick instead of letting the exception bubble up and
        // stop the host (the default BackgroundServiceExceptionBehavior).
        _logger.LogError(ex, "Failed to expire subscriptions; will retry next interval.");
      }
    } while (await timer.WaitForNextTickAsync(stoppingToken));
  }

  private async Task ExpireSubscriptionsAsync(CancellationToken cancellationToken)
  {
    using var scope = _scopeFactory.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var cutoff = DateTime.UtcNow.AddMonths(-1);
    var expired = await db.Subscriptions
      .Where(s => s.CreateAt <= cutoff && s.Support!.IsMonthly)
      .ToListAsync(cancellationToken);

    if (expired.Count == 0)
    {
      return;
    }

    db.Subscriptions.RemoveRange(expired);
    await db.SaveChangesAsync(cancellationToken);
    _logger.LogInformation("Expired {Count} monthly subscriptions older than 1 month.", expired.Count);
  }
}
