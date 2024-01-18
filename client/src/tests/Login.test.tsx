// import { describe, it, expect } from "vitest";
import Login from "../components/Login";
import { render, screen, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

describe("Auth page", () => {
  it("should render without any errors", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  it("username input should be rendered", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInputElement = screen.getByTestId("email-input");
    expect(emailInputElement).toBeInTheDocument();
  });

  it("password input should be rendered", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const passwordInputElement = screen.getByTestId("password-input");
    expect(passwordInputElement).toBeInTheDocument();
  });

  it("Button Login should be rendered", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole("Login-button");
    expect(loginButton).toBeInTheDocument();
  });

  it("heading to be Sign In", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const message = screen.getByTestId("sign-in-title");
    expect(message).toHaveTextContent("Sign in");
  });

  it("Login button to exist", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    fireEvent.submit(screen.getByTestId("on-submit-login"));
    const message = screen.getByTestId("sign-in-title");
    expect(message).toHaveTextContent("Sign in");
  });

  it("email input should be empty on render", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInputElement: HTMLInputElement =
      screen.getByTestId("email-input");
    expect(emailInputElement.value).toBe("");
  });

  it("password input should be empty on render", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const passwordInputElement: HTMLInputElement =
      screen.getByTestId("password-input");
    expect(passwordInputElement.value).toBe("");
  });

  it("Login button should be disabled", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const loginButtonEl = screen.getByRole("Login-button");
    expect(loginButtonEl).toBeDisabled();
  });

  it("error missage should not be visible", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const loginButtonEl = screen.queryByTestId("error-message");
    expect(loginButtonEl).not.toBeInTheDocument();
  });

  it("email input should change", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInputElement: HTMLInputElement =
      screen.getByTestId("email-input");

    const testValue = "test";

    fireEvent.change(emailInputElement, { target: { value: testValue } });
    expect(emailInputElement.value).toBe(testValue);
  });

  it("password input should change", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const testValue = "test";
    const passwordInputElement: HTMLInputElement =
      screen.getByTestId("password-input");

    fireEvent.change(passwordInputElement, { target: { value: testValue } });
    expect(passwordInputElement.value).toBe(testValue);
  });
});

it("Login button should not be disabled if email and password input exist", async () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  const emailInput = "test";
  const passwordInput = "test";

  const emailInputElement: HTMLInputElement = screen.getByTestId("email-input");

  const passwordInputElement: HTMLInputElement =
    screen.getByTestId("password-input");

  fireEvent.change(emailInputElement, { target: { value: emailInput } });
  fireEvent.change(passwordInputElement, { target: { value: passwordInput } });

  const loginButtonEl = screen.getByRole("Login-button");
  expect(loginButtonEl).not.toBeDisabled();
});
// describe("error message", () => {
//   it("renders component", () => {
//     render(<ErrorMessage />);
//     // screen.debug();
//     // const messageContainer = screen.getByTestId("message-container");
//     expect(screen.getByTestId("message-container")).toHaveTextContent(
//       "Something went wrong"
//     );

//     // expect(messageContainer).toHaveTextContent("Something went wrong");
//   });
// });
