import { Layout } from "@/components/layout/Layout";
import { Award, BookOpen, Heart } from "lucide-react";
import profileImage from "@/assets/profile.jpg";

const certifications = [
  "Cloudflare Solutions Architect",
  "OpenShift Administrator",
];

const values = [
  {
    icon: BookOpen,
    title: "Continuous Learning",
    description: "Staying up-to-date with the latest tools and techniques to shield businesses from cyber threats.",
  },
  {
    icon: Heart,
    title: "Team Growth",
    description: "Believing that a strong team is crucial to success, dedicated to helping each member reach their full potential.",
  },
  {
    icon: Award,
    title: "Clear Communication",
    description: "Breaking down complex concepts into clear, engaging terms that empower individuals within organizations.",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-shrink-0 animate-fade-up">
                <img
                  src={profileImage}
                  alt="Thomas van den Nieuwenhoff"
                  className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover shadow-card"
                />
              </div>
              <div className="text-center md:text-left animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  About Me
                </h1>
                <p className="text-xl text-muted-foreground">
                  Lead Cyber Security Consultant with a passion for empowering businesses in the digital realm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg animate-fade-up">
              <p className="text-lg text-foreground leading-relaxed mb-6">
                With years of experience and a robust tech background, I focus on guiding my team and clients to success in the dynamic cyber security landscape. My approach extends beyond technology — I prioritize educating and empowering individuals within organizations.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                I'm a strong communicator, problem-solver, and critical thinker who thrives in fast-paced environments and relishes challenges. Beyond finding solutions, I foster collaborative environments where teams can grow and develop.
              </p>
            </div>

            {/* Certifications */}
            <div className="mt-16 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Certifications
              </h2>
              <div className="flex flex-wrap gap-3">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What I Value
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl bg-card shadow-soft animate-fade-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <value.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
