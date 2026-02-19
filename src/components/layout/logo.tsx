import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface LogoProps {
  className?: string;
  href?: string;
  /** Hide the wordmark, show only the mark (e.g. collapsed sidebars). */
  iconOnly?: boolean;
}

export function Logo({ className, href = "/", iconOnly = false }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/logo.svg"
        alt={`${siteConfig.name} logo`}
        width={32}
        height={32}
        priority
        className="shadow-primary/25 size-8 rounded-[9px] shadow-md"
      />
      {!iconOnly && (
        <span className="text-base font-semibold tracking-tight">{siteConfig.name}</span>
      )}
    </Link>
  );
}
