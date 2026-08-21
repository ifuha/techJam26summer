namespace Api.Model;

public class CraftFavorite
{
  public Guid CraftFavoriteId { get; set; }
  public Guid UserId { get; set; }
  public User? User { get; set; }
  public Guid CraftId { get; set; }
  public Craft? Craft { get; set; }
  public DateTime CreateAt { get; set; }
}
