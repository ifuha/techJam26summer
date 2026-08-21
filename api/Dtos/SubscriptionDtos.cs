namespace Api.Dto;

public record SubscriptionCreateRequestDto(Guid SupportId);

public record SubscriptionStatusDto(bool IsSubscribed, bool? Status, DateTime? ExpiresAt);

public record CreatorSubscriptionStatsDto(int SubscriberCount, int ThisMonthCount);

public record MySubscriptionDto(
  Guid SubscriptionId,
  Guid SupportId,
  string SupportName,
  int Amount,
  bool IsMonthly,
  Guid CreatorUserId,
  string CreatorName,
  string? CreatorAvatar,
  string? CreatorProductName,
  string? CreatorPrefecture,
  string? CreatorAddress,
  DateTime CreateAt);

public record CreatorSupporterDto(
  Guid SubscriptionId,
  Guid SupporterUserId,
  string SupporterName,
  string? SupporterAvatar,
  Guid SupportId,
  string SupportName,
  DateTime CreateAt,
  bool IsThanked);
