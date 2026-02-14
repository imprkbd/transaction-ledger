namespace Ledger.Application.Accounts.Dtos;

public sealed record AccountsQuery(
    int Page = 1,
    int PageSize = 10,
    string Status = "active", // active | inactive | all
    string? Search = null
);
