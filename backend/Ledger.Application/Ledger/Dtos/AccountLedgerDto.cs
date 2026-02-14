namespace Ledger.Application.Ledger.Dtos;

public sealed record AccountLedgerDto(
    Guid AccountId,
    decimal Balance,
    decimal TotalCredits,
    decimal TotalDebits,
    List<LedgerEntryDto> Entries
);
