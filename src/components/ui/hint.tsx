"use client";

import type { ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HintProps {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

/**
 * Thin wrapper around the shadcn tooltip for the common "hover a thing, show a
 * label" case. Relies on the global TooltipProvider (see providers/index).
 */
export function Hint({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 8,
}: HintProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align} sideOffset={sideOffset}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
