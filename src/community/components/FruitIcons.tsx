import type { SVGProps } from "react";

const base: Partial<SVGProps<SVGSVGElement>> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/** Minimal, hand-drawn-style outline icons for fruit lucide-react doesn't cover. */

export function Mango(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 5c3-1 5 0 6 2 3 4 3 9-1 12-4 3-9 1-10-3C1 12 3 7 7 5Z" />
      <path d="M7 5c1 1 2 1 3 0" />
    </svg>
  );
}

export function Avocado(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c4 2 6 6 6 10a6 6 0 0 1-12 0c0-4 2-8 6-10Z" />
      <circle cx="12" cy="15" r="3" />
    </svg>
  );
}

export function WatermelonSlice(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20 3 6h18Z" />
      <path d="M6 9.5h12" />
      <circle cx="10" cy="13" r="0.4" fill="currentColor" stroke="none" />
      <circle cx="14" cy="13" r="0.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Pineapple(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3c1 1 1 2 0 3M12 2c0 1.5 0 2.5-1 3.5M15 3c-1 1-1 2 0 3" />
      <rect x="7" y="7" width="10" height="14" rx="5" />
      <path d="M7 12h10M7 16h10" />
    </svg>
  );
}

export function Strawberry(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 6c-4 0-7 3-7 7a7 7 0 0 0 14 0c0-4-3-7-7-7Z" />
      <path d="M8 6l2-2 2 2 2-2 2 2" />
    </svg>
  );
}

export function Tomato(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="13" r="7" />
      <path d="M9 6l1.5 2M12 5v3M15 6l-1.5 2" />
    </svg>
  );
}

export function Pumpkin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v3" />
      <path d="M5 13a7 7 0 0 1 14 0v2a7 7 0 0 1-14 0Z" />
      <path d="M9 8v12M12 7v13M15 8v12" />
    </svg>
  );
}
