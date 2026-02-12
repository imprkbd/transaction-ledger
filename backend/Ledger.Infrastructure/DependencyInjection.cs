using Ledger.Application.Abstractions;
using Ledger.Infrastructure.Persistence;
using Ledger.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ledger.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var conn = configuration.GetConnectionString("Default")
                   ?? "Data Source=ledger.db";

        services.AddDbContext<AppDbContext>(opt => opt.UseSqlite(conn));

        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<ILedgerEntryRepository, LedgerEntryRepository>();

        return services;
    }
}
