export const constructCanliiUrl = (input: string, baseUrl: string) => {
  if (input.startsWith("https://canlii.ca/")) {
    return input;
  }
  if (input.startsWith("/en/")) {
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}${input}`;
  }
  throw new Error("Invalid CanLII URL format");
};
