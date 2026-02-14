namespace Ledger.Application.Common.Paging;

public sealed record PaginationQuery(int Page = 1, int PageSize = 10)
{
    public int SafePage => Page < 1 ? 1 : Page;
    public int SafePageSize => PageSize switch
    {
        < 1 => 10,
        > 100 => 100,
        _ => PageSize
    };

    public int Skip => (SafePage - 1) * SafePageSize;
}
