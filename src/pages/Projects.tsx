import { Layout } from "@/components/layout/Layout";
import { ExternalLink, Github, Lock, Server, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Enterprise Security Framework",
    description: "Developed a comprehensive security framework for enterprise clients, including threat modeling, incident response procedures, and security awareness training programs.",
    tags: ["Security Architecture", "Risk Assessment", "Training"],
    icon: Shield,
  },
  {
    title: "Cloud Infrastructure Hardening",
    description: "Led the security hardening initiative for multi-cloud environments, implementing best practices for Cloudflare, AWS, and Azure deployments.",
    tags: ["Cloudflare", "Cloud Security", "DevSecOps"],
    icon: Server,
  },
  {
    title: "Zero Trust Implementation",
    description: "Designed and deployed zero trust architecture for a financial services client, significantly reducing attack surface and improving security posture.",
    tags: ["Zero Trust", "Identity", "Network Security"],
    icon: Lock,
  },
];

export default function Projects() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Projects & Work
            </h1>
            <p className="text-xl text-muted-foreground">
              A selection of security initiatives and projects I've led or contributed to.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <article
                key={project.title}
                className="group p-8 rounded-2xl bg-card shadow-soft hover-lift animate-fade-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <project.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  {project.title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* GitHub CTA */}
          <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <p className="text-muted-foreground mb-6">
              Want to see more of my work?
            </p>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/tvdn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-5 w-5" />
                View GitHub Profile
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
