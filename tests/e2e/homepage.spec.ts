import { expect, test } from "@playwright/test";

test.describe("public homepage", () => {
  test("renders the product engineering story and submits a mocked enquiry", async ({
    page,
  }) => {
    const cmsHomeRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/v1/public/cms/home"))
        cmsHomeRequests.push(request.url());
    });
    await page.route("**/api/v1/public/cms/home", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ message: "CMS unavailable" }),
      });
    });
    await page.route("**/api/leads", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, reference: "playwright-test" }),
      });
    });

    await page.goto("/");
    expect(cmsHomeRequests).toHaveLength(0);
    await expect(
      page.getByRole("heading", {
        name: /We turn complex business workflows/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Rural Skill & Livelihood OS" }),
    ).toBeVisible();
    await expect(
      page.getByText("RainWood Direct Booking Engine"),
    ).toBeVisible();
    await expect(page.locator("video").first()).toBeVisible();
    await page
      .getByRole("button", { name: /Watch Rural Skill & Livelihood OS demo/i })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("#engineering")).toBeVisible();
    await expect(page.locator("#pricing")).toBeVisible();
    await expect(page.locator("#contact")).toBeAttached();

    const fitsViewport = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(fitsViewport).toBe(true);

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByLabel("Name", { exact: true }).fill("Playwright Tester");
    await page
      .getByLabel("Email", { exact: true })
      .fill("playwright@example.com");
    await page
      .getByLabel("Project enquiry", { exact: true })
      .fill("We need a CMS-connected SaaS website.");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByText(/your enquiry was saved/i)).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: /We turn complex business workflows/i,
      }),
    ).toBeVisible();
    expect(cmsHomeRequests).toHaveLength(0);
  });

  test("renders key content and navigation affordances on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /We turn complex business workflows/i,
      }),
    ).toBeVisible();
    await expect(page.locator("#products")).toBeVisible();
    await expect(page.locator("#contact")).toBeAttached();
    const fitsViewport = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(fitsViewport).toBe(true);
  });
});
