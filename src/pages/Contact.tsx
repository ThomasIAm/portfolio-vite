import { Layout } from "@/components/layout/Layout";
import { Mail, Linkedin, Github, MapPin, Gitlab } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";

const contactMethods = [
  {
    icon: Mail,
    label: "Work Email",
    value: "thomas.vandennieuwenhoff@salt-security.com",
    href: "mailto:thomas.vandennieuwenhoff@salt-security.com",
    description: "Best for professional inquiries",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/tvdn",
    href: "https://linkedin.com/in/tvdn",
    description: "Connect professionally",
  },
  {
    icon: Github,
    label: "Code",
    description: "Check out my repositories",
    links: [
      { icon: Github, label: "GitHub", href: "https://github.com/tvdn" },
      { icon: Gitlab, label: "GitLab", href: "https://gitlab.com/tvdn" },
    ],
  },
];

export default function Contact() {
  return (
    <Layout>
      <SEO
        title="Contact"
        description="Get in touch with Thomas van den Nieuwenhoff for cyber security consulting, speaking engagements, or collaboration opportunities."
        canonical="/contact"
        keywords={["contact cyber security consultant", "hire security expert", "security consulting Netherlands"]}
      />
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Let's Connect
            </h1>
            <p className="text-xl text-muted-foreground">
              Have a question, opportunity, or just want to say hello? I'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {contactMethods.map((method, index) => {
                const hasMultipleLinks = 'links' in method && method.links;
                
                if (hasMultipleLinks) {
                  return (
                    <div
                      key={method.label}
                      className="group p-4 sm:p-6 rounded-2xl bg-card shadow-soft animate-fade-up"
                      style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <method.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                            {method.label}
                          </h2>
                          {method.value && <p className="text-primary font-medium break-all">{method.value}</p>}
                          <p className="text-sm text-muted-foreground mt-1">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 sm:ml-[4.5rem]">
                        {method.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors text-sm font-medium text-foreground"
                          >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                return (
                  <a
                    key={method.label}
                    href={method.href}
                    target={method.href?.startsWith("http") ? "_blank" : undefined}
                    rel={method.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group p-4 sm:p-6 rounded-2xl bg-card shadow-soft hover-lift flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 animate-fade-up"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <method.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                        {method.label}
                      </h2>
                      <p className="text-primary font-medium break-all">{method.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {method.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Location Note */}
            <div className="mt-12 p-6 rounded-2xl bg-muted/50 flex items-start gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground font-medium">Based in the Netherlands</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Available for remote collaboration worldwide. Open to discussing security consulting, speaking engagements, and collaboration opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center animate-fade-up">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Prefer a quick message?
            </h2>
            <p className="text-muted-foreground mb-8">
              Send me a connection request on LinkedIn with a note about what you'd like to discuss.
            </p>
            <Button variant="warm" size="lg" asChild>
              <a
                href="https://linkedin.com/in/tvdn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
