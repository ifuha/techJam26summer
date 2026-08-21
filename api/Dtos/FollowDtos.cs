namespace Api.Dto;

public record FollowStatusDto(bool IsFollowing);

public record FollowerCountDto(int Count);

public record MyFollowDto(
  Guid FollowId,
  Guid FollowedUserId,
  string FollowedName,
  string? FollowedAvatar,
  string? FollowedProductName,
  string? FollowedPrefecture,
  string? FollowedAddress,
  DateTime CreateAt);
