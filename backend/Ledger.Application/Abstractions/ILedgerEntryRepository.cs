using Ledger.Domain.Accounts;
using Ledger.Domain.Ledger;

namespace Ledger.Application.Abstractions;

public interface ILedgerEntryRepository
{
    Task AddAsync(LedgerEntry entry, CancellationToken ct);
    Task<List<LedgerEntry>> GetByAccountIdAsync(AccountId accountId, CancellationToken ct);
}
