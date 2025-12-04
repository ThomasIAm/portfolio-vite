import { CodeBlock } from './CodeBlock';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  // Parse content and render code blocks with syntax highlighting
  const renderContent = () => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        if (match) {
          const language = match[1] || 'typescript';
          const code = match[2] || '';
          return <CodeBlock key={index} code={code} language={language} />;
        }
      }
      
      // Render regular content as paragraphs
      return part.split('\n\n').map((paragraph, pIndex) => {
        if (!paragraph.trim()) return null;
        
        // Handle headers
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={`${index}-${pIndex}`} className="font-display text-2xl font-bold text-foreground mt-8 mb-4">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={`${index}-${pIndex}`} className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
              {paragraph.replace('### ', '')}
            </h3>
          );
        }
        
        return (
          <p key={`${index}-${pIndex}`} className="text-muted-foreground leading-relaxed mb-4">
            {paragraph}
          </p>
        );
      });
    });
  };

  return <div className="prose-warm">{renderContent()}</div>;
}
