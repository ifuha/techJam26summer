namespace Api.Model;

public class Like
{
  public Guid LikeId { get;set; }
  public Guid UserId { get;set; }
  public User? User { get;set; }
  public Guid PostId { get;set; }
  public Post? Post { get;set; }
  public DateTime CreateAt { get;set; }
}