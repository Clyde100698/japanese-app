"use client";

interface Props {
  variant?: "seigaiha" | "sakura" | "clouds";
  className?: string;
  opacity?: number;
}

export default function BackgroundPatterns({
  variant = "seigaiha",
  className = "absolute inset-0 pointer-events-none",
  opacity = 0.04,
}: Props) {
  if (variant === "seigaiha") {
    return (
      <svg
        className={className}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="seigaiha-pattern" width="60" height="30" patternUnits="userSpaceOnUse">
            {/* Traditional Seigaiha overlapping concentric arcs */}
            <path
              d="M0 30 A30 30 0 0 1 60 30 M6 30 A24 24 0 0 1 54 30 M12 30 A18 18 0 0 1 48 30 M18 30 A12 12 0 0 1 42 30 M24 30 A6 6 0 0 1 36 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M-30 15 A30 30 0 0 1 30 15 M-24 15 A24 24 0 0 1 24 15 M-18 15 A18 18 0 0 1 18 15 M-12 15 A12 12 0 0 1 12 15 M-6 15 A6 6 0 0 1 6 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M30 15 A30 30 0 0 1 90 15 M36 15 A24 24 0 0 1 84 15 M42 15 A18 18 0 0 1 78 15 M48 15 A12 12 0 0 1 72 15 M54 15 A6 6 0 0 1 66 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#seigaiha-pattern)" />
      </svg>
    );
  }

  if (variant === "sakura") {
    return (
      <svg
        className={className}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
        aria-hidden="true"
      >
        <defs>
          <pattern id="sakura-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Gentle 5-petal cherry blossom */}
            <g transform="translate(40,40)">
              <path
                d="M0 0 C-4 -12 -12 -14 0 -22 C12 -14 4 -12 0 0"
                fill="currentColor"
                transform="rotate(0)"
              />
              <path
                d="M0 0 C-4 -12 -12 -14 0 -22 C12 -14 4 -12 0 0"
                fill="currentColor"
                transform="rotate(72)"
              />
              <path
                d="M0 0 C-4 -12 -12 -14 0 -22 C12 -14 4 -12 0 0"
                fill="currentColor"
                transform="rotate(144)"
              />
              <path
                d="M0 0 C-4 -12 -12 -14 0 -22 C12 -14 4 -12 0 0"
                fill="currentColor"
                transform="rotate(216)"
              />
              <path
                d="M0 0 C-4 -12 -12 -14 0 -22 C12 -14 4 -12 0 0"
                fill="currentColor"
                transform="rotate(288)"
              />
              <circle cx="0" cy="0" r="2.5" fill="#f59e0b" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sakura-pattern)" />
      </svg>
    );
  }

  // Clouds (Asagao / Kumo)
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="clouds-pattern" width="100" height="70" patternUnits="userSpaceOnUse">
          <path
            d="M20 40 a12 12 0 0 1 20 -6 a16 16 0 0 1 28 2 a10 10 0 0 1 12 10 a8 8 0 0 1 -8 8 h-46 a8 8 0 0 1 -6 -14 z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#clouds-pattern)" />
    </svg>
  );
}

