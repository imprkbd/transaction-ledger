export function getApiErrorMessage(error) {
  // Axios error shape
  const status = error?.response?.status;
  const data = error?.response?.data;

  // If backend returns ProblemDetails
  if (data && typeof data === "object") {
    if (typeof data.detail === "string" && data.detail.length)
      return data.detail;
    if (typeof data.title === "string" && data.title.length) return data.title;
  }

  // Common fallback
  if (status) return `Request failed (${status})`;

  return "Network error. Please try again.";
}
