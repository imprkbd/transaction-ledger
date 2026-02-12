using Ledger.Application.Abstractions;
using Ledger.Domain.Accounts;
using Ledger.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ledger.Infrastructure.Repositories;

public sealed class AccountRepository : IAccountRepository
{
    private readonly AppDbContext _db;

    public AccountRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Account account, CancellationToken ct)
        => await _db.Accounts.AddAsync(account, ct);

    public async Task<Account?> GetByIdAsync(AccountId id, CancellationToken ct)
        => await _db.Accounts
            .Include(a => a.Entries)
            .FirstOrDefaultAsync(a => a.Id == id, ct);

    public async Task<List<Account>> GetAllAsync(CancellationToken ct)
        => await _db.Accounts
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAtUtc)
            .ToListAsync(ct);

    public Task SaveChangesAsync(CancellationToken ct)
        => _db.SaveChangesAsync(ct);
}
