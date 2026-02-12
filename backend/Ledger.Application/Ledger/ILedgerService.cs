using Ledger.Application.Ledger.Dtos;

namespace Ledger.Application.Ledger;

public interface ILedgerService
{
    Task<LedgerEntryDto> AddEntryAsync(AddEntryRequest request, CancellationToken ct);
    Task<AccountLedgerDto> GetAccountLedgerAsync(Guid accountId, CancellationToken ct);
}
