using Ledger.Domain.Common;
using Ledger.Domain.Ledger;

namespace Ledger.Domain.Accounts;

public sealed class Account
{
    public AccountId Id { get; private set; }
    public string CustomerName { get; private set; } = null!;
    public string? Phone { get; private set; }
    public string? AccountNumber { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    private readonly List<LedgerEntry> _entries = new();
    public IReadOnlyCollection<LedgerEntry> Entries => _entries.AsReadOnly();

    // For EF Core
    private Account() { }

    private Account(string customerName, string? phone, string? accountNumber)
    {
        Id = AccountId.New();
        CustomerName = NormalizeRequired(customerName, "Customer name is required.");
        Phone = NormalizeOptional(phone);
        AccountNumber = NormalizeOptional(accountNumber);
        CreatedAtUtc = DateTime.UtcNow;
    }

    public static Account Create(string customerName, string? phone = null, string? accountNumber = null)
        => new(customerName, phone, accountNumber);

    public void UpdateCustomer(string customerName, string? phone, string? accountNumber)
    {
        CustomerName = NormalizeRequired(customerName, "Customer name is required.");
        Phone = NormalizeOptional(phone);
        AccountNumber = NormalizeOptional(accountNumber);
    }

    public LedgerEntry AddEntry(EntryType type, decimal amount, string? description)
    {
        var entry = LedgerEntry.Create(Id, type, amount, description);
        _entries.Add(entry);
        return entry;
    }

    public decimal GetBalance()
        => _entries.Sum(e => e.SignedAmount());

    private static string NormalizeRequired(string value, string errorMessage)
    {
        var trimmed = (value ?? string.Empty).Trim();
        if (trimmed.Length == 0) throw new DomainException(errorMessage);
        if (trimmed.Length > 120) throw new DomainException("Customer name is too long.");
        return trimmed;
    }

    private static string? NormalizeOptional(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrWhiteSpace(trimmed) ? null : trimmed;
    }
}
