namespace Ledger.Application.Ledger.Dtos;

public sealed record AccountLedgerDto(
    Guid AccountId,
    decimal Balance,
    List<LedgerEntryDto> Entries
);
