import { constructCanliiUrl } from "../constructCanliiUrl";

describe("constructCanliiUrl", () => {
  const CANLII_BASE_URL = "https://www.canlii.org";

  it("should return the original URL when it starts with https://canlii.ca/", () => {
    const input = "https://canlii.ca/t/k7nwq";
    expect(constructCanliiUrl(input, CANLII_BASE_URL)).toBe(input);
  });

  it("should construct full URL when given a relative path starting with /en/", () => {
    const input = "/en/on/onltb/doc/2024/2024onltb2684/2024onltb2684.html";
    const expected = "https://www.canlii.org/en/on/onltb/doc/2024/2024onltb2684/2024onltb2684.html";
    expect(constructCanliiUrl(input, CANLII_BASE_URL)).toBe(expected);
  });

  it("should handle base URLs with trailing slash correctly", () => {
    const input = "/en/on/onltb/doc/2024/2024onltb2684/2024onltb2684.html";
    const baseUrlWithSlash = "https://www.canlii.org/";
    const expected = "https://www.canlii.org/en/on/onltb/doc/2024/2024onltb2684/2024onltb2684.html";
    expect(constructCanliiUrl(input, baseUrlWithSlash)).toBe(expected);
  });

  it("should throw error for invalid URL format", () => {
    const input = "invalid-url";
    expect(() => constructCanliiUrl(input, CANLII_BASE_URL)).toThrow("Invalid CanLII URL format");
  });
});
