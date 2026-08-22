namespace Api.Model;

public class Support
{
  public Guid SupportId { get;set; }
  public string Name { get;set; } = string.Empty;
  public string Icon { get;set; } = "leaf";
  public bool IsMonthly { get;set; }
  public int Amount { get;set; }
  public List<string> Benefits { get;set; } = new List<string>();
  public DateTime CreateAt { get;set; }
  public Guid UserId { get;set; }
  public User? User { get;set; }
  public ICollection<Post> Post { get;set; } = new List<Post>();
}