import { Link } from "react-router-dom";
import { ArrowRight, Shield, Cloud, Lock, Zap, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SEO } from "@/components/seo/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const services = [
  {
    icon: Cloud,
    title: "Cloudflare architectuur & implementatie",
    description:
      "Van DNS-migratie tot WAF, Magic Transit en Load Balancing. Productie-ready setups voor Nederlandse organisaties.",
  },
  {
    icon: Lock,
    title: "Zero Trust & SASE",
    description:
      "Cloudflare Access, Gateway, Tunnel en Browser Isolation. Vervang je legacy VPN met identity-aware access.",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description:
      "Bot Management, DDoS-mitigatie, API Shield en Page Shield. Inclusief NIS2- en ISO 27001-afstemming.",
  },
  {
    icon: Zap,
    title: "Developer Platform & Workers",
    description:
      "Cloudflare Workers, Pages, R2 en D1. Edge-first applicaties die wereldwijd schalen zonder beheerlast.",
  },
];

const faqs = [
  {
    q: "Wat doet een Cloudflare consultant?",
    a: "Een Cloudflare consultant ontwerpt, implementeert en optimaliseert Cloudflare-oplossingen zoals WAF, Zero Trust, Workers, Magic Transit en DNS. Ik help Nederlandse organisaties met migraties, security-audits en het bouwen van schaalbare edge-architecturen.",
  },
  {
    q: "Ben je een gecertificeerd Cloudflare partner in Nederland?",
    a: "Ja, ik werk als Lead Cyber Security Consultant bij SALT, een PowerUP+ Cloudflare-partner in Nederland. Ik ben Cloudflare Solutions Architect gecertificeerd en lever professional services voor enterprise-klanten.",
  },
  {
    q: "Welke Cloudflare-producten ondersteun je?",
    a: "Het volledige Cloudflare-portfolio: Application Services (WAF, CDN, Load Balancing), Zero Trust (Access, Gateway, Tunnel, CASB), Network Services (Magic Transit, Magic WAN), Developer Platform (Workers, Pages, R2, D1, Durable Objects) en Email Security.",
  },
  {
    q: "Hoe verloopt een typisch consulting-traject?",
    a: "Het begint met een discovery-sessie en architectuur-review. Daarna volgt een implementatieplan, pilot, productie-uitrol en knowledge transfer. Trajecten lopen van een paar dagen (audit) tot meerdere maanden (greenfield Zero Trust uitrol).",
  },
  {
    q: "Werk je ook met kleinere bedrijven of alleen enterprise?",
    a: "Beide. Ik ondersteun MKB met snelle Cloudflare-setups (DNS, WAF, Tunnel) en enterprise-klanten met complexe multi-region architecturen, compliance en Zero Trust transformaties.",
  },
  {
    q: "Wat kost een Cloudflare consultant in Nederland?",
    a: "Tarieven variëren per scope. Een korte audit start vanaf enkele uren, grotere implementaties worden vastgelegd in een Statement of Work via SALT. Neem contact op voor een offerte op maat.",
  },
];

const consultantStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Thomas van den Nieuwenhoff: Cloudflare consultant Nederland",
  description:
    "Onafhankelijk Cloudflare consultant en Zero Trust expert in Nederland. Cloudflare Solutions Architect, gespecialiseerd in WAF, SASE, Workers en enterprise security.",
  url: "https://tvdn.me/cloudflare-consultant",
  areaServed: {
    "@type": "Country",
    name: "Netherlands",
  },
  serviceType: [
    "Cloudflare consultancy",
    "Zero Trust implementatie",
    "SASE architectuur",
    "WAF & DDoS mitigatie",
    "Cloudflare Workers ontwikkeling",
  ],
  provider: {
    "@type": "Person",
    name: "Thomas van den Nieuwenhoff",
    jobTitle: "Lead Cyber Security Consultant",
    worksFor: {
      "@type": "Organization",
      name: "SALT Cyber Security",
      url: "https://salt-security.com",
    },
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function CloudflareConsultant() {
  return (
    <Layout>
      <SEO
        title="Cloudflare Consultant Nederland | Zero Trust & SASE Expert"
        description="Onafhankelijk Cloudflare consultant in Nederland. Cloudflare Solutions Architect met expertise in Zero Trust, WAF, Workers en enterprise security. Direct contact."
        canonical="/cloudflare-consultant"
        keywords={[
          "Cloudflare consultant Nederland",
          "Cloudflare expert",
          "Cloudflare Solutions Architect",
          "Zero Trust consultant",
          "SASE Nederland",
          "Cloudflare Workers",
          "WAF specialist",
          "Cloudflare partner Nederland",
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [consultantStructuredData, faqStructuredData],
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-hero">
        <div className="container py-20 md:py-28">
          <AnimatedSection className="max-w-3xl">
            <p className="text-primary font-medium mb-4">
              Cloudflare consultant: Nederland
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Cloudflare consultant voor Zero Trust, WAF & edge-architectuur
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Ik help Nederlandse organisaties Cloudflare goed inrichten, van
              DNS-migratie en WAF-tuning tot complete Zero Trust uitrol en
              Workers-applicaties op de edge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="warm" size="lg" asChild>
                <Link to="/contact">
                  Plan een kennismaking
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">Bekijk certificeringen</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Wat ik lever
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              End-to-end Cloudflare consultancy: onafhankelijk advies,
              implementatie en knowledge transfer.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} variant="fade-up" delay={i * 100}>
                <div className="p-8 rounded-2xl bg-card shadow-soft hover-lift h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground">{s.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why me */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
              Waarom met mij werken
            </h2>
            <ul className="space-y-4">
              {[
                "Cloudflare Solutions Architect: gecertificeerd op het volledige portfolio",
                "Lead Consultant bij SALT, PowerUP+ Cloudflare-partner in Nederland",
                "Praktijkervaring met enterprise migraties, Zero Trust uitrol en Workers in productie",
                "Onafhankelijk advies — geen vendor lock-in zonder reden",
                "Knowledge transfer als standaard: je team blijft niet afhankelijk",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <AnimatedSection className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Veelgestelde vragen
            </h2>
            <p className="text-muted-foreground">
              Over Cloudflare consultancy in Nederland.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base md:text-lg">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <AnimatedSection variant="scale" className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Klaar om je Cloudflare-stack te versterken?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Plan een vrijblijvende kennismaking — we bespreken je doelen,
              huidige setup en mogelijke quick wins.
            </p>
            <Button variant="warm" size="lg" asChild>
              <Link to="/contact">
                Neem contact op
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}