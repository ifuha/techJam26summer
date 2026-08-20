namespace Api.Dto;

public record AdminRegisterRequestDto(string Name, string Email, string Password);

public record AdminLoginRequestDto(string Email, string Password);

public record AdminAuthResponseDto(string Token, Guid AdminId, string Name, string Email);
