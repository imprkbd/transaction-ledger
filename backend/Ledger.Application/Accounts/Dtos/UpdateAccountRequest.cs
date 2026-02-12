namespace Ledger.Application.Accounts.Dtos;

public sealed record UpdateAccountRequest(
    string CustomerName,
    string? Phone,
    string? AccountNumber
);
