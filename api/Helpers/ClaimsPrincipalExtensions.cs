using System.Security.Claims;

namespace Api.Helpers;

public static class ClaimsPrincipalExtensions
{
  public static Guid GetUserId(this ClaimsPrincipal principal)
  {
    var value = principal.FindFirstValue(ClaimTypes.NameIdentifier);
    return Guid.Parse(value!);
  }
}
