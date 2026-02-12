using Ledger.Application.Common;
using Ledger.Domain.Common;
using Microsoft.AspNetCore.Mvc;

namespace Ledger.Api.Middleware;

public sealed class ErrorHandlingMiddleware : IMiddleware
{
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (DomainException ex)
        {
            // Domain validation error (business rule)
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await WriteProblemAsync(context, StatusCodes.Status400BadRequest, ex.Message);
        }
        catch (AppException ex)
        {
            // Application-level error (e.g., not found, invalid request)
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await WriteProblemAsync(context, StatusCodes.Status400BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await WriteProblemAsync(
                context,
                StatusCodes.Status500InternalServerError,
                "Unexpected error occurred."
            );
        }
    }

    private static async Task WriteProblemAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.ContentType = "application/problem+json";

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = statusCode switch
            {
                StatusCodes.Status400BadRequest => "Bad Request",
                StatusCodes.Status500InternalServerError => "Internal Server Error",
                _ => "Error"
            },
            Detail = message
        };

        await context.Response.WriteAsJsonAsync(problem);
    }
}
