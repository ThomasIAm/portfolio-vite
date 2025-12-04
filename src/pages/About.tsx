import { Layout } from "@/components/layout/Layout";
import { Award, BookOpen, Heart, Briefcase } from "lucide-react";
import profileImage from "@/assets/profile.jpg";

const certifications = [
  "Cloudflare Solutions Architect",
  "Cloudflare Zero Trust Engineer",
  "OpenShift Administrator",
  "SPLUNK Efficiency & Optimization",
];

const experience = [
  {
    title: "Lead Cyber Security Consultant",
    company: "SALT Cyber Security",
    period: "Feb 2022 – Present",
    description: "Leading security consulting engagements, mentoring team members, and delivering enterprise security solutions including Cloudflare implementations and Zero Trust architectures.",
  },
  {
    title: "Cyber Security Consultant",
    company: "SALT Cyber Security",
    period: "Mar 2021 – Feb 2022",
    description: "Delivered security assessments, implemented protective measures, and advised clients on cybersecurity best practices.",
  },
  {
    title: "Application Manager",
    company: "Belastingdienst (Dutch Tax Administration)",
    period: "Sep 2019 – Mar 2021",
    description: "Managed critical applications and infrastructure, ensuring security compliance and operational excellence for government systems.",
  },
  {
    title: "IT Consultant",
    company: "Unica ICT Solutions",
    period: "Feb 2018 – Sep 2019",
    description: "Provided IT consulting services, supporting enterprise clients with infrastructure and security solutions.",
  },
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
    description: "Creating collaborative environments where teams learn from each other and continuously develop their skills.",
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
            {/* Experience Timeline */}
            <div className="mt-16 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-primary" />
                Experience
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                
                <div className="space-y-8">
                  {experience.map((job, index) => (
                    <div key={index} className="relative pl-8">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full bg-primary border-4 border-background" />
                      
                      <div className="p-6 rounded-xl bg-card shadow-soft">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {job.title}
                          </h3>
                          <span className="text-sm text-muted-foreground font-medium">
                            {job.period}
                          </span>
                        </div>
                        <p className="text-primary font-medium mb-2">{job.company}</p>
                        <p className="text-muted-foreground text-sm">{job.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                With years of experience and a robust tech background, I focus on guiding my team and clients to success in the dynamic cyber security landscape. As a certified Cloudflare Solutions Architect and OpenShift Administrator, I stay current with the latest tools and techniques to protect businesses from cyber threats.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                My role as lead consultant extends beyond finding solutions — I'm committed to creating a collaborative and supportive environment within my team, where we learn from each other and continuously develop our skills.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                I believe cybersecurity isn't just about implementing technology — it's about educating and empowering individuals within organizations. I communicate clearly and engagingly with clients, breaking down complex concepts in an understandable way.
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
