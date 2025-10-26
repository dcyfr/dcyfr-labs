import { NextResponse } from "next/server";
import { rateLimit, getClientIp, createRateLimitHeaders } from "@/lib/rate-limit";
import { inngest } from "@/inngest/client";

// Rate limit: 3 requests per 60 seconds per IP
const RATE_LIMIT_CONFIG = {
  limit: 3,
  windowInSeconds: 60,
};

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 1000); // Basic sanitization and length limit
}

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = await rateLimit(clientIp, RATE_LIMIT_CONFIG);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            ...createRateLimitHeaders(rateLimitResult),
            "Retry-After": Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { name, email, message } = body as ContactFormData;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message),
    };

    // Validate lengths
    if (sanitizedData.name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (sanitizedData.message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Send event to Inngest for background processing
    // This returns immediately, making the API response much faster
    try {
      await inngest.send({
        name: "contact/form.submitted",
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          message: sanitizedData.message,
          submittedAt: new Date().toISOString(),
          ip: clientIp,
        },
      });

      // Log submission (anonymized)
      console.log("Contact form submission queued:", {
        nameLength: sanitizedData.name.length,
        emailDomain: sanitizedData.email.split('@')[1] || 'unknown',
        messageLength: sanitizedData.message.length,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { 
          success: true,
          message: "Message received successfully. You'll receive a confirmation email shortly." 
        },
        { 
          status: 200,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    } catch (inngestError) {
      console.error("Failed to queue contact form:", inngestError);
      return NextResponse.json(
        { error: "Failed to process your message. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
