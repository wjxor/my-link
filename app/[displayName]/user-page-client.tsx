"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import { collection, query, where, getDocs, orderBy, doc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { User as UserProfile } from "@/data/user";
import { Link as LinkType } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function UserPageClient() {
  const params = useParams();
  const displayName = params?.displayName as string;
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  
  const [pageUser, setPageUser] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const hasIncrementedRef = useRef(false);

  useEffect(() => {
    if (!displayName) return;

    const fetchUserData = async () => {
      try {
        const q = query(collection(db, "users"), where("displayName", "==", displayName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setIsNotFound(true);
          setIsLoading(false);
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
        setPageUser(userData);

        // Fetch links
        const linksRef = collection(db, "users", userDoc.id, "links");
        const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
        const linksSnapshot = await getDocs(linksQuery);
        
        const fetchedLinks = linksSnapshot.docs.map((d) => ({
          id: d.id,
          title: d.data().title,
          url: d.data().url,
          clickCount: d.data().clickCount || 0,
          createdAt: d.data().createdAt?.toDate() || new Date(),
          updatedAt: d.data().updatedAt?.toDate() || new Date(),
        })) as LinkType[];
        
        setLinks(fetchedLinks);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsNotFound(true);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [displayName]);

  const handleLinkClick = async (linkId: string) => {
    if (!pageUser) return;
    try {
      const linkRef = doc(db, "users", pageUser.uid, "links", linkId);
      await updateDoc(linkRef, {
        clickCount: increment(1)
      });
    } catch (error) {
      console.error("Error updating click count:", error);
    }
  };

  // Visitor Count Increment Logic
  useEffect(() => {
    if (isAuthLoading || !pageUser || hasIncrementedRef.current) return;

    // Check if the current user is visiting their own page
    if (currentUser?.uid !== pageUser.uid) {
      const incrementVisitorCount = async () => {
        try {
          const userRef = doc(db, "users", pageUser.uid);
          await updateDoc(userRef, {
            visitorCount: increment(1)
          });
          hasIncrementedRef.current = true;
        } catch (error) {
          console.error("Error updating visitor count:", error);
        }
      };
      
      incrementVisitorCount();
    } else {
      hasIncrementedRef.current = true; // Mark as done even if it's the owner, to avoid repeated checks
    }
  }, [isAuthLoading, currentUser?.uid, pageUser?.uid, pageUser]);

  if (isNotFound) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100svh-4rem)] w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!pageUser) return null;

  return (
    <div className="flex min-h-[calc(100svh-4rem)] w-full flex-col items-center bg-slate-50 p-6 text-slate-900 selection:bg-indigo-500/30 relative">
      {/* Bright Background Gradient Effect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-300/40 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-pink-300/30 blur-[120px]" />
        <div className="absolute top-[20%] left-[50%] w-[50%] h-[50%] rounded-full bg-sky-300/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 py-10">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 text-center w-full relative">
          <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
            <AvatarImage src={pageUser.avatarUrl} alt={`@${pageUser.displayName}`} />
            <AvatarFallback>{pageUser.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          
          <div className="relative w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">{pageUser.username}</h1>
            <p className="mt-1 text-sm text-slate-500 font-medium whitespace-pre-wrap px-8">
              {pageUser.bio}
            </p>
            <div className="mt-2 text-xs font-mono text-slate-400 bg-slate-100/50 inline-block px-2 py-1 rounded-md">
              /{pageUser.displayName}
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex w-full flex-col gap-4">
          {links.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm">
              <p className="text-slate-500 font-medium">등록된 링크가 없습니다.</p>
            </div>
          ) : (
            links.map((link) => {
              let faviconUrl = "";
              try {
                const urlObj = new URL(link.url);
                const domain = urlObj.hostname;
                faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
              } catch (e) {
                faviconUrl = `https://www.google.com/s2/favicons?domain=example.com&sz=64`;
              }

              return (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                  onClick={() => handleLinkClick(link.id)}
                >
                  <Card className="border-white/60 bg-white/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-indigo-500/15 relative">
                    <CardContent className="flex items-center gap-4 p-4">
                      {/* Favicon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 shadow-inner overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={faviconUrl} 
                          alt={`${link.title} icon`} 
                          className="h-6 w-6 rounded-sm object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'https://www.google.com/s2/favicons?domain=example.com&sz=64';
                          }}
                        />
                      </div>
                      {/* Link Title */}
                      <span className="flex-1 text-center text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors mr-8">
                        {link.title}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
