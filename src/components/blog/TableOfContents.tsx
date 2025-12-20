import { useEffect, useState } from 'react';
import { List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  variant?: 'desktop' | 'mobile';
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({
      id: generateSlug(text),
      text,
      level,
    });
  }

  return headings;
}

function TocList({ headings, activeId, onItemClick }: { 
  headings: TocItem[]; 
  activeId: string;
  onItemClick?: () => void;
}) {
  return (
    <ul className="space-y-2 text-sm border-l border-border">
      {headings.map((heading) => (
        <li
          key={heading.id}
          style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
        >
          <a
            href={`#${heading.id}`}
            onClick={onItemClick}
            className={cn(
              'block py-1 text-muted-foreground hover:text-foreground transition-colors',
              activeId === heading.id && 'text-primary font-medium border-l-2 border-primary -ml-px pl-[11px]'
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function TableOfContents({ content, variant = 'desktop' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const headings = extractHeadings(content);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  if (variant === 'mobile') {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="lg:hidden mb-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <List className="h-4 w-4" />
            <span>On this page</span>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <TocList 
            headings={headings} 
            activeId={activeId} 
            onItemClick={() => setIsOpen(false)} 
          />
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <nav className="sticky top-24">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
        <List className="h-4 w-4" />
        <span>On this page</span>
      </div>
      <TocList headings={headings} activeId={activeId} />
    </nav>
  );
}
