namespace Ledger.Application.Common.Paging;

public sealed record PagedResult<T>(
    List<T> Items,
    int Page,
    int PageSize,
    int TotalCount
)
{
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
