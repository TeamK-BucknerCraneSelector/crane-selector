import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/Home/Home", () => ({
  __esModule: true,
  default: () => <h1>Home</h1>,
}));
jest.mock("./components/Request/RequestFlow", () => ({
  __esModule: true,
  default: () => <h1>Request Flow</h1>,
}));
jest.mock("./components/Wizard/WizardFlow", () => ({
  __esModule: true,
  default: () => <h1>Wizard Flow</h1>,
}));

function renderAt(route: string) {
  window.history.pushState({}, "Test page", route);
  return render(<App />);
}

test("renders Home at /", () => {
  renderAt("/");
  expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
});

test("renders RequestFlow at /request-flow", () => {
  renderAt("/request-flow");
  expect(screen.getByRole("heading", { name: /request flow/i })).toBeInTheDocument();
});

test("renders WizardFlow at /wizard-flow", () => {
  renderAt("/wizard-flow");
  expect(screen.getByRole("heading", { name: /wizard flow/i })).toBeInTheDocument();
});
