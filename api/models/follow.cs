namespace Api.Model;

public class Follow
{
  public Guid FollowId { get;set; }
  public Guid FollowerId { get;set; }
  public User? Follower { get;set; }
  public Guid FollowedId { get;set; }
  public User? Followed { get;set; }
  public DateTime CreateAt { get;set; }
}