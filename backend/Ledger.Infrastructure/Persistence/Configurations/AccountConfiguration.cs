using Ledger.Domain.Accounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ledger.Infrastructure.Persistence.Configurations;

public sealed class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ToTable("Accounts");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
            .HasConversion(
                id => id.Value,
                value => new AccountId(value)
            )
            .ValueGeneratedNever();

        builder.Property(a => a.CustomerName)
            .HasMaxLength(120)
            .IsRequired();

        builder.Property(a => a.Phone)
            .HasMaxLength(40);

        builder.Property(a => a.AccountNumber)
            .HasMaxLength(40);

        builder.Property(a => a.IsDeleted)
    .IsRequired();

        builder.Property(a => a.DeletedAtUtc);


        builder.Property(a => a.CreatedAtUtc)
            .IsRequired();

        // 1 Account -> many LedgerEntries
        builder.HasMany(a => a.Entries)
            .WithOne()
            .HasForeignKey(e => e.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        // Map private backing field for encapsulation
        builder.Navigation(a => a.Entries)
            .HasField("_entries")
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
