import { Page } from "@playwright/test";

export function interceptAndExtractId(page: Page, method: string, status: number): Promise<string> {
  let extractedId: string | null = null;
  page.on("response", async (response) => {
    if (response.request().method() === method && response.status() === status) {
      try {
        const contentType = response.headers()["content-type"];
        if (contentType && contentType.includes("application/json")) {
          const responseBody = await response.json();
          if (responseBody.data) {
            extractedId = responseBody.data.id;
          }
        } else {
          console.error("Response is not JSON, skipping extraction");
        }
      } catch (error) {
        console.error("Error parsing response body:", error);
      }
    }
  });

  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (extractedId !== null) {
        clearInterval(checkInterval);
        resolve(extractedId);
      }
    }, 100);
  });
}
