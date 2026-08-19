namespace Api.Dto;

public record PostDto(
  Guid PostId,
  string Title,
  Guid UserId,
  string ReportMassege,
  string? Image,
  string? Movie,
  string? Subscription,
  DateTime CreateAt,
  Guid SupportId,
  int LikeCount,
  List<string> Tags);

public record PostCreateRequestDto(
  string Title,
  string ReportMassege,
  string? Image,
  string? Movie,
  string? Subscription,
  Guid SupportId);

public record PostPatchRequestDto(
  string? Title,
  string? ReportMassege,
  string? Image,
  string? Movie,
  string? Subscription,
  Guid? SupportId);
