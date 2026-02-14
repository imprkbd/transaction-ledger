using Ledger.Domain.Accounts;
using Ledger.Application.Common.Paging;

namespace Ledger.Application.Abstractions;

public interface IAccountRepository
{
    Task AddAsync(Account account, CancellationToken ct);
    Task<Account?> GetByIdAsync(AccountId id, CancellationToken ct);
    Task<PagedResult<Account>> GetPagedAsync(
        int page,
        int pageSize,
        string status,
        string? search,
        CancellationToken ct
    );
    Task<List<Account>> GetAllAsync(CancellationToken ct);
    Task RemoveAsync(Account account, CancellationToken ct);
    Task<(int Total, int Active)> GetAccountCountsAsync(CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}
