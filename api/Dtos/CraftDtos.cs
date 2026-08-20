namespace Api.Dto;

public record CraftSummaryDto(
  Guid CraftId,
  string ProductName,
  string? Address,
  string? Prefecture,
  double? Latitude,
  double? Longitude,
  string? Image);

public record CraftDetailDto(
  Guid CraftId,
  string ProductName,
  string? Address,
  string? Prefecture,
  double? Latitude,
  double? Longitude,
  string? Image,
  string? Description,
  int SuccessorCount,
  List<UserPublicDto> Successors,
  DateTime CreateAt);

public record CraftCreateRequestDto(
  string ProductName,
  string? Address,
  string? Prefecture,
  string? Image,
  string? Description);

public record CraftPatchRequestDto(
  string? ProductName,
  string? Address,
  string? Prefecture,
  string? Image,
  string? Description);
