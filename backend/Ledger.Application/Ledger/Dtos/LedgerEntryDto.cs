namespace Ledger.Application.Ledger.Dtos;

public sealed record LedgerEntryDto(
    Guid Id,
    Guid AccountId,
    int Type,
    decimal Amount,
    string? Description,
    DateTime CreatedAtUtc
);
