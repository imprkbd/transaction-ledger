using Microsoft.Extensions.DependencyInjection;
using Ledger.Application.Accounts;
using Ledger.Application.Ledger;
using Ledger.Application.Dashboard;

namespace Ledger.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<ILedgerService, LedgerService>();
        services.AddScoped<IDashboardService, DashboardService>();
        return services;

    }
}
