import { expect, it } from "vitest";
import { render, screen } from "../utils";
import App from "../../App.svelte";

it("should add 2 numbers", () => {
  expect(1 + 1).toEqual(2);
});

it("should render App", () => {
  render(App);
  expect(screen.getByText("Vite + Svelte")).toBeTruthy();
});
