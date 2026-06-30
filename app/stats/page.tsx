import type { Metadata } from "next";
import StatsClient from "./stats-client";

export const metadata: Metadata = {
  title: "통계 대시보드",
  description:
    "내 MyLink 페이지의 방문수, 링크 클릭수 등 통계를 한눈에 확인하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatsPage() {
  return <StatsClient />;
}
