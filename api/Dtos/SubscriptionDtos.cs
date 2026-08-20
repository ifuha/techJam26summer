namespace Api.Dto;

public record SubscriptionCreateRequestDto(Guid SupportId);

public record SubscriptionStatusDto(bool IsSubscribed, bool? Status, DateTime? ExpiresAt);
