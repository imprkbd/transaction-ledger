using Ledger.Application.Abstractions;
using Ledger.Domain.Accounts;
using Ledger.Domain.Ledger;
using Ledger.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ledger.Infrastructure.Repositories;

public sealed class LedgerEntryRepository : ILedgerEntryRepository
{
    private readonly AppDbContext _db;

    public LedgerEntryRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(LedgerEntry entry, CancellationToken ct)
        => await _db.LedgerEntries.AddAsync(entry, ct);

    public async Task<List<LedgerEntry>> GetByAccountIdAsync(AccountId accountId, CancellationToken ct)
        => await _db.LedgerEntries
            .AsNoTracking()
            .Where(e => e.AccountId == accountId)
            .OrderByDescending(e => e.CreatedAtUtc)
            .ToListAsync(ct);

    public Task SaveChangesAsync(CancellationToken ct)
     => _db.SaveChangesAsync(ct);
}
