namespace Api.Dto;

public record PostTagDto(Guid PostId, Guid TagId, string TagName);

public record PostTagCreateRequestDto(Guid PostId, Guid TagId);
