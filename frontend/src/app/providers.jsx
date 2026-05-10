"use client";

import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeBootScript } from "@/components/theme/theme-script";

export default function Providers({ children }) {
  return (
    <>
      <ThemeBootScript />
      <ThemeProvider>
        <MantineProvider theme={{ primaryColor: "blue" }}>
          {children}
        </MantineProvider>
      </ThemeProvider>
    </>
  );
}
