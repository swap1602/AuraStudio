
# Build the .NET 10 application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY AuraStudio.API.csproj ./
RUN dotnet restore AuraStudio.API.csproj

COPY . .
RUN dotnet publish AuraStudio.API.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

# Run the published application
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "AuraStudio.API.dll"]
