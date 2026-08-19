namespace Api.Dto;

public record LikeCreateRequestDto(Guid PostId);

public record LikeStatusDto(bool IsLiked);
