namespace Ledger.Application.Accounts.Dtos;

public sealed record AccountDto(
    Guid Id,
    string CustomerName,
    string? Phone,
    string? AccountNumber,
    decimal Balance,
    bool IsDeleted,
    DateTime CreatedAtUtc,
    DateTime? DeletedAtUtc
);
