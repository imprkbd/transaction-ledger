namespace Ledger.Application.Common;

public sealed class AppException : Exception
{
    public AppException(string message) : base(message) { }
}
