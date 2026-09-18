import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type SeparatorProps = HTMLAttributes<HTMLHRElement>;

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return <hr {...props} className={twMerge("border-gray-100", className)} />;
};
