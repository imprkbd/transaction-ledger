using Ledger.Domain.Accounts;

namespace Ledger.Application.Abstractions;

public interface IAccountRepository
{
    Task AddAsync(Account account, CancellationToken ct);
    Task<Account?> GetByIdAsync(AccountId id, CancellationToken ct);
    Task<List<Account>> GetAllAsync(CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}
