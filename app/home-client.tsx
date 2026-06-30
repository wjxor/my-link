"use client";

import { useState, useEffect } from "react";
import { Link as LinkType } from "@/data/links";
import { User as UserProfile } from "@/data/user";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Pencil, Trash2, X, Check, LinkIcon, MousePointerClick } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc, getDoc, setDoc, getDocs, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function HomeClient() {
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileDisplayName, setEditProfileDisplayName] = useState("");
  const [editProfileUsername, setEditProfileUsername] = useState("");
  const [editProfileBio, setEditProfileBio] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
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

  const handleStartEditProfile = () => {
    if (!profile) return;
    setEditProfileDisplayName(profile.displayName);
    setEditProfileUsername(profile.username);
    setEditProfileBio(profile.bio);
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    
    const trimmedDisplayName = editProfileDisplayName.trim().toLowerCase();
    const trimmedUsername = editProfileUsername.trim();
    const trimmedBio = editProfileBio.trim();

    if (!trimmedDisplayName || !trimmedUsername) {
      toast.error("URL 슬러그와 이름은 필수입니다.");
      return;
    }

    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(trimmedDisplayName)) {
      toast.error("URL 슬러그는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      if (trimmedDisplayName !== profile.displayName) {
        const q = query(collection(db, "users"), where("displayName", "==", trimmedDisplayName));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          toast.error("이미 사용 중인 접속 URL(슬러그)입니다. 다른 슬러그를 입력해주세요.");
          setIsUpdatingProfile(false);
          return;
        }
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: trimmedDisplayName,
        username: trimmedUsername,
        bio: trimmedBio,
        updatedAt: serverTimestamp(),
      });
      
      toast.success("프로필이 성공적으로 업데이트되었습니다.");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsUpdatingProfile(false);
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
      <div className="flex min-h-[calc(100svh-4rem)] w-full flex-col bg-slate-900 text-white relative overflow-hidden">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-cyan-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
        
        {/* Main Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-20 lg:py-32">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 shadow-xl ring-1 ring-white/20 backdrop-blur-md mb-8 hover:scale-110 transition-transform duration-300">
            <LinkIcon className="h-10 w-10 text-indigo-400" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-md text-center max-w-4xl leading-tight">
            당신의 모든 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400">링크</span>를<br className="hidden sm:block" /> 한 곳에서 우아하게
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-2xl text-center">
            복잡한 설정 없이 단 1분 만에 나만의 프로필 페이지를 완성하세요. <br className="hidden sm:block" />
            포트폴리오, 소셜 미디어, 프로젝트 링크를 단 하나의 페이지로 공유하세요.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              size="lg" 
              onClick={handleSignIn} 
              className="relative bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] h-14 px-6 sm:px-10 rounded-full text-base sm:text-lg font-bold group w-full sm:w-auto flex items-center justify-center whitespace-nowrap"
            >
              <svg className="w-6 h-6 mr-2 sm:mr-3 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              구글 계정으로 3초만에 시작하기
              <span className="absolute right-4 sm:right-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 inline-block shrink-0">→</span>
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm h-14 px-8 rounded-full text-lg font-medium w-full sm:w-auto"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              기능 알아보기
            </Button>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div id="features" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">왜 마이링크를 선택해야 할까요?</h2>
            <p className="text-slate-400 text-lg">단 하나의 링크로 당신의 모든 것을 표현하세요.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <MousePointerClick className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">초간편 설정</h3>
              <p className="text-slate-400 leading-relaxed">
                복잡한 코딩이나 디자인 지식 없이도, 직관적인 인터페이스로 누구나 쉽게 링크 페이지를 만들 수 있습니다.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-fuchsia-500/20 text-fuchsia-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-fuchsia-500 group-hover:text-white transition-colors duration-300">
                <LinkIcon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">무제한 링크</h3>
              <p className="text-slate-400 leading-relaxed">
                SNS, 블로그, 포트폴리오, 쇼핑몰 등 연결하고 싶은 모든 링크를 제한 없이 자유롭게 추가하세요.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">방문자 통계</h3>
              <p className="text-slate-400 leading-relaxed">
                내 페이지에 얼마나 많은 사람들이 방문했는지, 어떤 링크를 많이 클릭했는지 한눈에 확인하세요.
              </p>
            </div>
          </div>
        </div>
        
        {/* Mockup / Visual Section */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 mb-10">
          <div className="relative rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent p-1">
            <div className="rounded-[2.4rem] bg-slate-900/80 backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col md:flex-row items-center p-8 md:p-12 gap-10">
              
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl font-bold text-white leading-tight">
                  나만의 개성을 <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">완벽하게 표현</span>하세요
                </h3>
                <p className="text-slate-400 text-lg">
                  세상에 하나뿐인 커스텀 URL로 나만의 브랜드를 만들고,<br className="hidden md:block" /> 
                  어디서든 쉽게 공유할 수 있습니다.
                </p>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 w-fit">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-slate-300 font-mono text-sm">mylink.com/<span className="text-white font-bold">yourname</span></span>
                </div>
              </div>
              
              <div className="flex-1 w-full flex justify-center">
                {/* Simulated Phone Mockup */}
                <div className="relative w-full max-w-[280px] aspect-[1/2] rounded-[2.5rem] border-[8px] border-slate-800 bg-slate-50 shadow-2xl overflow-hidden hover:rotate-2 hover:scale-105 transition-all duration-500 group">
                  <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl mx-auto w-1/2 z-20" />
                  
                  {/* Mockup Content */}
                  <div className="w-full h-full p-4 pt-10 flex flex-col gap-4 bg-gradient-to-br from-indigo-50 to-pink-50 relative">
                    {/* Mockup Background Blurs */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/50 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200/50 rounded-full blur-2xl" />
                    
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-400 to-fuchsia-400 p-1 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center overflow-hidden">
                          <span className="bg-slate-200 text-slate-500 text-xl font-bold w-full h-full flex items-center justify-center">US</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800">Your Name</h4>
                      <p className="text-xs text-slate-500 text-center">크리에이터, 개발자, 아티스트</p>
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-4 relative z-10">
                      <div className="h-12 w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white flex items-center px-4 hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                        </div>
                        <div className="ml-3 h-3 bg-slate-200 rounded w-24" />
                      </div>
                      <div className="h-12 w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white flex items-center px-4 hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="w-6 h-6 rounded-md bg-pink-100 flex items-center justify-center">
                          <div className="w-3 h-3 bg-pink-500 rounded-sm" />
                        </div>
                        <div className="ml-3 h-3 bg-slate-200 rounded w-20" />
                      </div>
                      <div className="h-12 w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white flex items-center px-4 hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                          <div className="w-3 h-3 bg-slate-500 rounded-sm" />
                        </div>
                        <div className="ml-3 h-3 bg-slate-200 rounded w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Simple Footer */}
        <footer className="w-full py-8 text-center border-t border-white/5 relative z-10">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} MyLink. All rights reserved.</p>
        </footer>
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
          <div className="flex flex-col items-center gap-4 text-center w-full relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
              <AvatarImage src={profile.avatarUrl} alt={`@${profile.displayName}`} />
              <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            {isEditingProfile ? (
              <Card className="w-full border-indigo-200 bg-white shadow-lg ring-2 ring-indigo-500/20 mt-2">
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="username">이름</Label>
                    <Input
                      id="username"
                      value={editProfileUsername}
                      onChange={(e) => setEditProfileUsername(e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="bg-white border-slate-300 text-slate-900 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="slug">접속 URL (슬러그)</Label>
                    <div className="flex items-center">
                      <span className="text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-md px-3 py-2 text-sm flex items-center h-8">
                        mylink.com/
                      </span>
                      <Input
                        id="slug"
                        value={editProfileDisplayName}
                        onChange={(e) => setEditProfileDisplayName(e.target.value)}
                        placeholder="영문, 숫자, 하이픈"
                        className="bg-white rounded-l-none border-slate-300 text-slate-900 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="bio">한 줄 소개</Label>
                    <textarea
                      id="bio"
                      value={editProfileBio}
                      onChange={(e) => setEditProfileBio(e.target.value)}
                      placeholder="자신을 소개해주세요"
                      className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={handleCancelEditProfile} disabled={isUpdatingProfile} className="bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900">
                      <X className="w-4 h-4 mr-1" /> 취소
                    </Button>
                    <Button size="sm" onClick={handleSaveProfile} disabled={isUpdatingProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      {isUpdatingProfile ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />} 저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="relative w-full flex flex-col items-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-800">{profile.username}</h1>
                <p className="mt-1 text-sm text-slate-500 font-medium whitespace-pre-wrap px-8">
                  {profile.bio}
                </p>
                <div className="mt-2 text-xs font-mono text-slate-400 bg-slate-100/50 inline-block px-2 py-1 rounded-md">
                  /{profile.displayName}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleStartEditProfile} 
                  className="mt-4 rounded-full border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  프로필 수정
                </Button>
              </div>
            )}
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
                        <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isUpdating} className="bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900">
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
                        {/* Link Title & Stats */}
                        <div className="flex-1 flex flex-col items-center mr-8">
                          <span className="text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                            {link.title}
                          </span>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400 font-medium">
                            <MousePointerClick className="h-3 w-3" />
                            <span>{link.clickCount || 0}</span>
                          </div>
                        </div>
                        
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
