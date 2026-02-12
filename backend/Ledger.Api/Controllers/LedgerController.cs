using Ledger.Application.Ledger;
using Ledger.Application.Ledger.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Ledger.Api.Controllers;

[ApiController]
[Route("api/ledger")]
public sealed class LedgerController : ControllerBase
{
    private readonly ILedgerService _service;

    public LedgerController(ILedgerService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<LedgerEntryDto>> AddEntry(
        AddEntryRequest request,
        CancellationToken ct)
    {
        var result = await _service.AddEntryAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("{accountId:guid}")]
    public async Task<ActionResult<AccountLedgerDto>> GetLedger(
        Guid accountId,
        CancellationToken ct)
    {
        var result = await _service.GetAccountLedgerAsync(accountId, ct);
        return Ok(result);
    }
}
