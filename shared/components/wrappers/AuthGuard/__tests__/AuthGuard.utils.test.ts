import { getLoginUrlWithRedirectParam } from "../AuthGuard.utils";

describe("AuthGuard.utils", () => {
  describe("getLoginUrlWithRedirectParam", () => {
    it("should return login url with redirect param", () => {
      const urlWithRedirectParam = getLoginUrlWithRedirectParam("/test");
      expect(urlWithRedirectParam).toEqual("http://localhost/login?redirect=%2Ftest");

      const urlWithRedirectParam2 = getLoginUrlWithRedirectParam("/test/2");
      expect(urlWithRedirectParam2).toEqual("http://localhost/login?redirect=%2Ftest%2F2");

      const urlWithRedirectParam3 = getLoginUrlWithRedirectParam("/test/2?param=1");
      expect(urlWithRedirectParam3).toEqual(
        "http://localhost/login?redirect=%2Ftest%2F2%3Fparam%3D1",
      );
    });
  });
});
