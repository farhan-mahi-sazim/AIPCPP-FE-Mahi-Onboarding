import { convertDataToMantineSelectData, getNestedObjectValue } from "../objects";

// @see https://github.com/jsdom/jsdom/issues/3363
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

describe("objects", () => {
  describe("convertDataToMantineSelectData", () => {
    test("Converts object to Mantine Select data prop", () => {
      const testInput = [
        { attr1: 123, attr2: "test string" },
        { attr1: true, attr2: { test: 1 } },
      ];
      const expectedResult = [
        {
          label: "123",
          value: "test string",
        },
        {
          label: "true",
          value: "[object Object]",
        },
      ];
      const actualResult = convertDataToMantineSelectData(testInput, "attr1", "attr2");
      expect(actualResult).toEqual(expectedResult);
    });

    test("converts a nested object to Mantine Select data prop", () => {
      const testInput = [
        { id: 1, nested: { attr1: 123, attr2: "test string" } },
        { id: 2, nested: { attr1: 123, attr2: "test string 2" } },
        { id: 3, nested: { attr1: 123, attr2: "test string 3" } },
      ];

      const expectedResult = [
        {
          label: "test string",
          value: "1",
        },
        {
          label: "test string 2",
          value: "2",
        },
        {
          label: "test string 3",
          value: "3",
        },
      ];

      const actualResult = convertDataToMantineSelectData(testInput, "nested.attr2", "id");
      expect(actualResult).toEqual(expectedResult);
    });

    test("converts a nested object to Mantine Select data prop with a formatLabel function", () => {
      const testInput = [
        { id: 1, nested: { attr1: 123, attr2: "test string" } },
        { id: 2, nested: { attr1: 123, attr2: "test string 2" } },
        { id: 3, nested: { attr1: 123, attr2: "test string 3" } },
      ];

      const expectedResult = [
        {
          label: "Formatted test string",
          value: "1",
        },
        {
          label: "Formatted test string 2",
          value: "2",
        },
        {
          label: "Formatted test string 3",
          value: "3",
        },
      ];

      const actualResult = convertDataToMantineSelectData(
        testInput,
        "nested.attr2",
        "id",
        (label) => `Formatted ${label}`,
      );
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe("getNestedObjectValue", () => {
    test("returns nullish values", () => {
      const testInput = { attr1: { attr2: undefined } };
      const expectedResult = undefined;
      const actualResult = getNestedObjectValue(testInput, "attr1.attr2");
      expect(actualResult).toEqual(expectedResult);
    });

    test("returns value for a non-nested path", () => {
      const testInput = { attr1: 123 };
      const expectedResult = 123;
      const actualResult = getNestedObjectValue(testInput, "attr1");
      expect(actualResult).toEqual(expectedResult);
    });

    test("doesn't throw an error when path is empty", () => {
      const testInput = { attr1: { attr2: undefined } };
      const expectedResult = testInput;
      const actualResult = getNestedObjectValue(testInput, "");
      expect(actualResult).toEqual(expectedResult);
    });

    test("returns value of nested object with multi layered nested keys", () => {
      const testInput = {
        nested: { attr1: 123, attr2: { test: { test2: { test3: 1 } } } },
      };
      const expectedResult = 1;
      const actualResult = getNestedObjectValue(testInput, "nested.attr2.test.test2.test3");
      expect(actualResult).toEqual(expectedResult);
    });
  });
});
