import Lottie, { LottieComponentProps } from "lottie-react";
import { useEffect, useState } from "react";

interface LottieAnimationProps extends Omit<LottieComponentProps, "animationData"> {
  src: string;
  className?: string;
}

// Pre-defined tech/cyber themed animations from LottieFiles
export const LOTTIE_ANIMATIONS = {
  // Hero/decorative animations
  cyberShield: "https://lottie.host/e3a0e88f-3a66-4f8a-8e3d-7f7c0e0e7c1e/cyber-shield.json",
  techNetwork: "https://assets5.lottiefiles.com/packages/lf20_kkflmtur.json",
  securityLock: "https://assets2.lottiefiles.com/packages/lf20_uu0x8lqv.json",
  dataFlow: "https://assets9.lottiefiles.com/packages/lf20_kuhnfwp0.json",
  
  // Loading animations
  loadingCyber: "https://assets3.lottiefiles.com/packages/lf20_szviypvr.json",
  loadingCircuit: "https://assets10.lottiefiles.com/packages/lf20_p8bfn5to.json",
  loadingDots: "https://assets2.lottiefiles.com/packages/lf20_usmfx6bp.json",
  
  // Empty state animations
  emptySearch: "https://assets9.lottiefiles.com/packages/lf20_wnqlfojb.json",
  emptyContent: "https://assets1.lottiefiles.com/packages/lf20_ydo1amjm.json",
  
  // Accent animations
  particles: "https://assets5.lottiefiles.com/packages/lf20_obhph3sh.json",
  pulseRing: "https://assets8.lottiefiles.com/packages/lf20_tszzqmgs.json",
} as const;

export function LottieAnimation({ src, className, loop = true, autoplay = true, ...props }: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnimation = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error("Failed to load animation");
        const data = await response.json();
        setAnimationData(data);
      } catch (err) {
        console.error("Error loading Lottie animation:", err);
        setError(true);
      }
    };

    fetchAnimation();
  }, [src]);

  if (error || !animationData) {
    return null; // Gracefully hide if animation fails to load
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      {...props}
    />
  );
}

// Convenience components for common use cases
export function LoadingAnimation({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <LottieAnimation
      src={LOTTIE_ANIMATIONS.loadingCircuit}
      className={className}
    />
  );
}

export function EmptyStateAnimation({ className = "w-48 h-48" }: { className?: string }) {
  return (
    <LottieAnimation
      src={LOTTIE_ANIMATIONS.emptyContent}
      className={className}
    />
  );
}
