import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type AnimationVariant = "fade-up" | "fade-left" | "fade-right" | "scale" | "blur";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
}

const variantStyles: Record<AnimationVariant, { initial: string; visible: string }> = {
  "fade-up": {
    initial: "opacity-70 translate-y-3",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    initial: "opacity-70 -translate-x-3",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    initial: "opacity-70 translate-x-3",
    visible: "opacity-100 translate-x-0",
  },
  scale: {
    initial: "opacity-70 scale-[0.98]",
    visible: "opacity-100 scale-100",
  },
  blur: {
    initial: "opacity-70 blur-[1px]",
    visible: "opacity-100 blur-0",
  },
};

export function AnimatedSection({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 600,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  const styles = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? styles.visible : styles.initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
