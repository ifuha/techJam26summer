import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TSUNAGU | 職人を応援する",
  description: "日本の職人と応援する人をつなぐマップ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="ja"><body>{children}</body></html>;
}
