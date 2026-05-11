"use client";

import { MantineProvider } from "@mantine/core";
import { ThemeProvider, useTheme } from "@/components/theme/theme-provider";
import { ThemeBootScript } from "@/components/theme/theme-script";

function ThemedMantineProvider({ children }) {
  const { theme } = useTheme();

  return (
    <MantineProvider
      forceColorScheme={theme}
      theme={{
        primaryColor: "teal",
        components: {
          Pagination: {
            defaultProps: {
              color: "teal",
            },
          },
        },
      }}
    >
      {children}
    </MantineProvider>
  );
}

export default function Providers({ children }) {
  return (
    <>
      <ThemeBootScript />
      <ThemeProvider>
        <ThemedMantineProvider>{children}</ThemedMantineProvider>
      </ThemeProvider>
    </>
  );
}
