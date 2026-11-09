"use client";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { playTapSound, triggerHaptic } from "@/lib/sound";

export type ButtonVariant = "primary" | "accent" | "sakura" | "success" | "neutral";
export type ButtonSize = "sm" | "md" | "lg";

export interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  sound?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "btn-3d-blue",
  accent: "btn-3d-amber",
  sakura: "btn-3d-pink",
  success: "btn-3d-emerald",
  neutral: "btn-3d-neutral",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-11 px-3.5 py-1.5 text-xs font-bold rounded-xl",
  md: "min-h-12 px-5 py-2.5 text-sm font-bold rounded-2xl",
  lg: "min-h-14 px-6 py-3.5 text-base font-extrabold rounded-2xl",
};

export default function Button3D({
  variant = "primary",
  size = "md",
  fullWidth = false,
  iconLeft,
  iconRight,
  sound = true,
  children,
  className = "",
  onClick,
  disabled,
  ...props
}: Button3DProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (sound) {
      playTapSound();
    } else {
      triggerHaptic("light");
    }
    onClick?.(e);
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`btn-3d inline-flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none ${
        VARIANT_CLASSES[variant]
      } ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}

