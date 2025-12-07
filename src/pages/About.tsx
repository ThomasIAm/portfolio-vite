import { Layout } from "@/components/layout/Layout";
import {
  Award,
  BookOpen,
  ExternalLink,
  Heart,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SEO } from "@/components/seo/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import profileImage from "@/assets/profile.jpg";

// Certification type
interface Certification {
  name: string;
  year: string;
  categories: string[];
  logo?: string; // Path to badge image (e.g., "/assets/certifications/badge.png")
  proofUrl?: string; // Link to verification/proof
  infoUrl?: string; // Link to more information about the certification
}

// All certifications with their categories
const certifications: Certification[] = [
  // Cloudflare certifications
  {
    name: "Cloudflare Accredited Services Architect",
    year: "2023",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/asa.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/260ad5dc-bb33-4fea-be51-266c8e80553e",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/260ad5dc-bb33-4fea-be51-266c8e80553e",
  },
  {
    name: "Cloudflare Zero Trust Engineer",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/zte.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/b9b183ab-ff65-4c24-bc79-852aa73a08f4",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/b9b183ab-ff65-4c24-bc79-852aa73a08f4",
  },
  {
    name: "Cloudflare Accredited Configuration Engineer",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/ace.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/446f6fad-4737-477d-8db0-f425a704c134",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/446f6fad-4737-477d-8db0-f425a704c134",
  },
  {
    name: "Cloudflare Accredited MSSP - Customer Success",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/asa.png",
    proofUrl: "/assets/certifications/amcs.pdf",
  },
  {
    name: "Cloudflare Accredited MSSP - Services Management",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/amsp.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/f1db1fd9-e0dc-45eb-b111-47e0a884f24f",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/f1db1fd9-e0dc-45eb-b111-47e0a884f24f",
  },
  {
    name: "Cloudflare Accredited MSSP - Zero Trust",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/amzt.pdf",
  },
  {
    name: "Cloudflare Accredited Sales Engineer",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/ase.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/18688620-b859-4e55-8563-8eee8ed3e0d4",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/18688620-b859-4e55-8563-8eee8ed3e0d4",
  },
  {
    name: "Cloudflare One - Service Delivery",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/sdo.pdf",
  },
  {
    name: "Cloudflare Core - Service Delivery",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/sdc.pdf",
  },
  {
    name: "Cloudflare One Pre-Sales Track",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/pso.pdf",
  },
  {
    name: "Cloudflare Core Pre-Sales Track",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/psc.pdf",
  },
  {
    name: "Cloudflare One Sales Track",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/so.pdf",
  },
  {
    name: "Cloudflare Core Sales Track",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cf.svg",
    proofUrl: "/assets/certifications/sc.pdf",
  },
  {
    name: "Cloudflare Sales Professional Level II",
    year: "2025",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/asp2.png",
    proofUrl:
      "https://university.cloudflare.com/credential/verify/9f8ac9de-4b3c-45b5-b989-8a275a71e6f9",
    infoUrl:
      "https://university.cloudflare.com/credential/verify/9f8ac9de-4b3c-45b5-b989-8a275a71e6f9",
  },
  {
    name: "Cloudflare Implementation Specialist - Zero Trust Services",
    year: "2023",
    categories: ["Cloudflare"],
    logo: "/assets/certifications/cis.png",
    proofUrl: "/assets/certifications/cis.pdf",
  },
  // Red Hat
  {
    name: "Red Hat Certified OpenShift Administrator",
    year: "2024",
    categories: ["Red Hat"],
    logo: "/assets/certifications/ex280.png",
    proofUrl:
      "https://www.credly.com/badges/18f84f10-92f3-4667-9641-2eaa96ad23a4",
    infoUrl: "https://www.redhat.com/en/services/certification/rhcs-paas",
  },
  // Cybersecurity
  {
    name: "1Password Business Admin",
    year: "2025",
    categories: ["Cybersecurity"],
    logo: "/assets/certifications/opba.png",
    proofUrl: "https://verify.skilljar.com/c/dp7nekvp8ety",
    infoUrl:
      "https://www.1password.academy/path/1password-for-business-administrators-certificate",
  },
  {
    name: "Splunk Efficiency and Optimization",
    year: "2024",
    categories: ["Cybersecurity"],
    logo: "/assets/certifications/splunk.png",
    proofUrl: "/assets/certifications/splunk.pdf",
  },
  {
    name: "Gold Level - Cyber Resilience: Advanced",
    year: "2025",
    categories: ["Cybersecurity"],
    logo: "/assets/certifications/phished-gold.svg",
    proofUrl: "/assets/certifications/phished-gold.pdf",
    infoUrl:
      "https://info.phished.io/_hcms/raw-resource?path=Academy%20Roadmap/Academy-roadmap-Gold-FEEDBACK.html&portalId=6615327&t=1713359362477&hs_preview_key=CtrNuUqBmKrAuk1LwanIuw&template_id=163886759038&hsLang=en",
  },
  {
    name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals",
    year: "2022",
    categories: ["Cybersecurity", "Cloud"],
    logo: "/assets/certifications/sc900.png",
    proofUrl:
      "https://www.credly.com/badges/05cde803-0d94-47a5-82f9-a8544f93e681",
    infoUrl:
      "https://docs.microsoft.com/learn/certifications/security-compliance-and-identity-fundamentals/",
  },
  {
    name: "TryHackMe Advent of Cyber 2021",
    year: "2021",
    categories: ["Cybersecurity"],
    logo: "/assets/certifications/thm.svg",
    proofUrl:
      "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-HA7S4NNHD6.png",
  },
  // Cloud
  {
    name: "Microsoft Certified: Azure Fundamentals",
    year: "2020",
    categories: ["Cloud"],
    logo: "/assets/certifications/az900.png",
    proofUrl:
      "https://www.credly.com/badges/352815b1-a44e-4e0f-8f47-91ffeeda86ae",
    infoUrl:
      "https://docs.microsoft.com/learn/certifications/azure-fundamentals/",
  },
  // Development
  {
    name: "Mendix Rapid Developer",
    year: "2021",
    categories: ["Development"],
    logo: "/assets/certifications/rapid.png",
    infoUrl: "https://academy.mendix.com/link/certifications/23/rapid",
  },
  {
    name: "GitLab Certified Associate",
    year: "2021",
    categories: ["Development"],
    logo: "/assets/certifications/cga.png",
    proofUrl:
      "https://www.credly.com/badges/67afd7d7-b335-419a-91bc-61661bf7b0ab",
    infoUrl: "https://university.gitlab.com/pages/certifications",
  },
  {
    name: "Object Oriented PHP",
    year: "2019",
    categories: ["Development"],
    proofUrl: "https://www.udemy.com/certificate/UC-8G20KC5A/",
    infoUrl:
      "https://www.udemy.com/course/learn-object-oriented-php-by-building-a-complete-website/",
  },
  {
    name: "M001: MongoDB Basics",
    year: "2018",
    categories: ["Development"],
    logo: "/assets/certifications/mongo.jpg",
    proofUrl:
      "https://university.mongodb.com/course_completion/27a523a4-712f-432c-9a0a-1f20c1a9",
  },
];

// Get all unique categories and count certs per category
const categories = [
  ...new Set(certifications.flatMap((cert) => cert.categories)),
];

const getCertsByCategory = (category: string) =>
  certifications.filter((cert) => cert.categories.includes(category));

const values = [
  {
    icon: BookOpen,
    title: "Continuous Learning",
    description:
      "Staying up-to-date with the latest tools and techniques to shield businesses from cyber threats.",
  },
  {
    icon: Heart,
    title: "Team Growth",
    description:
      "Creating collaborative environments where teams learn from each other and continuously develop their skills.",
  },
  {
    icon: Award,
    title: "Clear Communication",
    description:
      "Breaking down complex concepts into clear, engaging terms that empower individuals within organizations.",
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
        keywords={[
          "cyber security expert",
          "Cloudflare Solutions Architect",
          "Zero Trust Engineer",
          "OpenShift Administrator",
          "SALT Cyber Security",
        ]}
      />
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-shrink-0 animate-fade-up">
                <span className="absolute -right-5 bottom-5 text-xs font-semibold text-primary-foreground bg-primary px-2 py-1 rounded-full shadow-md z-10">
                  Me
                </span>
                <img
                  src={profileImage}
                  alt="Thomas van den Nieuwenhoff"
                  className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover shadow-card"
                />
              </div>
              <div
                className="text-center md:text-left animate-fade-up"
                style={{ animationDelay: "0.1s" }}
              >
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  About Me
                </h1>
                <p className="text-xl text-muted-foreground">
                  Lead Cyber Security Consultant with a passion for empowering
                  businesses in the digital realm.
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
                With years of experience and a robust tech background, I focus
                on guiding my team and clients to success in the dynamic cyber
                security landscape. As a certified Cloudflare Solutions
                Architect and OpenShift Administrator, I stay current with the
                latest tools and techniques to protect businesses from cyber
                threats.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                My role as lead consultant extends beyond finding solutions —
                I'm committed to creating a collaborative and supportive
                environment within my team, where we learn from each other and
                continuously develop our skills.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                I believe cybersecurity isn't just about implementing technology
                — it's about educating and empowering individuals within
                organizations. I communicate clearly and engagingly with
                clients, breaking down complex concepts in an understandable
                way.
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
                            <div className="w-16 h-16 overflow-hidden drop-shadow-lg dark:bg-gray-800 flex items-center justify-center">
                              <img
                                src={cert.logo}
                                alt={`${cert.name} badge`}
                                className="w-full h-full object-cover"
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
                          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-3">
                            {cert.year}
                          </span>

                          {/* Links */}
                          {(cert.proofUrl || cert.infoUrl) && (
                            <div className="flex justify-center gap-3 mt-2">
                              {cert.proofUrl && (
                                <a
                                  href={cert.proofUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                                  title="Verify certification"
                                >
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  Proof
                                </a>
                              )}
                              {cert.infoUrl && (
                                <a
                                  href={cert.infoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                                  title="More information"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Info
                                </a>
                              )}
                            </div>
                          )}
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
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
