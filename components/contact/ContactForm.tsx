"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

type FormState = {
  fullName: string;
  businessEmail: string;
  phoneNumber: string;
  companyName: string;
  industry: string;
  automate: string;
  companySize: string;
};

const INITIAL_STATE: FormState = {
  fullName: "",
  businessEmail: "",
  phoneNumber: "",
  companyName: "",
  industry: "",
  automate: "",
  companySize: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const inputClasses =
  "w-full rounded-md border border-border bg-bg px-4 h-11 text-body text-text-primary placeholder:text-text-secondary/60 transition-colors duration-fast ease-standard focus:border-accent-primary focus:outline-none";

const labelClasses = "text-small font-medium text-text-primary";

const errorClasses = "mt-1 text-small text-danger";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[+\d][\d\s\-().]{6,}$/.test(value);
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!values.fullName.trim()) next.fullName = "Full name is required.";
    if (!values.businessEmail.trim()) {
      next.businessEmail = "Business email is required.";
    } else if (!isValidEmail(values.businessEmail.trim())) {
      next.businessEmail = "Enter a valid email address.";
    }
    if (!values.phoneNumber.trim()) {
      next.phoneNumber = "Phone number is required.";
    } else if (!isValidPhone(values.phoneNumber.trim())) {
      next.phoneNumber = "Enter a valid phone number.";
    }
    if (!values.industry.trim()) next.industry = "Industry / business type is required.";
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      // Submission wiring (API route / email service) lands in a later phase.
      setSubmitted(true);
      setValues(INITIAL_STATE);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-bg-elevated p-8 text-center shadow-card">
        <h3 className="text-h4">Thanks — we've got it.</h3>
        <p className="mt-2 text-body text-text-secondary">
          We&apos;ll be in touch shortly to schedule your strategy call.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="fullName" className={labelClasses}>
          Full Name<span className="text-danger">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          className={`mt-1.5 ${inputClasses}`}
          value={values.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className={errorClasses}>
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="businessEmail" className={labelClasses}>
            Business Email<span className="text-danger">*</span>
          </label>
          <input
            id="businessEmail"
            type="email"
            className={`mt-1.5 ${inputClasses}`}
            value={values.businessEmail}
            onChange={(e) => update("businessEmail", e.target.value)}
            aria-invalid={Boolean(errors.businessEmail)}
            aria-describedby={errors.businessEmail ? "businessEmail-error" : undefined}
          />
          {errors.businessEmail && (
            <p id="businessEmail-error" className={errorClasses}>
              {errors.businessEmail}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className={labelClasses}>
            Phone Number<span className="text-danger">*</span>
          </label>
          <input
            id="phoneNumber"
            type="tel"
            className={`mt-1.5 ${inputClasses}`}
            value={values.phoneNumber}
            onChange={(e) => update("phoneNumber", e.target.value)}
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
          />
          {errors.phoneNumber && (
            <p id="phoneNumber-error" className={errorClasses}>
              {errors.phoneNumber}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="companyName" className={labelClasses}>
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            className={`mt-1.5 ${inputClasses}`}
            value={values.companyName}
            onChange={(e) => update("companyName", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="industry" className={labelClasses}>
            Industry / Business Type<span className="text-danger">*</span>
          </label>
          <input
            id="industry"
            type="text"
            className={`mt-1.5 ${inputClasses}`}
            value={values.industry}
            onChange={(e) => update("industry", e.target.value)}
            aria-invalid={Boolean(errors.industry)}
            aria-describedby={errors.industry ? "industry-error" : undefined}
          />
          {errors.industry && (
            <p id="industry-error" className={errorClasses}>
              {errors.industry}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="automate" className={labelClasses}>
          What are you looking for?
        </label>
        <textarea
          id="automate"
          rows={3}
          className={`mt-1.5 ${inputClasses} h-auto py-3`}
          value={values.automate}
          onChange={(e) => update("automate", e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="companySize" className={labelClasses}>
          Estimated Company Size
        </label>
        <select
          id="companySize"
          className={`mt-1.5 ${inputClasses}`}
          value={values.companySize}
          onChange={(e) => update("companySize", e.target.value)}
        >
          <option value="">Select an option</option>
          <option value="1-10">1–10 employees</option>
          <option value="11-50">11–50 employees</option>
          <option value="51-200">51–200 employees</option>
          <option value="200+">200+ employees</option>
        </select>
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Submit
      </Button>
    </form>
  );
}
