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
    label: "GitHub",
    value: "github.com/tvdn",
    href: "https://github.com/tvdn",
    description: "Check out my code",
  },
  {
    icon: Gitlab,
    label: "GitLab",
    value: "gitlab.com/tvdn",
    href: "https://gitlab.com/tvdn",
    description: "Check out my code",
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
              {contactMethods.map((method, index) => (
                <a
                  key={method.label}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group p-6 rounded-2xl bg-card shadow-soft hover-lift flex items-center gap-6 animate-fade-up"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                      {method.label}
                    </h2>
                    <p className="text-primary font-medium">{method.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {method.description}
                    </p>
                  </div>
                </a>
              ))}
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
