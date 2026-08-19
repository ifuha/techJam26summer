namespace Api.Model;

public enum PostMediaType
{
  Image,
  Movie,
}

public class PostMedia
{
  public Guid PostMediaId { get;set; }
  public Guid PostId { get;set; }
  public Post? Post { get;set; }
  public string Url { get;set; } = string.Empty;
  public PostMediaType Type { get;set; }
  public int SortOrder { get;set; }
}
