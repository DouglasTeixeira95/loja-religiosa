import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestão - Loja de Artigos Religiosos",
  description: "Sistema de gestão para loja de artigos religiosos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="antialiased">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-[#2a0845] to-[#4a0e4e] text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
