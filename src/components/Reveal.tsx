import { ElementType, ReactNode, CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type RevealVariant = "fade-up" | "mask-up" | "fade-in" | "line-draw";

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
  /** Custom translateY (px) for fade-up. Default 28. */
  distance?: number;
};

/**
 * Reveal — wraps children with a one-time scroll-triggered animation.
 *
 * - fade-up:  fade + slide up from below (default)
 * - mask-up:  clip-path reveal from bottom — used for photographs
 * - fade-in:  pure opacity, no movement (subtle, for body copy)
 * - line-draw:scaleX from 0 to 1 (left-anchored) — used for hairlines
 */
export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration,
  className,
  as: Tag = "div",
  style,
  distance,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();

  const customStyle: CSSProperties = {
    ...style,
    ...(delay ? { transitionDelay: `${delay}ms` } : {}),
    ...(duration ? { transitionDuration: `${duration}ms` } : {}),
    ...(distance && variant === "fade-up"
      ? ({ "--reveal-distance": `${distance}px` } as CSSProperties)
      : {}),
  };

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "ed-reveal",
        `ed-reveal--${variant}`,
        inView && "is-in-view",
        className
      )}
      style={customStyle}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger — applies sequential reveal delays to a list of children.
 * Children must be Reveal components (or accept className/style props).
 *
 * Example:
 *   <Stagger step={80}>
 *     <Reveal>One</Reveal>
 *     <Reveal>Two</Reveal>
 *   </Stagger>
 */
export function Stagger({
  children,
  step = 80,
  initialDelay = 0,
  className,
}: {
  children: ReactNode;
  step?: number;
  initialDelay?: number;
  className?: string;
}) {
  // We use a wrapper element that sets a CSS custom property each child can
  // read via :nth-child indexing. This avoids needing to clone children and
  // works for any markup the caller passes in.
  return (
    <div
      className={cn("ed-stagger", className)}
      style={
        {
          "--ed-stagger-step": `${step}ms`,
          "--ed-stagger-initial": `${initialDelay}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
