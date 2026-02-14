using Ledger.Application.Abstractions;
using Ledger.Application.Dashboard.Dtos;

namespace Ledger.Application.Dashboard;

public sealed class DashboardService : IDashboardService
{
    private readonly IAccountRepository _accounts;

    public DashboardService(IAccountRepository accounts)
    {
        _accounts = accounts;
    }

    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct)
    {
        var (total, active) = await _accounts.GetAccountCountsAsync(ct);
        return new DashboardStatsDto(total, active);
    }
}
