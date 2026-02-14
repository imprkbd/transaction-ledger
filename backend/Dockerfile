# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ./Ledger.slnx ./
COPY ./Ledger.Api/Ledger.Api.csproj ./Ledger.Api/
COPY ./Ledger.Application/Ledger.Application.csproj ./Ledger.Application/
COPY ./Ledger.Domain/Ledger.Domain.csproj ./Ledger.Domain/
COPY ./Ledger.Infrastructure/Ledger.Infrastructure.csproj ./Ledger.Infrastructure/

RUN dotnet restore ./Ledger.slnx

COPY . .
WORKDIR /src/Ledger.Api
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

COPY --from=build /app/publish .

# DB stored in /data (volume)
ENV ConnectionStrings__Default="Data Source=/data/ledger.db"

ENTRYPOINT ["dotnet", "Ledger.Api.dll"]
