using Ledger.Application.Accounts;
using Ledger.Application.Ledger;
using Microsoft.Extensions.DependencyInjection;

namespace Ledger.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<ILedgerService, LedgerService>();
        return services;
    }
}
