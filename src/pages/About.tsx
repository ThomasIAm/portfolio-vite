import { Layout } from "@/components/layout/Layout";
import { Award, BookOpen, Heart, Trophy } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SEO } from "@/components/seo/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import profileImage from "@/assets/profile.jpg";

// Certification type with multiple categories and optional logo
interface Certification {
  name: string;
  year: string;
  categories: string[];
  logo?: string; // Path to badge image (e.g., "/lovable-uploads/badge.png")
}

// All certifications with their categories
const certifications: Certification[] = [
  // Cloudflare certifications
  { name: "Cloudflare Accredited Services Architect", year: "2023", categories: ["Cloudflare"] },
  { name: "Cloudflare Zero Trust Engineer", year: "2025", categories: ["Cloudflare", "Cybersecurity"] },
  { name: "Cloudflare Accredited Configuration Engineer", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare Accredited MSSP - Customer Success", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare Accredited MSSP - Services Management", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare Accredited MSSP - Zero Trust", year: "2025", categories: ["Cloudflare", "Cybersecurity"] },
  { name: "Cloudflare Accredited Sales Engineer", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare One - Service Delivery", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare Core - Service Delivery", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare One Pre-Sales Track", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare Core Pre-Sales Track", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare One Sales Track", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare Core Sales Track", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare Sales Professional Level II", year: "2025", categories: ["Cloudflare"] },
  { name: "Cloudflare Implementation Specialist - Zero Trust Services", year: "2023", categories: ["Cloudflare", "Cybersecurity"] },
  // Red Hat
  { name: "Red Hat Certified OpenShift Administrator", year: "2024", categories: ["Red Hat", "Cloud"] },
  // Cybersecurity
  { name: "1Password Business Admin", year: "2025", categories: ["Cybersecurity"] },
  { name: "Splunk Efficency and Optimization", year: "2024", categories: ["Cybersecurity"] },
  { name: "Gold Level - Cyber Resilience: Advanced", year: "2025", categories: ["Cybersecurity"] },
  { name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals", year: "2022", categories: ["Cybersecurity", "Cloud"] },
  { name: "TryHackMe Advent of Cyber 2021", year: "2021", categories: ["Cybersecurity"] },
  // Cloud
  { name: "Microsoft Certified: Azure Fundamentals", year: "2020", categories: ["Cloud"] },
  // Development
  { name: "Mendix Rapid Developer", year: "2021", categories: ["Development"] },
  { name: "GitLab Certified Associate", year: "2021", categories: ["Development"] },
  { name: "Object Oriented PHP", year: "2019", categories: ["Development"] },
  { name: "M001: MongoDB Basics", year: "2018", categories: ["Development"] },
];

// Get all unique categories and count certs per category
const categories = [...new Set(certifications.flatMap(cert => cert.categories))];

const getCertsByCategory = (category: string) => 
  certifications.filter(cert => cert.categories.includes(category));

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
      <SEO
        title="About"
        description="Learn about Thomas van den Nieuwenhoff - Lead Cyber Security Consultant with certifications in Cloudflare, Zero Trust, and OpenShift."
        canonical="/about"
        type="profile"
        keywords={["cyber security expert", "Cloudflare Solutions Architect", "Zero Trust Engineer", "OpenShift Administrator", "SALT Cyber Security"]}
      />
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
                With years of experience and a robust tech background, I focus on guiding my team and clients to success in the dynamic cyber security landscape. As a certified Cloudflare Solutions Architect and OpenShift Administrator, I stay current with the latest tools and techniques to protect businesses from cyber threats.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                My role as lead consultant extends beyond finding solutions — I'm committed to creating a collaborative and supportive environment within my team, where we learn from each other and continuously develop our skills.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                I believe cybersecurity isn't just about implementing technology — it's about educating and empowering individuals within organizations. I communicate clearly and engagingly with clients, breaking down complex concepts in an understandable way.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Certifications Trophy Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Certifications & Achievements
            </h2>
            <p className="text-muted-foreground">Proudly earned credentials</p>
          </AnimatedSection>

          <Tabs defaultValue={categories[0]} className="max-w-6xl mx-auto">
            <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent mb-8">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-4 py-2 rounded-full data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  {category} ({getCertsByCategory(category).length})
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {getCertsByCategory(category).map((cert, index) => (
                    <AnimatedSection
                      key={`${category}-${cert.name}`}
                      variant="scale"
                      delay={index * 50}
                    >
                      <div className="group relative p-6 rounded-2xl bg-gradient-to-b from-amber-50/80 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200/50 dark:border-amber-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Logo or Trophy icon */}
                        <div className="relative flex justify-center mb-4">
                          {cert.logo ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg bg-white dark:bg-gray-800 flex items-center justify-center p-1">
                              <img 
                                src={cert.logo} 
                                alt={`${cert.name} badge`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center shadow-lg">
                              <Trophy className="h-8 w-8 text-white drop-shadow-sm" />
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="relative text-center">
                          <h3 className="font-display text-sm font-bold text-foreground mb-2 leading-tight min-h-[2.5rem] flex items-center justify-center">
                            {cert.name}
                          </h3>
                          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                            {cert.year}
                          </span>
                        </div>
                        
                        {/* Bottom accent */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full bg-gradient-to-r from-amber-400 to-amber-600" />
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
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
