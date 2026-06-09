"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LogIn, Loader2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, isLoading } = useAuth();

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("로그아웃되었습니다.");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleCopyLink = async () => {
    if (!user) return;
    const slug = user.email ? user.email.split("@")[0] : user.displayName;
    const url = `${window.location.origin}/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("내 링크가 클립보드에 복사되었습니다!");
    } catch (err) {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  const handleViewLivePage = () => {
    if (!user) return;
    const slug = user.email ? user.email.split("@")[0] : user.displayName;
    window.open(`/${slug}`, "_blank");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-indigo-600">MyLink</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-slate-700 sm:inline-block">
                {user.displayName}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger render={<button className="outline-none rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all" />}>
                  <Avatar className="h-8 w-8 border border-slate-200 cursor-pointer">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                    <AvatarFallback>{user.displayName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                      <Copy className="mr-2 h-4 w-4 text-slate-500" />
                      내 링크 복사하기
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleViewLivePage} className="cursor-pointer">
                      <ExternalLink className="mr-2 h-4 w-4 text-slate-500" />
                      내 페이지 미리보기
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button size="sm" onClick={handleSignIn} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <LogIn className="mr-2 h-4 w-4" />
              구글로 로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
