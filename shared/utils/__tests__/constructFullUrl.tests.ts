import { constructFullUrl } from "../constructFullUrl";

jest.mock("@/shared/env.constants.ts", () => ({
  S3_CDN_BASE_URL: "http://example.com",
}));

describe("constructFullUrl", () => {
  it("should construct a full URL for an image file", () => {
    const pathname = "/mock-bucket//image1.png";

    const result = constructFullUrl(pathname);

    expect(result).toBe("http://example.com/mock-bucket//image1.png");
  });

  it("should construct a full URL for a PDF file", () => {
    const pathname = "/mock-bucket//fileOne.pdf";

    const result = constructFullUrl(pathname);

    expect(result).toBe("http://example.com/mock-bucket//fileOne.pdf");
  });

  it("should return an empty string when pathname is undefined", () => {
    const pathname = undefined;
    expect(constructFullUrl(pathname)).toBe("");
  });

  it("should return an empty string when pathname is null", () => {
    const pathname = null;
    expect(constructFullUrl(pathname)).toBe("");
  });
});
