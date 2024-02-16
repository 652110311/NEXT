import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PWA with Next",
  description: "PWA application with Next",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs","pwa", "next-pwa"],
  //themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    { name: "" },
    {
      name: "",
      url: "",
    },
  ],
  //viewport:
    //"minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icon.png" },
    { rel: "icon", url: "icon.png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="mobile-web-app-capable" content='yes'/>
      <link rel="apple-touch-icon" sizes="796x789" href='icon.png'/>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
