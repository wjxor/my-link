import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

export const metadata: Metadata = {
  metadataBase: new URL("https://mylink.com"),
  title: {
    template: "%s | MyLink",
    default: "MyLink - 나만의 모든 링크를 한 곳에",
  },
  description:
    "포트폴리오, SNS, 블로그 등 흩어진 링크를 하나의 프로필 페이지로 모아 공유하세요. 무료로 1분 만에 시작할 수 있습니다.",
  keywords: [
    "링크 모음",
    "프로필 링크",
    "링크트리 대안",
    "포트폴리오 링크",
    "SNS 링크",
    "마이링크",
    "MyLink",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "MyLink",
    title: "MyLink - 나만의 모든 링크를 한 곳에",
    description:
      "포트폴리오, SNS, 블로그 등 흩어진 링크를 하나의 프로필 페이지로 모아 공유하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink - 나만의 모든 링크를 한 곳에",
    description:
      "포트폴리오, SNS, 블로그 등 흩어진 링크를 하나의 프로필 페이지로 모아 공유하세요.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
