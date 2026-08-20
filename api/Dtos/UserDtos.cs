namespace Api.Dto;

public record UserPublicDto(
  Guid UserId,
  string Name,
  string? Avatar,
  bool JobOrCommonMan,
  string? ProductName,
  string? Prefecture,
  List<string> Tags,
  DateTime CreateAt);

public record UserAccountDto(
  Guid UserId,
  string Name,
  string Email,
  string? Avatar,
  bool JobOrCommonMan,
  string? Address,
  string? Prefecture,
  string? ProductName,
  List<string> Tags,
  DateTime CreateAt);

public record UserPatchRequestDto(string? Name, string? Avatar, string? Address, string? Prefecture, string? ProductName);
