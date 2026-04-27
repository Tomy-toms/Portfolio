import type { CSSProperties, ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
};

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  style,
}: Props) {
  const merged: CSSProperties = delay
    ? { ...style, ["--reveal-delay" as string]: `${delay}s` }
    : style ?? {};
  return (
    <Tag className={`reveal${className ? ` ${className}` : ""}`} style={merged}>
      {children}
    </Tag>
  );
}
