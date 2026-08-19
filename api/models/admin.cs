using Api.Model;

public class Admin
{
  public Guid AdminId { get;set; }
  public string AdminName { get;set; } = string.Empty;
  public string Email { get;set; } = string.Empty;
  public string Password { get;set; } = string.Empty;
  public Guid UserId { get;set; }
  public User? User { get;set; }
  public Guid PostId { get;set; }
  public Post? Post { get;set; }
}