"use client";

import { ContactForm } from "@/components/contact-form";
import { ContactFormErrorBoundary } from "@/components/contact-form-error-boundary";

export default function ContactPage() {

  return (
    <div className="mx-auto max-w-2xl py-14 md:py-20">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Contact Me</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Feel free to reach out for collaborations, inquiries, or just to say hello!
        </p>
      </div>

      {/* Contact Form */}
      <ContactFormErrorBoundary>
        <ContactForm />
      </ContactFormErrorBoundary>
    </div>
  );
}
