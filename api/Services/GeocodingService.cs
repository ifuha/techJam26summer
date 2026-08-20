using System.Net.Http.Json;

namespace Api.Services;

public record GeocodeResult(double Latitude, double Longitude);

public class GeocodingService
{
  private readonly HttpClient _httpClient;
  private readonly IConfiguration _configuration;
  private readonly ILogger<GeocodingService> _logger;

  public GeocodingService(HttpClient httpClient, IConfiguration configuration, ILogger<GeocodingService> logger)
  {
    _httpClient = httpClient;
    _configuration = configuration;
    _logger = logger;
  }

  public async Task<GeocodeResult?> GeocodeAsync(string query, CancellationToken cancellationToken = default)
  {
    var apiKey = _configuration["MapTiler:ApiKey"];
    if (string.IsNullOrEmpty(apiKey) || string.IsNullOrWhiteSpace(query))
    {
      return null;
    }

    try
    {
      var url = $"https://api.maptiler.com/geocoding/{Uri.EscapeDataString(query)}.json?key={apiKey}&language=ja&limit=1";
      var response = await _httpClient.GetFromJsonAsync<MapTilerGeocodingResponse>(url, cancellationToken);

      var coordinates = response?.Features?.FirstOrDefault()?.Geometry?.Coordinates;
      if (coordinates is null || coordinates.Length < 2)
      {
        return null;
      }

      return new GeocodeResult(Latitude: coordinates[1], Longitude: coordinates[0]);
    }
    catch (Exception ex)
    {
      _logger.LogWarning(ex, "Geocoding failed for query: {Query}", query);
      return null;
    }
  }

  private class MapTilerGeocodingResponse
  {
    public List<MapTilerFeature>? Features { get; set; }
  }

  private class MapTilerFeature
  {
    public MapTilerGeometry? Geometry { get; set; }
  }

  private class MapTilerGeometry
  {
    public double[]? Coordinates { get; set; }
  }
}
