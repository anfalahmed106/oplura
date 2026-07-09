export type CaseStudyScreenshot = {
  src: string;
  caption: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  fullDetail: string;
  thumbnailImage: string;
  mockupImage: string;
  /** Full embeddable player URL for the modal video. */
  videoUrl: string;
  screenshots: CaseStudyScreenshot[];
};

// Add further entries here to extend the Featured Case Study section.
// CaseStudyCard renders whatever is passed to it, so new case studies only
// require adding one object to this array.
export const caseStudies: CaseStudy[] = [
  {
    slug: "online-tutoring-academy",
    client: "Online Tutoring Academy",
    industry: "Education",
    title: "Online Tutoring Academy - Website & Student Management System",
    summary:
      "A full-stack website and student management system for an online tutoring academy, combining a marketing/enrollment site with a secure PHP/MySQL admin backend for managing students and staff access.",
    fullDetail:
      "Designed and built a complete web presence and internal operations system for an online education academy. The public-facing site handles course discovery, pricing, service information, and lead generation through free-trial and enrollment forms that feed directly into the backend. The admin panel gives staff student record management (add/edit/export), while security is hardened with two-factor authentication (TOTP, HMAC-SHA1-based), bcrypt-hashed admin passwords and backup codes, SHA-256-hashed password-reset tokens, configurable security settings, and a full audit log tracking admin actions for accountability. Built with a custom PHP backend and MySQL database, with .htaccess-level access restrictions on the admin directory, delivering a production-ready, secure platform rather than a static brochure site.",
    thumbnailImage: "/images/case-studies/online-tutoring-academy-thumbnail-v2.png",
    mockupImage: "/images/case-studies/online-tutoring-academy-thumbnail-v2.png",
    videoUrl: "https://www.youtube.com/embed/mF8Cl2fiOzI",
    screenshots: [
      {
        src: "/images/case-studies/online-tutoring-academy-hero.png",
        caption: "The public enrollment site - course discovery, pricing, and lead capture",
      },
      {
        src: "/images/case-studies/online-tutoring-academy-2fa.jpeg",
        caption: "Two-factor authentication guarding every admin login",
      },
      {
        src: "/images/case-studies/online-tutoring-academy-dashboard.png",
        caption: "Admin dashboard for managing student records and enrollment status",
      },
    ],
  },
];
