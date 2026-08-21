namespace Api.Dto;

public record CraftSummaryDto(
  Guid CraftId,
  string ProductName,
  string? Address,
  string? Prefecture,
  double? Latitude,
  double? Longitude,
  string? Image,
  int SuccessorCount);

public record CraftDetailDto(
  Guid CraftId,
  string ProductName,
  string? Address,
  string? Prefecture,
  double? Latitude,
  double? Longitude,
  string? Image,
  string? Description,
  string? Reading,
  string? Category,
  string? Certification,
  List<string> Features,
  List<string> ProductionAreas,
  int SuccessorCount,
  List<UserPublicDto> Successors,
  DateTime CreateAt);

public record CraftCreateRequestDto(
  string ProductName,
  string? Address,
  string? Prefecture,
  string? Image,
  string? Description,
  string? Reading,
  string? Category,
  string? Certification,
  List<string>? Features,
  List<string>? ProductionAreas);

public record CraftPatchRequestDto(
  string? ProductName,
  string? Address,
  string? Prefecture,
  string? Image,
  string? Description,
  string? Reading,
  string? Category,
  string? Certification,
  List<string>? Features,
  List<string>? ProductionAreas);
