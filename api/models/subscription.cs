namespace Api.Model;

public class Subscription
{
  public Guid SubscriptionId { get;set; }
  public Guid SupportId { get;set; }
  public Support? Support { get;set; }
  public Guid UserId { get;set; }
  public User? User { get;set; }
  public bool? Status { get;set; }
}