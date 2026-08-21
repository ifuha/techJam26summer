FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY api.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=""
ENTRYPOINT ["sh", "-c", "dotnet api.dll --urls http://0.0.0.0:${PORT:-8080}"]
