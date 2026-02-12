using System.Diagnostics;
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
        catch (Exception ex) when (!context.Response.HasStarted)
        {
            context.Response.Clear();

            var (status, title, detail) = ex switch
            {
                DomainException de => (StatusCodes.Status400BadRequest, "Bad Request", de.Message),

                // Optional: return 404 for "not found" messages until you introduce NotFoundException
                AppException ae when ae.Message.Contains("not found", StringComparison.OrdinalIgnoreCase)
                    => (StatusCodes.Status404NotFound, "Not Found", ae.Message),

                AppException ae => (StatusCodes.Status400BadRequest, "Bad Request", ae.Message),

                _ => (StatusCodes.Status500InternalServerError, "Internal Server Error", "Unexpected error occurred.")
            };

            if (status == StatusCodes.Status500InternalServerError)
                _logger.LogError(ex, "Unhandled exception");
            else
                _logger.LogWarning(ex, "Request failed: {Message}", ex.Message);

            await WriteProblemAsync(context, status, title, detail);
        }
        catch (Exception ex)
        {
            // Response already started; we can only log and rethrow
            _logger.LogWarning(ex, "Response already started, cannot write error response");
            throw;
        }
    }

    private static Task WriteProblemAsync(HttpContext context, int statusCode, string title, string detail)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";

        var traceId = Activity.Current?.Id ?? context.TraceIdentifier;

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path
        };

        problem.Extensions["traceId"] = traceId;

        return context.Response.WriteAsJsonAsync(problem);
    }
}
