import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getClientIp, createRateLimitHeaders } from "@/lib/rate-limit";
import { AUTHOR_EMAIL, FROM_EMAIL } from "@/lib/site-config";

// Check if Resend API key is configured
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const isEmailConfigured = !!RESEND_API_KEY;

// Only initialize Resend if the API key is present
const resend = isEmailConfigured ? new Resend(RESEND_API_KEY) : null;

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

    // Check if email service is configured
    if (!isEmailConfigured || !resend) {
      // Log the submission for monitoring (fully anonymized - no PII)
      console.log("Contact form submission (email not configured):", {
        nameLength: sanitizedData.name.length,
        emailDomain: sanitizedData.email.split('@')[1] || 'unknown',
        messageLength: sanitizedData.message.length,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { 
          success: true,
          message: "Message received. However, email service is not configured. Please contact me directly via social media or GitHub.",
          warning: "Email delivery unavailable"
        },
        { 
          status: 200,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: AUTHOR_EMAIL,
        subject: `Contact form: ${sanitizedData.name}`,
        replyTo: sanitizedData.email,
        text: `From: ${sanitizedData.name} <${sanitizedData.email}>\n\n${sanitizedData.message}`,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }

    // Log successful submission for monitoring (fully anonymized - no PII)
    console.log("Contact form submission sent:", {
      nameLength: sanitizedData.name.length,
      emailDomain: sanitizedData.email.split('@')[1] || 'unknown',
      messageLength: sanitizedData.message.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true,
        message: "Message received successfully" 
      },
      { 
        status: 200,
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
