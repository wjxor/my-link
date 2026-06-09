"use client";

import { useState, useEffect } from "react";
import { Link as LinkType } from "@/data/links";
import { User as UserProfile } from "@/data/user";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Pencil, Trash2, X, Check, LinkIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Page() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // Edit State
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // Delete State
  const [linkToDelete, setLinkToDelete] = useState<LinkType | null>(null);

  // Loading States for Actions
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchOrCreateProfile = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const defaultDisplayName = user.email ? user.email.split('@')[0] : `user_${user.uid.substring(0,5)}`;
        const newProfile = {
          displayName: defaultDisplayName,
          username: user.displayName || "New User",
          bio: "Hello! This is my link page.",
          avatarUrl: user.photoURL || "",
          visitorCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
      }
    };

    fetchOrCreateProfile().then(() => {
      const userRef = doc(db, "users", user.uid);
      const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfile({ uid: user.uid, ...docSnap.data() } as UserProfile);
        }
      });

      const q = query(
        collection(db, "users", user.uid, "links"),
        orderBy("createdAt", "desc")
      );

      const unsubscribeLinks = onSnapshot(q, (snapshot) => {
        const fetchedLinks = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          url: doc.data().url,
          clickCount: doc.data().clickCount || 0,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as LinkType[];
        setLinks(fetchedLinks);
        setIsLoading(false);
      });

      return () => {
        unsubscribeProfile();
        unsubscribeLinks();
      };
    });
  }, [user, isAuthLoading]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedTitle = newTitle.trim();
    const trimmedUrl = newUrl.trim();

    if (!trimmedTitle || !trimmedUrl) {
      toast.error("제목과 URL을 모두 입력해주세요.");
      return;
    }

    if (trimmedTitle.length > 50) {
      toast.error("제목은 50자를 초과할 수 없습니다.");
      return;
    }

    const urlPattern = /^(https?:\/\/)?((([a-zA-Z\d]([a-zA-Z\d-]*[a-zA-Z\d])*)\.)+[a-zA-Z]{2,}|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/[-a-zA-Z\d%_.~+]*)*(\?[;&a-zA-Z\d%_.~+=-]*)?(#[-a-zA-Z\d_]*)?$/;
    if (!urlPattern.test(trimmedUrl)) {
      toast.error("유효한 URL 형식이 아닙니다.");
      return;
    }

    let finalUrl = trimmedUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "links"), {
        title: trimmedTitle,
        url: finalUrl,
        clickCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setIsDialogOpen(false);
      setNewTitle("");
      setNewUrl("");
      toast.success("새로운 링크가 추가되었습니다.");
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("링크를 추가하는 중 오류가 발생했습니다.");
    }
  };

  const handleStartEdit = (link: LinkType) => {
    setEditingLinkId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setEditTitle("");
    setEditUrl("");
  };

  const handleUpdateLink = async (id: string) => {
    if (!user) return;
    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

    if (!trimmedTitle || !trimmedUrl) {
      toast.error("제목과 URL을 모두 입력해주세요.");
      return;
    }

    if (trimmedTitle.length > 50) {
      toast.error("제목은 50자를 초과할 수 없습니다.");
      return;
    }

    const urlPattern = /^(https?:\/\/)?((([a-zA-Z\d]([a-zA-Z\d-]*[a-zA-Z\d])*)\.)+[a-zA-Z]{2,}|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/[-a-zA-Z\d%_.~+]*)*(\?[;&a-zA-Z\d%_.~+=-]*)?(#[-a-zA-Z\d_]*)?$/;
    if (!urlPattern.test(trimmedUrl)) {
      toast.error("유효한 URL 형식이 아닙니다.");
      return;
    }

    let finalUrl = trimmedUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    setIsUpdating(true);
    try {
      const linkRef = doc(db, "users", user.uid, "links", id);
      await updateDoc(linkRef, {
        title: trimmedTitle,
        url: finalUrl,
        updatedAt: serverTimestamp(),
      });
      setEditingLinkId(null);
      toast.success("링크가 수정되었습니다.");
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("링크를 수정하는 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!linkToDelete || !user) return;

    setIsDeleting(true);
    try {
      const linkRef = doc(db, "users", user.uid, "links", linkToDelete.id);
      await deleteDoc(linkRef);
      setLinkToDelete(null);
      toast.success("링크가 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("링크를 삭제하는 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isAuthLoading || (user && isLoading)) {
    return (
      <div className="flex min-h-[calc(100svh-4rem)] w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!user) {
    const handleSignIn = async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        toast.success("로그인되었습니다.");
      } catch (error) {
        console.error("Login failed", error);
        toast.error("로그인 중 오류가 발생했습니다.");
      }
    };

    return (
      <div className="flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center bg-slate-900 p-6 text-white relative overflow-hidden">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-cyan-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center max-w-2xl text-center space-y-8 p-10">
          <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-white/5 shadow-2xl ring-1 ring-white/20 backdrop-blur-xl mb-4">
            <LinkIcon className="h-14 w-14 text-indigo-400" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
            당신의 모든 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400">링크</span>를<br className="hidden sm:block" /> 한 곳에서
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed font-medium max-w-xl">
            포트폴리오, 소셜 미디어, 프로젝트 링크를 단 하나의 페이지로 우아하게 공유하세요.
          </p>

          <div className="pt-8">
            <Button 
              size="lg" 
              onClick={handleSignIn} 
              className="bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] h-14 px-8 rounded-full text-lg font-bold group"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              구글 계정으로 시작하기
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 inline-block">→</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        {profile && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
              <AvatarImage src={profile.avatarUrl} alt={`@${profile.displayName}`} />
              <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">{profile.username}</h1>
              <p className="mt-1 text-sm text-slate-500 font-medium whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          </div>
        )}

        {/* Links Section */}
        <div className="flex w-full flex-col gap-4">
          {/* Add Link Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button variant="outline" className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 bg-white/50 backdrop-blur-xl h-auto" />}>
              <Plus className="mr-2 h-4 w-4" />
              새로운 링크 추가
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleAddLink}>
                <DialogHeader>
                  <DialogTitle>새로운 링크 추가</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      placeholder="예: 나의 깃허브"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="text"
                      placeholder="https://github.com/..."
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">추가하기</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!linkToDelete} onOpenChange={(open) => !open && setLinkToDelete(null)}>
            <DialogContent className="sm:max-w-md bg-white text-slate-900 border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-slate-900 font-bold text-lg">정말 삭제하시겠습니까?</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-slate-800 font-medium mb-2 text-base">
                  삭제 대상: <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">{linkToDelete?.title}</span>
                </p>
                <p className="text-red-500 text-sm font-semibold">
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <DialogFooter className="flex gap-4 sm:gap-4 sm:space-x-0">
                <Button variant="outline" onClick={() => setLinkToDelete(null)} disabled={isDeleting}>취소</Button>
                <Button variant="destructive" onClick={handleDeleteLink} disabled={isDeleting}>
                  {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  삭제하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {links.map((link) => {
            let faviconUrl = "";
            try {
              const urlObj = new URL(link.url);
              const domain = urlObj.hostname;
              faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            } catch (e) {
              faviconUrl = `https://www.google.com/s2/favicons?domain=example.com&sz=64`;
            }

            return (
              <div key={link.id}>
                {editingLinkId === link.id ? (
                  <Card className="border-indigo-200 bg-white shadow-lg ring-2 ring-indigo-500/20">
                    <CardContent className="flex flex-col gap-3 p-4">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateLink(link.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        placeholder="제목"
                        autoFocus
                        className="bg-white border-slate-300 text-slate-900 focus-visible:ring-indigo-500"
                      />
                      <Input
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateLink(link.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        placeholder="URL"
                        className="bg-white border-slate-300 text-slate-900 focus-visible:ring-indigo-500"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isUpdating} className="border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900">
                          <X className="w-4 h-4 mr-1" /> 취소
                        </Button>
                        <Button size="sm" onClick={() => handleUpdateLink(link.id)} disabled={isUpdating} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          {isUpdating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />} 저장
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
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
                        
                        {/* Actions */}
                        <div className="absolute right-4 flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            onClick={(e) => {
                              e.preventDefault();
                              handleStartEdit(link);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.preventDefault();
                              setLinkToDelete(link);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
