namespace Api.Model;

public class User
{
  public Guid UserId { get;set; }
  public string Name { get;set; } = string.Empty;
  public string Email { get;set; } = string.Empty;
  public string Password { get;set; } = string.Empty;
  public string? Avatar { get;set; } = string.Empty;
  public bool JobOrCommonMan { get;set; }
  public string? Address { get;set; }
  public string? Prefecture { get;set; }
  public string? ProductName { get;set; }
  public DateTime CreateAt { get;set; }
  public ICollection<Post> Posts { get;set; } = new List<Post>();
  public ICollection<Support> Supports { get;set; } = new List<Support>();
  public ICollection<Subscription> Subscriptions { get;set; } = new List<Subscription>();
  public ICollection<Follow> Followers { get;set; } = new List<Follow>();
  public ICollection<Follow> Followeds { get;set; } = new List<Follow>();
  public ICollection<Tag> Tags { get;set; } = new List<Tag>();
  public ICollection<UserTag> ProfileTags { get;set; } = new List<UserTag>();
}