import { expect, type Page, type Locator } from "@playwright/test";

export class LoginPage {
  readonly PAGE: Page;
  readonly EMAIL_FIELD: Locator;
  readonly PASS_FIELD: Locator;
  readonly LOGIN_BUTTON: Locator;
  readonly REGISTER_LINK: Locator;
  readonly FORGOT_PASS_LINK: Locator;

  constructor(page: Page) {
    this.PAGE = page;
    this.EMAIL_FIELD = page.getByRole("textbox", { name: "email" });
    this.PASS_FIELD = page.getByRole("textbox", { name: "password" });
    this.LOGIN_BUTTON = page.getByRole("button", { name: "Sign In" });
    this.REGISTER_LINK = page.getByRole("button", { name: "Register here." });
    this.FORGOT_PASS_LINK = page.getByRole("button", {
      name: "Forgot your password?",
    });
  }

  async goTo() {
    await this.PAGE.goto("/login");
  }

  async enterEmail(email: string) {
    await this.EMAIL_FIELD.fill(email);
    await expect(this.EMAIL_FIELD).toHaveText(email);
  }

  async enterPass(pass: string) {
    await this.PASS_FIELD.fill(pass);
  }

  async clickLogin() {
    await this.LOGIN_BUTTON.click();
  }

  async clickRegsiter() {
    await this.REGISTER_LINK.click();
  }

  async clickForgotpass() {
    await this.FORGOT_PASS_LINK.click();
  }
}
