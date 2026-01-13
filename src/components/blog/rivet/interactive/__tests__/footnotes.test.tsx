import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Footnotes } from "../footnotes";

describe("Footnotes Component", () => {
  it("renders with collapsed state by default", () => {
    render(
      <Footnotes>
        <div>Footnote content</div>
      </Footnotes>
    );

    const content = screen.getByRole("region");
    expect(content).toHaveClass("max-h-0 opacity-0");
  });

  it("expands when toggle button is clicked", () => {
    render(
      <Footnotes>
        <div>Footnote content</div>
      </Footnotes>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const content = screen.getByRole("region");
    expect(content).toHaveClass("max-h-[5000px] opacity-100");
  });

  it("collapses when toggle button is clicked again", () => {
    render(
      <Footnotes>
        <div>Footnote content</div>
      </Footnotes>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);

    const content = screen.getByRole("region");
    expect(content).toHaveClass("max-h-0 opacity-0");
  });

  it("renders footnotes title", () => {
    render(
      <Footnotes>
        <div>Footnote content</div>
      </Footnotes>
    );

    expect(screen.getByText("Footnotes")).toBeInTheDocument();
  });

  it("handles Enter key to toggle expansion", () => {
    render(
      <Footnotes>
        <div>Footnote content</div>
      </Footnotes>
    );

    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key: "Enter" });

    const content = screen.getByRole("region");
    expect(content).toHaveClass("max-h-[5000px] opacity-100");
  });

  it("handles Space key to toggle expansion", () => {
    render(
      <Footnotes>
        <div>Footnote content</div>
      </Footnotes>
    );

    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key: " " });

    const content = screen.getByRole("region");
    expect(content).toHaveClass("max-h-[5000px] opacity-100");
  });

  it("updates aria-expanded attribute based on state", () => {
    render(
      <Footnotes>
        <div>Footnote content</div>
      </Footnotes>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("accepts custom className", () => {
    const { container } = render(
      <Footnotes className="custom-class">
        <div>Footnote content</div>
      </Footnotes>
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  it("renders children content inside collapsible section", () => {
    render(
      <Footnotes>
        <div data-testid="footnote-content">Custom footnote content</div>
      </Footnotes>
    );

    expect(screen.getByTestId("footnote-content")).toBeInTheDocument();
  });

  it("renders chevron icon that rotates on expand", () => {
    const { container } = render(
      <Footnotes>
        <div>Footnote content</div>
      </Footnotes>
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(svg).toHaveClass("rotate-180");
  });

  it("renders with proper semantic markup", () => {
    const { container } = render(
      <Footnotes>
        <div>Footnote content</div>
      </Footnotes>
    );

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();

    const button = screen.getByRole("button");
    expect(button.tagName).toBe("BUTTON");

    const h3 = screen.getByRole("heading", { level: 3 });
    expect(h3).toHaveTextContent("Footnotes");
  });
});
