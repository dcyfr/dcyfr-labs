import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ZoomableImage } from "../zoomable-image";

describe("ZoomableImage", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test image",
  };

  beforeEach(() => {
    // Reset body overflow style
    document.body.style.overflow = "";
  });

  it("renders the image with correct props", () => {
    render(<ZoomableImage {...defaultProps} />);
    const img = screen.getByRole("button", { name: /zoom image/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-image.jpg");
    expect(img).toHaveAttribute("alt", "Test image");
  });

  it("shows zoom icon on hover (via CSS)", () => {
    const { container } = render(<ZoomableImage {...defaultProps} />);
    const zoomIcon = container.querySelector('[aria-hidden="true"]');
    expect(zoomIcon).toBeInTheDocument();
  });

  it("opens lightbox modal on click", async () => {
    const user = userEvent.setup();
    render(<ZoomableImage {...defaultProps} />);
    
    // Click the image
    const img = screen.getByRole("button", { name: /zoom image/i });
    await user.click(img);

    // Modal should be visible
    const modal = screen.getByRole("button", { name: /close zoomed image/i });
    expect(modal).toBeInTheDocument();
    
    // Should show the zoomed image
    const zoomedImg = screen.getAllByAltText("Test image")[1]; // Second image in modal
    expect(zoomedImg).toBeInTheDocument();
    expect(zoomedImg).toHaveClass("cursor-zoom-out");
  });

  it("opens lightbox on Enter key", async () => {
    const user = userEvent.setup();
    render(<ZoomableImage {...defaultProps} />);
    
    const img = screen.getByRole("button", { name: /zoom image/i });
    img.focus();
    await user.keyboard("{Enter}");

    const modal = screen.getByRole("button", { name: /close zoomed image/i });
    expect(modal).toBeInTheDocument();
  });

  it("opens lightbox on Space key", async () => {
    const user = userEvent.setup();
    render(<ZoomableImage {...defaultProps} />);
    
    const img = screen.getByRole("button", { name: /zoom image/i });
    img.focus();
    await user.keyboard(" ");

    const modal = screen.getByRole("button", { name: /close zoomed image/i });
    expect(modal).toBeInTheDocument();
  });

  it("closes modal on Escape key", async () => {
    const user = userEvent.setup();
    render(<ZoomableImage {...defaultProps} />);
    
    // Open modal
    const img = screen.getByRole("button", { name: /zoom image/i });
    await user.click(img);
    
    expect(screen.getByRole("button", { name: /close zoomed image/i })).toBeInTheDocument();

    // Press Escape
    await user.keyboard("{Escape}");

    // Modal should be closed
    expect(screen.queryByRole("button", { name: /close zoomed image/i })).not.toBeInTheDocument();
  });

  it("closes modal on backdrop click", async () => {
    const user = userEvent.setup();
    render(<ZoomableImage {...defaultProps} />);
    
    // Open modal
    const img = screen.getByRole("button", { name: /zoom image/i });
    await user.click(img);
    
    const modal = screen.getByRole("button", { name: /close zoomed image/i });
    expect(modal).toBeInTheDocument();

    // Click backdrop
    await user.click(modal);

    // Modal should be closed
    expect(screen.queryByRole("button", { name: /close zoomed image/i })).not.toBeInTheDocument();
  });

  it("closes modal when clicking the zoomed image", async () => {
    const user = userEvent.setup();
    render(<ZoomableImage {...defaultProps} />);
    
    // Open modal
    const img = screen.getByRole("button", { name: /zoom image/i });
    await user.click(img);
    
    // Click the zoomed image
    const zoomedImg = screen.getAllByAltText("Test image")[1];
    await user.click(zoomedImg);

    // Modal should be closed
    expect(screen.queryByRole("button", { name: /close zoomed image/i })).not.toBeInTheDocument();
  });

  it("prevents body scroll when modal is open", async () => {
    const user = userEvent.setup();
    render(<ZoomableImage {...defaultProps} />);
    
    // Body should be scrollable initially
    expect(document.body.style.overflow).toBe("");

    // Open modal
    const img = screen.getByRole("button", { name: /zoom image/i });
    await user.click(img);

    // Body scroll should be prevented
    expect(document.body.style.overflow).toBe("hidden");

    // Close modal
    await user.keyboard("{Escape}");

    // Body scroll should be restored
    expect(document.body.style.overflow).toBe("");
  });

  it("applies custom className to the image", () => {
    render(<ZoomableImage {...defaultProps} className="custom-class" />);
    const img = screen.getByRole("button", { name: /zoom image/i });
    expect(img).toHaveClass("custom-class");
  });

  it("shows close hint in modal", async () => {
    const user = userEvent.setup();
    render(<ZoomableImage {...defaultProps} />);
    
    // Open modal
    const img = screen.getByRole("button", { name: /zoom image/i });
    await user.click(img);

    // Check for close hint text
    expect(screen.getByText(/click or press esc to close/i)).toBeInTheDocument();
  });

  it("is keyboard accessible", () => {
    render(<ZoomableImage {...defaultProps} />);
    const img = screen.getByRole("button", { name: /zoom image/i });
    
    // Should be focusable
    expect(img).toHaveAttribute("tabIndex", "0");
  });
});
