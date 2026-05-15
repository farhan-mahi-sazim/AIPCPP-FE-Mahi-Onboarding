import { convertStringtoRGB } from "../colors";

describe("colors", () => {
  describe("convertStringtoRGB", () => {
    test("Converts empty string to 000000", () => {
      const result = convertStringtoRGB("");

      expect(result).toBe("000000");
    });

    test("Converts string with special characters and numbers to valid RGB format", () => {
      const result = convertStringtoRGB("hello123 @#$ %^&*");

      expect(result).toBe("64577C");
    });
  });
});
