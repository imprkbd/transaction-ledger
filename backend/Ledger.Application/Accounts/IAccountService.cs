using Ledger.Application.Accounts.Dtos;
using Ledger.Application.Common.Paging;

namespace Ledger.Application.Accounts;

public interface IAccountService
{
    Task<AccountDto> CreateAsync(CreateAccountRequest request, CancellationToken ct);
    // Task<List<AccountDto>> GetAllAsync(CancellationToken ct);
    Task<PagedResult<AccountDto>> GetPagedAsync(
      AccountsQuery query,
      CancellationToken ct
  );
    Task<AccountDto> UpdateAsync(Guid accountId, UpdateAccountRequest request, CancellationToken ct);
    Task DeleteAsync(Guid accountId, CancellationToken ct);
}
