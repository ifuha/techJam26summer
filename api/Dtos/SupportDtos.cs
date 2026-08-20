namespace Api.Dto;

public record SupportDto(
  Guid SupportId,
  string Name,
  bool IsMonthly,
  int Amount,
  List<string> Benefits,
  DateTime CreateAt,
  Guid UserId);

public record SupportCreateRequestDto(
  string Name,
  bool IsMonthly,
  int Amount,
  List<string>? Benefits);
