import { expect, test } from "@e2e/setup";
import { rest } from "msw";

test("Login - success", async ({ page, worker }) => {
  await worker.use(rest.post(
    `http://127.0.0.1:8000/api/auth/token/`,
    (req, res, ctx) => {
      return res(
        ctx.delay(100),
        ctx.status(200),
        ctx.json({ token: 'test' })
      );
    }
  ));
  await page.goto("http://localhost:3002/auth/login");
  await page.getByPlaceholder('Enter email').click();
  await page.getByPlaceholder('Enter email').fill('test@gmail.com');
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill('test123');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await page.waitForURL('http://localhost:3002/posts');
  await expect(page.url()).toBe('http://localhost:3002/posts');
});
