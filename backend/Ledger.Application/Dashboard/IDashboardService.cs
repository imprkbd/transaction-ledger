using Ledger.Application.Dashboard.Dtos;

namespace Ledger.Application.Dashboard;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken ct);
}
