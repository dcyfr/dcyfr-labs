"use client";

import { ContactForm } from "@/components/contact-form";
import { ContactFormErrorBoundary } from "@/components/contact-form-error-boundary";

export default function ContactPage() {

  return (
    <div className="mx-auto max-w-2xl py-14 md:py-20">
      <div className="space-y-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">Contact Me</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          I&apos;d love to hear from you! Whether you have a question, a project idea, or just want to say hello, feel free to reach out using the form below.
        </p>
      </div>

      {/* Contact Form */}
      <ContactFormErrorBoundary>
        <ContactForm />
      </ContactFormErrorBoundary>
    </div>
  );
}
