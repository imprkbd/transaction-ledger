namespace Ledger.Application.Ledger.Dtos;

public sealed record AddEntryRequest(
    Guid AccountId,
    int Type, // 1=Debit, 2=Credit
    decimal Amount,
    string? Description
);
