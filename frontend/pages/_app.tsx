import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Anek_Bangla } from "next/font/google";

const anekBangla = Anek_Bangla({
  weight: ["100", "200", "300", "400", "500", "600"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={anekBangla.className}>
      <Component {...pageProps} />
    </div>
  );
}
