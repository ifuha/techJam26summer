namespace Api.Dto;

public record SupportDto(
  Guid SupportId,
  string Name,
  string Icon,
  bool IsMonthly,
  int Amount,
  List<string> Benefits,
  DateTime CreateAt,
  Guid UserId);

public record SupportCreateRequestDto(
  string Name,
  string? Icon,
  bool IsMonthly,
  int Amount,
  List<string>? Benefits);

public record SupportPatchRequestDto(
  string? Name,
  string? Icon,
  bool? IsMonthly,
  int? Amount,
  List<string>? Benefits);
