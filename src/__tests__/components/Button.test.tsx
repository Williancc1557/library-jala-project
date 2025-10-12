import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../../components/ui/button";

describe("Button Component", () => {
  it("deve renderizar com texto", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("deve chamar onClick quando clicado", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByText("Click me");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("deve estar desabilitado quando disabled=true", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
  });

  it("deve aplicar variante default por padrão", () => {
    render(<Button>Default Button</Button>);

    const button = screen.getByText("Default Button");
    expect(button).toHaveClass("bg-primary");
  });

  it("deve aplicar variante destructive quando especificado", () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByText("Delete");
    expect(button).toHaveClass("bg-destructive");
  });

  it("deve aplicar tamanho small quando especificado", () => {
    render(<Button size="sm">Small Button</Button>);

    const button = screen.getByText("Small Button");
    expect(button).toHaveClass("h-9");
  });
});
