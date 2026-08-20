namespace Api.Model;

public class Admin
{
  public Guid AdminId { get;set; }
  public string Name { get;set; } = string.Empty;
  public string Email { get;set; } = string.Empty;
  public string Password { get;set; } = string.Empty;
  public DateTime CreateAt { get;set; }
}
