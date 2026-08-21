namespace Api.Dto;

public record ThanksCreateRequestDto(Guid SubscriptionId);

public record ThanksDto(Guid ThanksId, Guid SubscriptionId, DateTime CreateAt);
