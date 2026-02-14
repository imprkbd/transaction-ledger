using Ledger.Application.Abstractions;
using Ledger.Application.Accounts.Dtos;
using Ledger.Application.Common;
using Ledger.Application.Common.Paging;
using Ledger.Domain.Accounts;

namespace Ledger.Application.Accounts;

public sealed class AccountService : IAccountService
{
    private readonly IAccountRepository _accounts;
    private readonly ILedgerEntryRepository _entries;

    public AccountService(IAccountRepository accounts, ILedgerEntryRepository entries)
    {
        _accounts = accounts;
        _entries = entries;
    }

    public async Task<AccountDto> CreateAsync(CreateAccountRequest request, CancellationToken ct)
    {
        var account = Account.Create(request.CustomerName, request.Phone, request.AccountNumber);

        await _accounts.AddAsync(account, ct);
        await _accounts.SaveChangesAsync(ct);

        return new AccountDto(
            account.Id.Value,
            account.CustomerName,
            account.Phone,
            account.AccountNumber,
            0m,
            account.IsDeleted,
            account.CreatedAtUtc,
            account.DeletedAtUtc
        );
    }

    // public async Task<List<AccountDto>> GetAllAsync(CancellationToken ct)
    // {
    //     var accounts = await _accounts.GetAllAsync(ct);

    //     // simple approach: compute balance per account
    //     var result = new List<AccountDto>(accounts.Count);

    //     foreach (var a in accounts)
    //     {
    //         var entries = await _entries.GetByAccountIdAsync(a.Id, ct);
    //         var balance = entries.Sum(e => e.SignedAmount());

    //         result.Add(new AccountDto(
    //             a.Id.Value,
    //             a.CustomerName,
    //             a.Phone,
    //             a.AccountNumber,
    //             balance,
    //             a.CreatedAtUtc
    //         ));
    //     }

    //     return result;
    // }

    public async Task<PagedResult<AccountDto>> GetPagedAsync(AccountsQuery query, CancellationToken ct)
    {
        var paged = await _accounts.GetPagedAsync(query.Page, query.PageSize, query.Status, ct);

        var items = new List<AccountDto>(paged.Items.Count);

        foreach (var a in paged.Items)
        {
            var entries = await _entries.GetByAccountIdAsync(a.Id, ct);
            var balance = entries.Sum(e => e.SignedAmount());

            items.Add(new AccountDto(
                a.Id.Value,
                a.CustomerName,
                a.Phone,
                a.AccountNumber,
                balance,
                a.IsDeleted,
                a.CreatedAtUtc,
                a.DeletedAtUtc
            ));
        }

        return new PagedResult<AccountDto>(items, paged.Page, paged.PageSize, paged.TotalCount);
    }

    public async Task<AccountDto> UpdateAsync(Guid accountId, UpdateAccountRequest request, CancellationToken ct)
    {
        var id = new AccountId(accountId);
        var account = await _accounts.GetByIdAsync(id, ct);

        if (account is null)
            throw new AppException("Account not found.");

        account.UpdateCustomer(request.CustomerName, request.Phone, request.AccountNumber);

        await _accounts.SaveChangesAsync(ct);

        var entries = await _entries.GetByAccountIdAsync(account.Id, ct);
        var balance = entries.Sum(e => e.SignedAmount());

        return new AccountDto(
            account.Id.Value,
            account.CustomerName,
            account.Phone,
            account.AccountNumber,
            balance,
            account.IsDeleted,
            account.CreatedAtUtc,
            account.DeletedAtUtc
        );
    }

    public async Task DeleteAsync(Guid accountId, CancellationToken ct)
    {
        var id = new AccountId(accountId);
        var account = await _accounts.GetByIdAsync(id, ct);

        if (account is null)
            throw new AppException("Account not found.");

        account.SoftDelete();
        await _accounts.SaveChangesAsync(ct);
    }
}
