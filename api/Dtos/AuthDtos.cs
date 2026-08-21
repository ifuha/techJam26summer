namespace Api.Dto;

public record RegisterRequestDto(
  string Name,
  string Email,
  string Password,
  bool JobOrCommonMan,
  string? Avatar,
  string? Address,
  string? Prefecture,
  string? ProductName,
  string? Bio);

public record LoginRequestDto(string Email, string Password);

public record AuthResponseDto(string Token, Guid UserId, string Name, string Email);
