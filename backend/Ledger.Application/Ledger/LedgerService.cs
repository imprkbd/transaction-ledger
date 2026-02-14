using Ledger.Application.Abstractions;
using Ledger.Application.Common;
using Ledger.Application.Ledger.Dtos;
using Ledger.Domain.Accounts;
using Ledger.Domain.Ledger;

namespace Ledger.Application.Ledger;

public sealed class LedgerService : ILedgerService
{
    private readonly IAccountRepository _accounts;
    private readonly ILedgerEntryRepository _entries;

    public LedgerService(IAccountRepository accounts, ILedgerEntryRepository entries)
    {
        _accounts = accounts;
        _entries = entries;
    }

    public async Task<LedgerEntryDto> AddEntryAsync(AddEntryRequest request, CancellationToken ct)
    {
        var accId = new AccountId(request.AccountId);
        var account = await _accounts.GetByIdAsync(accId, ct);

        if (account is null)
            throw new AppException("Account not found.");

        if (request.Type is not (1 or 2))
            throw new AppException("Invalid entry type. Use 1=Debit, 2=Credit.");

        var type = (EntryType)request.Type;

        var entry = account.AddEntry(type, request.Amount, request.Description);

        // IMPORTANT: explicitly add entry so EF does INSERT instead of UPDATE
        await _entries.AddAsync(entry, ct);

        await _accounts.SaveChangesAsync(ct);

        return new LedgerEntryDto(
            entry.Id,
            entry.AccountId.Value,
            (int)entry.Type,
            entry.Amount.Value,
            entry.Description,
            entry.CreatedAtUtc
        );
    }

    public async Task<AccountLedgerDto> GetAccountLedgerAsync(Guid accountId, CancellationToken ct)
    {
        var accId = new AccountId(accountId);
        var account = await _accounts.GetByIdAsync(accId, ct);

        if (account is null)
            throw new AppException("Account not found.");

        var entries = await _entries.GetByAccountIdAsync(account.Id, ct);

        var totalCredits = entries.Where(e => e.Type == EntryType.Credit).Sum(e => e.Amount.Value);

        var totalDebits = entries.Where(e => e.Type == EntryType.Debit).Sum(e => e.Amount.Value);

        var balance = entries.Sum(e => e.SignedAmount());

        return new AccountLedgerDto(
            account.Id.Value,
            balance,
            totalCredits,
            totalDebits,

            entries.Select(e => new LedgerEntryDto(
                e.Id,
                e.AccountId.Value,
                (int)e.Type,
                e.Amount.Value,
                e.Description,
                e.CreatedAtUtc
            )).ToList()
        );
    }
}
