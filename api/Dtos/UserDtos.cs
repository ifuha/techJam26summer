namespace Api.Dto;

public record UserPublicDto(
  Guid UserId,
  string Name,
  string? Avatar,
  bool JobOrCommonMan,
  string? ProductName,
  List<string> Tags,
  DateTime CreateAt);

public record UserAccountDto(
  Guid UserId,
  string Name,
  string Email,
  string? Avatar,
  bool JobOrCommonMan,
  string? Address,
  string? ProductName,
  List<string> Tags,
  DateTime CreateAt);

public record UserPatchRequestDto(string? Name, string? Avatar, string? Address, string? ProductName);
