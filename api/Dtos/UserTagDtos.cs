namespace Api.Dto;

public record UserTagDto(Guid UserId, Guid TagId, string TagName);

public record UserTagCreateRequestDto(Guid TagId);
