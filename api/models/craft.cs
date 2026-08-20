namespace Api.Model;

public class Craft
{
  public Guid CraftId { get;set; }
  public string ProductName { get;set; } = string.Empty;
  public string? Address { get;set; }
  public string? Prefecture { get;set; }
  public double? Latitude { get;set; }
  public double? Longitude { get;set; }
  public string? Image { get;set; }
  public string? Description { get;set; }
  public DateTime CreateAt { get;set; }
  public ICollection<User> Successors { get;set; } = new List<User>();
}
