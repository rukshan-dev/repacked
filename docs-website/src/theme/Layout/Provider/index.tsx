import React from "react";
import Provider from "@theme-original/Layout/Provider";
import type ProviderType from "@theme/Layout/Provider";
import type { WrapperProps } from "@docusaurus/types";
import { createTheme, ThemeProvider } from "@mui/material";

type Props = WrapperProps<typeof ProviderType>;

const theme = createTheme({
  typography: {
    fontFamily: `"Figtree", sans-serif`,
  },
});

export default function ProviderWrapper(props: Props): JSX.Element {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Provider {...props} />
      </ThemeProvider>
    </>
  );
}
