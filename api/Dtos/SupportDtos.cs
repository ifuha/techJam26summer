namespace Api.Dto;

public record SupportDto(
  Guid SupportId,
  bool IsMonthly,
  int Amount,
  DateTime CreateAt,
  Guid UserId);

public record SupportCreateRequestDto(bool IsMonthly, int Amount);
