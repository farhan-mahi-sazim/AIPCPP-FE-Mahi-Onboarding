import { generateUniqueFileName } from "../generateUniqueFileName";

describe("generateUniqueFileName function", () => {
  it("should generate a unique filename", () => {
    const originalName = "example.pdf";
    const uniqueFileName = generateUniqueFileName(originalName);
    const regexPattern = /^example_[a-f0-9-]+\.pdf$/;
    expect(uniqueFileName).toMatch(regexPattern);
  });

  it("should handle filenames without extension", () => {
    const originalName = "example";
    const uniqueFileName = generateUniqueFileName(originalName);
    const regexPattern = /^example_[a-f0-9-]+$/;
    expect(uniqueFileName).toMatch(regexPattern);
  });

  it("should handle filenames with multiple dots", () => {
    const originalName = "example.file.pdf";
    const uniqueFileName = generateUniqueFileName(originalName);
    const regexPattern = /^example\.file_[a-f0-9-]+\.pdf$/;
    expect(uniqueFileName).toMatch(regexPattern);
  });

  it("should generate different filenames for different inputs", () => {
    const originalName1 = "example1.jpg";
    const originalName2 = "example2.jpg";
    const uniqueFileName1 = generateUniqueFileName(originalName1);
    const uniqueFileName2 = generateUniqueFileName(originalName2);
    expect(uniqueFileName1).not.toEqual(uniqueFileName2);
  });
});
