namespace Ledger.Application.Accounts.Dtos;

public sealed record CreateAccountRequest(
    string CustomerName,
    string? Phone,
    string? AccountNumber
);
