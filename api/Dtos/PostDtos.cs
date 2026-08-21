namespace Api.Dto;

public record PostMediaDto(Guid PostMediaId, string Url, string Type, int SortOrder);

public record PostMediaInputDto(string Url, string Type);

public record PostDto(
  Guid PostId,
  string Title,
  Guid UserId,
  string? ReportMassege,
  string? Subscription,
  DateTime CreateAt,
  Guid? SupportId,
  bool IsLocked,
  int LikeCount,
  List<string> Tags,
  List<PostMediaDto> Media);

public record PostCreateRequestDto(
  string Title,
  string ReportMassege,
  string? Subscription,
  Guid? SupportId,
  List<PostMediaInputDto>? Media);

public record PostPatchRequestDto(
  string? Title,
  string? ReportMassege,
  string? Subscription,
  Guid? SupportId,
  List<PostMediaInputDto>? Media);
