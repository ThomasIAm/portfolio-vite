import { Gitlab, Github, Linkedin, Mail, Pencil, Bug } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const GITHUB_REPO = "https://github.com/ThomasIAm/portfolio-vite";

const socialLinks = [
  { href: "https://www.linkedin.com/in/tvdn", icon: Linkedin, label: "LinkedIn" },
  { href: "https://github.com/ThomasIAm", icon: Github, label: "GitHub" },
  { href: "https://gitlab.com/ThomasIAm", icon: Gitlab, label: "GitLab" },
  { href: "mailto:thomas.vandennieuwenhoff@salt-security.com", icon: Mail, label: "Email" },
];

// Map routes to source files
const routeToFile: Record<string, string> = {
  "/": "src/pages/Index.tsx",
  "/about": "src/pages/About.tsx",
  "/projects": "src/pages/Projects.tsx",
  "/blog": "src/pages/Blog.tsx",
  "/contact": "src/pages/Contact.tsx",
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  // Get the file path for current route, default to Index for unknown routes
  const currentFile = routeToFile[location.pathname] || routeToFile["/"];
  const editUrl = `${GITHUB_REPO}/edit/main/${currentFile}`;
  const issueUrl = `${GITHUB_REPO}/issues/new/choose`;

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link 
              to="/" 
              className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              Thomas van den Nieuwenhoff
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Lead Cyber Security Consultant
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 pb-16 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Thomas van den Nieuwenhoff. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit on GitHub
            </a>
            <a
              href={issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
            >
              <Bug className="h-3.5 w-3.5" />
              Open Issue
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
