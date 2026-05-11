import Script from "next/script";
import { THEME_STORAGE_KEY } from "@/styles/colors";

/** Early boot — keeps `html.dark` in sync with localStorage before paint (paired with suppressHydrationWarning). */
export function ThemeBootScript() {
  const snippet = `
(function(){try{
  var narrow=window.matchMedia&&window.matchMedia("(max-width: 799px)").matches;
  var d=!narrow&&localStorage.getItem("${THEME_STORAGE_KEY}")==="dark";
  document.documentElement.classList.toggle("dark", d);
}catch(e){}})();
`;

  return <Script id="fv-theme-boot" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: snippet }} />;
}
