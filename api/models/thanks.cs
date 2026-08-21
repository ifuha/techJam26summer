namespace Api.Model;

public class Thanks
{
  public Guid ThanksId { get;set; }
  public Guid SubscriptionId { get;set; }
  public Subscription? Subscription { get;set; }
  public DateTime CreateAt { get;set; }
}
