"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Link as LinkType } from "@/data/links";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MousePointerClick, Eye } from "lucide-react";
import dynamic from "next/dynamic";

const StatsChart = dynamic(() => import("@/components/stats-chart").then((mod) => mod.StatsChart), { ssr: false });

export default function StatsClient() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLinksLoading, setIsLinksLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;

    const linksRef = collection(db, "users", user.uid, "links");
    const q = query(linksRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const linksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as LinkType[];
      
      setLinks(linksData);
      setIsLinksLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (isLoading || isLinksLoading || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const totalClicks = links.reduce((acc, link) => acc + (link.clickCount || 0), 0);
  const totalViews = profile?.visitorCount || 0;

  const chartData = links.map((link) => ({
    title: link.title,
    clicks: link.clickCount || 0,
  }));

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">통계 대시보드</h1>
        <p className="mt-2 text-muted-foreground">내 페이지와 링크들의 성과를 확인해보세요.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 페이지 방문수</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">프로필 페이지가 노출된 횟수입니다.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 링크 클릭수</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">모든 링크의 클릭 합산 수치입니다.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>링크별 클릭수</CardTitle>
          <CardDescription>어떤 링크가 가장 많이 클릭되었는지 확인해보세요.</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length > 0 ? (
            <StatsChart data={chartData} />
          ) : (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              아직 등록된 링크가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
