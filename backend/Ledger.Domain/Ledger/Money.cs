using Ledger.Domain.Common;

namespace Ledger.Domain.Ledger;

public readonly record struct Money(decimal Value)
{
    public static Money From(decimal value)
    {
        if (value <= 0)
            throw new DomainException("Amount must be greater than 0.");

        // Round to 2 decimal places
        var rounded = decimal.Round(value, 2, MidpointRounding.AwayFromZero);
        return new Money(rounded);
    }
}
