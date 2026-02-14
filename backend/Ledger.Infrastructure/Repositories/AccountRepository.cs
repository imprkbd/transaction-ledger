using Ledger.Application.Abstractions;
using Ledger.Application.Common.Paging;
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

    public Task RemoveAsync(Account account, CancellationToken ct)
    {
        _db.Accounts.Remove(account);
        return Task.CompletedTask;
    }

    public async Task<PagedResult<Account>> GetPagedAsync(int page, int pageSize, string status, string? search, CancellationToken ct)
    {
        var safePage = page < 1 ? 1 : page;
        var safeSize = pageSize < 1 ? 10 : pageSize > 100 ? 100 : pageSize;
        var skip = (safePage - 1) * safeSize;

        IQueryable<Account> q = _db.Accounts.AsNoTracking();

        status = (status ?? "active").Trim().ToLowerInvariant();

        q = status switch
        {
            "inactive" => q.Where(a => a.IsDeleted),
            "all" => q,
            _ => q.Where(a => !a.IsDeleted) // active
        };

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();

            q = q.Where(a =>
                a.CustomerName.ToLower().Contains(s) ||
                (a.Phone != null && a.Phone.ToLower().Contains(s)) ||
                (a.AccountNumber != null && a.AccountNumber.ToLower().Contains(s))
            );
        }

        var total = await q.CountAsync(ct);

        var items = await q
            .OrderByDescending(a => a.CreatedAtUtc)
            .Skip(skip)
            .Take(safeSize)
            .ToListAsync(ct);

        return new PagedResult<Account>(items, safePage, safeSize, total);
    }

    public async Task<(int Total, int Active)> GetAccountCountsAsync(CancellationToken ct)
    {
        var total = await _db.Accounts.CountAsync(ct);
        var active = await _db.Accounts.CountAsync(a => !a.IsDeleted, ct);

        return (total, active);
    }


    public Task SaveChangesAsync(CancellationToken ct)
        => _db.SaveChangesAsync(ct);
}
