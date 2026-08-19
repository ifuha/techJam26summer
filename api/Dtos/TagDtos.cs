namespace Api.Dto;

public record TagDto(Guid TagId, string TagName, DateTime CreateAt, Guid UserId);

public record TagCreateRequestDto(string TagName);
