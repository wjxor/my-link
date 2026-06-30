import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "내 링크 관리",
  description:
    "MyLink에서 나만의 프로필 링크를 만들고 관리하세요. 포트폴리오, SNS, 블로그 등 모든 링크를 한 곳에.",
};

export default function Page() {
  return <HomeClient />;
}
