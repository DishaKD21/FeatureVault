"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Dark logo on light UI; light logo on dark UI (matches `html.dark`). */
export default function ThemeLogo({
  href = "/",
  className,
  imgClassName,
  priority = false,
}) {
  const size = "h-10 w-auto object-contain object-left";
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center transition-opacity hover:opacity-90", className)}>
      <Image
        src="/logo-dark.svg"
        alt="FeatureVault"
        width={168}
        height={40}
        className={cn(size, "dark:hidden", imgClassName)}
        priority={priority}
      />
      <Image
        src="/logo-light.svg"
        alt="FeatureVault"
        width={168}
        height={40}
        className={cn(size, "hidden dark:block", imgClassName)}
        priority={priority}
      />
    </Link>
  );
}
