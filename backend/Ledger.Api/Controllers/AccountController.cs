using Ledger.Application.Accounts;
using Ledger.Application.Accounts.Dtos;
using Ledger.Application.Common.Paging;
using Microsoft.AspNetCore.Mvc;

namespace Ledger.Api.Controllers;

[ApiController]
[Route("api/accounts")]
public sealed class AccountsController : ControllerBase
{
    private readonly IAccountService _service;

    public AccountsController(IAccountService service)
    {
        _service = service;
    }

    // [HttpPost]
    // public async Task<ActionResult<AccountDto>> Create(
    //     CreateAccountRequest request,
    //     CancellationToken ct)
    // {
    //     var result = await _service.CreateAsync(request, ct);
    //     return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    // }

    [HttpPost]
    public async Task<ActionResult<AccountDto>> Create(
    CreateAccountRequest request,
    CancellationToken ct)
    {
        var result = await _service.CreateAsync(request, ct);
        return Ok(result);
    }

    // [HttpGet]
    // public async Task<ActionResult<List<AccountDto>>> GetAll(CancellationToken ct)
    // {
    //     var result = await _service.GetAllAsync(ct);
    //     return Ok(result);
    // }

    [HttpGet]
    public async Task<ActionResult<PagedResult<AccountDto>>> GetPaged(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string status = "active",
    CancellationToken ct = default)
    {
        var result = await _service.GetPagedAsync(new AccountsQuery(page, pageSize, status), ct);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AccountDto>> Update(
        Guid id,
        UpdateAccountRequest request,
        CancellationToken ct)
    {
        var result = await _service.UpdateAsync(id, request, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return NoContent();
    }
}
