namespace Api.Dto;

public record CraftFavoriteStatusDto(bool IsFavorited);

public record MyCraftFavoriteDto(
  Guid CraftFavoriteId,
  Guid CraftId,
  string CraftProductName,
  string? CraftAddress,
  string? CraftPrefecture,
  string? CraftImage,
  int SuccessorCount,
  DateTime CreateAt);
