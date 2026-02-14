namespace Ledger.Application.Dashboard.Dtos;

public sealed record DashboardStatsDto(
    int TotalAccounts,
    int ActiveAccounts
);
