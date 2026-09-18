import type { HTMLAttributes, ReactNode } from "react";

export type TypographyVariant = "h1" | "h2" | "body1" | "body2";

export type TypographyVariantMapping = Record<TypographyVariant, string>;

export type TypographyProps = {
  children: ReactNode;
  variant?: TypographyVariant;
} & HTMLAttributes<HTMLElement>;

const typographyVariantMapping = {
  h1: "h1",
  h2: "h2",
  body1: "p",
  body2: "p",
} as const;

const typographyVariantClassNames: TypographyVariantMapping = {
  h1: "font-serif text-3xl/tight tracking-tight text-balance italic",
  h2: "text-2xl/tight tracking-tight text-balance",
  body1: "text-base/relaxed text-pretty",
  body2: "text-sm/relaxed text-pretty",
};

export const Typography = ({ variant = "body1", className = "", children, ...props }: TypographyProps) => {
  const Component = typographyVariantMapping[variant];

  return (
    <Component {...props} className={`${typographyVariantClassNames[variant]} ${className}`}>
      {children}
    </Component>
  );
};
