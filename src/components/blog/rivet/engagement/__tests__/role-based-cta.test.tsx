import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoleBasedCTA, type RoleConfig } from "../role-based-cta";

// Mock gtag
const mockGtag = vi.fn();
Object.defineProperty(window, "gtag", {
  value: mockGtag,
  writable: true,
});

describe("RoleBasedCTA", () => {
  const mockExecutive: RoleConfig = {
    title: "For Executives",
    description: "Get the business impact summary",
    buttonText: "Schedule Assessment",
    buttonHref: "/contact?role=executive",
  };

  const mockDeveloper: RoleConfig = {
    title: "For Developers",
    description: "See implementation patterns",
    buttonText: "View Code Examples",
    buttonHref: "/contact?role=developer",
  };

  const mockSecurity: RoleConfig = {
    title: "For Security Teams",
    description: "Access threat models and audits",
    buttonText: "Download Checklist",
    buttonHref: "/contact?role=security",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all three roles when provided", () => {
      render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      expect(screen.getByText("For Executives")).toBeInTheDocument();
      expect(screen.getByText("For Developers")).toBeInTheDocument();
      expect(screen.getByText("For Security Teams")).toBeInTheDocument();
    });

    it("renders only executive role when provided alone", () => {
      render(<RoleBasedCTA executive={mockExecutive} />);

      expect(screen.getByText("For Executives")).toBeInTheDocument();
      expect(screen.queryByText("For Developers")).not.toBeInTheDocument();
      expect(screen.queryByText("For Security Teams")).not.toBeInTheDocument();
    });

    it("renders only developer role when provided alone", () => {
      render(<RoleBasedCTA developer={mockDeveloper} />);

      expect(screen.getByText("For Developers")).toBeInTheDocument();
      expect(screen.queryByText("For Executives")).not.toBeInTheDocument();
      expect(screen.queryByText("For Security Teams")).not.toBeInTheDocument();
    });

    it("renders only security role when provided alone", () => {
      render(<RoleBasedCTA security={mockSecurity} />);

      expect(screen.getByText("For Security Teams")).toBeInTheDocument();
      expect(screen.queryByText("For Executives")).not.toBeInTheDocument();
      expect(screen.queryByText("For Developers")).not.toBeInTheDocument();
    });

    it("renders combination of executive and developer", () => {
      render(
        <RoleBasedCTA executive={mockExecutive} developer={mockDeveloper} />
      );

      expect(screen.getByText("For Executives")).toBeInTheDocument();
      expect(screen.getByText("For Developers")).toBeInTheDocument();
      expect(screen.queryByText("For Security Teams")).not.toBeInTheDocument();
    });

    it("returns null when no roles provided", () => {
      const { container } = render(<RoleBasedCTA />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Props rendering", () => {
    it("renders correct descriptions for each role", () => {
      render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      expect(screen.getByText("Get the business impact summary")).toBeInTheDocument();
      expect(
        screen.getByText("See implementation patterns")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Access threat models and audits")
      ).toBeInTheDocument();
    });

    it("renders buttons with correct text", () => {
      render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      expect(screen.getByRole("button", { name: /Schedule Assessment for For Executives/ }))
        .toBeInTheDocument();
      expect(screen.getByRole("button", { name: /View Code Examples for For Developers/ }))
        .toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Download Checklist for For Security Teams/ }))
        .toBeInTheDocument();
    });

    it("renders buttons with correct hrefs", () => {
      render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      const executiveButton = screen.getByRole("button", {
        name: /Schedule Assessment for For Executives/,
      });
      const developerButton = screen.getByRole("button", {
        name: /View Code Examples for For Developers/,
      });
      const securityButton = screen.getByRole("button", {
        name: /Download Checklist for For Security Teams/,
      });

      expect(executiveButton).toHaveAttribute("href", "/contact?role=executive");
      expect(developerButton).toHaveAttribute("href", "/contact?role=developer");
      expect(securityButton).toHaveAttribute("href", "/contact?role=security");
    });
  });

  describe("Analytics tracking", () => {
    it("tracks CTA click for executive role", async () => {
      const user = userEvent.setup();
      render(<RoleBasedCTA executive={mockExecutive} />);

      const button = screen.getByRole("button", { name: /Schedule Assessment for For Executives/ });
      await user.click(button);

      expect(mockGtag).toHaveBeenCalledWith("event", "cta_click", {
        cta_type: "role_based",
        role: "executive",
        button_text: "Schedule Assessment",
      });
    });

    it("tracks CTA click for developer role", async () => {
      const user = userEvent.setup();
      render(<RoleBasedCTA developer={mockDeveloper} />);

      const button = screen.getByRole("button", { name: /View Code Examples for For Developers/ });
      await user.click(button);

      expect(mockGtag).toHaveBeenCalledWith("event", "cta_click", {
        cta_type: "role_based",
        role: "developer",
        button_text: "View Code Examples",
      });
    });

    it("tracks CTA click for security role", async () => {
      const user = userEvent.setup();
      render(<RoleBasedCTA security={mockSecurity} />);

      const button = screen.getByRole("button", { name: /Download Checklist for For Security Teams/ });
      await user.click(button);

      expect(mockGtag).toHaveBeenCalledWith("event", "cta_click", {
        cta_type: "role_based",
        role: "security",
        button_text: "Download Checklist",
      });
    });

    it("handles missing gtag gracefully", async () => {
      const user = userEvent.setup();
      const originalGtag = window.gtag;
      Object.defineProperty(window, "gtag", {
        value: undefined,
        writable: true,
      });

      render(<RoleBasedCTA executive={mockExecutive} />);
      const button = screen.getByRole("button", { name: /Schedule Assessment for For Executives/ });

      // Should not throw error
      await expect(user.click(button)).resolves.toBeUndefined();

      Object.defineProperty(window, "gtag", {
        value: originalGtag,
        writable: true,
      });
    });
  });

  describe("Accessibility", () => {
    it("has correct role attribute on container", () => {
      const { container } = render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      const region = container.querySelector('[role="region"]');
      expect(region).toBeInTheDocument();
    });

    it("has descriptive aria-label on container", () => {
      const { container } = render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      const region = container.querySelector('[aria-label]');
      expect(region).toHaveAttribute(
        "aria-label",
        "Role-based call-to-action options"
      );
    });

    it("buttons have descriptive aria-labels", () => {
      render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
        />
      );

      expect(
        screen.getByLabelText(/Schedule Assessment for For Executives/)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/View Code Examples for For Developers/)
      ).toBeInTheDocument();
    });

    it("icons are hidden from screen readers", () => {
      const { container } = render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      const icons = container.querySelectorAll("[aria-hidden=true]");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("buttons are keyboard accessible", async () => {
      const user = userEvent.setup();
      render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
        />
      );

      const executiveButton = screen.getByRole("button", {
        name: /Schedule Assessment for For Executives/,
      });

      // Tab to button
      await user.tab();
      expect(executiveButton).toHaveFocus();

      // Tab to next button
      await user.tab();
      expect(
        screen.getByRole("button", { name: /View Code Examples for For Developers/ })
      ).toHaveFocus();
    });

    it("buttons have focus visible styles", () => {
      render(<RoleBasedCTA executive={mockExecutive} />);

      const button = screen.getByRole("button", { name: /Schedule Assessment for For Executives/ });
      expect(button).toHaveClass("focus:outline-none");
      expect(button).toHaveClass("focus:ring-2");
    });
  });

  describe("Responsive layout", () => {
    it("has responsive grid classes", () => {
      const { container } = render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("grid");
      expect(wrapper).toHaveClass("md:grid-cols-3");
    });

    it("applies custom className", () => {
      const { container } = render(
        <RoleBasedCTA
          executive={mockExecutive}
          className="custom-class"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom-class");
    });
  });

  describe("Design token usage", () => {
    it("renders cards with proper styling", () => {
      const { container } = render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      const cards = container.querySelectorAll(".rounded-lg");
      expect(cards.length).toBe(3);

      // Check for color styling
      expect(container.innerHTML).toContain("blue");
      expect(container.innerHTML).toContain("green");
      expect(container.innerHTML).toContain("red");
    });

    it("uses semantic color tokens for roles", () => {
      const { container } = render(
        <RoleBasedCTA
          executive={mockExecutive}
          developer={mockDeveloper}
          security={mockSecurity}
        />
      );

      // Verify color classes are applied
      expect(container.innerHTML).toContain("blue-600");
      expect(container.innerHTML).toContain("green-600");
      expect(container.innerHTML).toContain("red-600");
    });
  });

  describe("Edge cases", () => {
    it("handles empty string descriptions", () => {
      const roleWithEmptyDesc: RoleConfig = {
        ...mockExecutive,
        description: "",
      };

      render(<RoleBasedCTA executive={roleWithEmptyDesc} />);

      expect(screen.getByText("For Executives")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Schedule Assessment for For Executives/ }))
        .toBeInTheDocument();
    });

    it("handles very long descriptions", () => {
      const longDescription =
        "This is a very long description that goes on and on about the features and benefits of this role-specific call-to-action component and how it can be used to guide different audience segments through their journey.";

      const roleWithLongDesc: RoleConfig = {
        ...mockExecutive,
        description: longDescription,
      };

      render(<RoleBasedCTA executive={roleWithLongDesc} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it("handles special characters in button text", () => {
      const roleWithSpecialChars: RoleConfig = {
        ...mockExecutive,
        buttonText: "Get →",
      };

      render(<RoleBasedCTA executive={roleWithSpecialChars} />);

      expect(screen.getByRole("button", { name: /Get → for For Executives/ })).toBeInTheDocument();
    });

    it("handles URLs with query parameters", () => {
      const roleWithQueryParams: RoleConfig = {
        ...mockExecutive,
        buttonHref: "/contact?role=executive&source=blog&utm_campaign=test",
      };

      render(<RoleBasedCTA executive={roleWithQueryParams} />);

      const button = screen.getByRole("button", { name: /Schedule Assessment for For Executives/ });
      expect(button).toHaveAttribute(
        "href",
        "/contact?role=executive&source=blog&utm_campaign=test"
      );
    });
  });

  describe("Integration scenarios", () => {
    it("renders complete OWASP use case", () => {
      const owasp: {
        executive?: RoleConfig;
        developer?: RoleConfig;
        security?: RoleConfig;
      } = {
        executive: {
          title: "For CISOs & Leaders",
          description: "Understand the business risk",
          buttonText: "Schedule Assessment",
          buttonHref: "/contact?role=executive",
        },
        developer: {
          title: "For Developers",
          description: "Learn secure implementation",
          buttonText: "View Security Patterns",
          buttonHref: "/contact?role=developer",
        },
        security: {
          title: "For Security Teams",
          description: "Access threat analysis",
          buttonText: "Download Framework",
          buttonHref: "/contact?role=security",
        },
      };

      render(<RoleBasedCTA {...owasp} />);

      expect(screen.getByText("For CISOs & Leaders")).toBeInTheDocument();
      expect(screen.getByText("For Developers")).toBeInTheDocument();
      expect(screen.getByText("For Security Teams")).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /Schedule Assessment for For CISOs & Leaders/ }))
        .toBeInTheDocument();
      expect(screen.getByRole("button", { name: /View Security Patterns for For Developers/ }))
        .toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Download Framework for For Security Teams/ }))
        .toBeInTheDocument();
    });
  });
});
