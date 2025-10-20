"use client";

import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

/**
 * Wraps next-themes provider so any layout/page can toggle matcha theme.
 * We expose only the props we need to keep API surface tiny.
 */
export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
