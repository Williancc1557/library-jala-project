import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "../../components/Loading";

describe("Loading Component", () => {
  it("deve renderizar com mensagem padrão", () => {
    render(<Loading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("deve renderizar com mensagem customizada", () => {
    const customMessage = "Carregando dados...";
    render(<Loading message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("deve exibir spinner de loading", () => {
    const { container } = render(<Loading />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
