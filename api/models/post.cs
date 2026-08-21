namespace Api.Model;

public class Post
{
  public Guid PostId { get;set; }
  public string Title { get;set; } = string.Empty;
  public Guid UserId { get;set; }
  public User? User { get;set; }
  public string ReportMassege { get;set; } = string.Empty;
  public string? Subscription { get;set; } = string.Empty;
  public DateTime CreateAt { get;set; }
  public Guid? SupportId { get;set; }
  public Support? Support { get;set; }
  public ICollection<PostTag> PostTags { get;set; } = new List<PostTag>();
  public ICollection<Like> Likes { get;set; } = new List<Like>();
  public ICollection<PostMedia> Media { get;set; } = new List<PostMedia>();
}