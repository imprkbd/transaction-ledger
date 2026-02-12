using Ledger.Domain.Accounts;

namespace Ledger.Domain.Ledger;

public sealed class LedgerEntry
{
    public Guid Id { get; private set; }
    public AccountId AccountId { get; private set; }
    public EntryType Type { get; private set; }
    public Money Amount { get; private set; }
    public string? Description { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    // For EF Core
    private LedgerEntry() { }

    private LedgerEntry(AccountId accountId, EntryType type, Money amount, string? description)
    {
        Id = Guid.NewGuid();
        AccountId = accountId;
        Type = type;
        Amount = amount;
        Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
        CreatedAtUtc = DateTime.UtcNow;
    }

    public static LedgerEntry Create(AccountId accountId, EntryType type, decimal amount, string? description)
        => new(accountId, type, Money.From(amount), description);

    public decimal SignedAmount()
        => Type == EntryType.Credit ? Amount.Value : -Amount.Value;
}
