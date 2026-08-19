namespace Api.Model;

public class Tag
{
  public Guid TagId { get;set; }
  public string TagName { get;set; } = string.Empty;
  public DateTime CreateAt { get;set; }
  public Guid UserId { get;set; }
  public User? User { get;set; }
}