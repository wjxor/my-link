"use client";

import { useState } from "react";
import { dummyLinks, Link as LinkType } from "@/data/links";
import { dummyUser } from "@/data/user";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Page() {
  const [links, setLinks] = useState<LinkType[]>(dummyLinks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const docRef = await addDoc(collection(db, "users", "anonymous", "links"), {
        title: trimmedTitle,
        url: finalUrl,
        clickCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newLink: LinkType = {
        id: docRef.id,
        title: trimmedTitle,
        url: finalUrl,
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setLinks([newLink, ...links]);
      setIsDialogOpen(false);
      setNewTitle("");
      setNewUrl("");
      toast.success("새로운 링크가 추가되었습니다.");
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("링크를 추가하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-slate-50 p-6 text-slate-900 selection:bg-indigo-500/30 relative">
      {/* Bright Background Gradient Effect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-300/40 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-pink-300/30 blur-[120px]" />
        <div className="absolute top-[20%] left-[50%] w-[50%] h-[50%] rounded-full bg-sky-300/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 py-10">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
            <AvatarImage src={dummyUser.avatarUrl} alt={`@${dummyUser.displayName}`} />
            <AvatarFallback>{dummyUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">{dummyUser.username}</h1>
            <p className="mt-1 text-sm text-slate-500 font-medium whitespace-pre-wrap">
              {dummyUser.bio}
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex w-full flex-col gap-4">
          {/* Add Link Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button variant="outline" className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 bg-white/50 backdrop-blur-xl" />}>
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
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="border-white/60 bg-white/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-indigo-500/15">
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
                    <span className="flex-1 text-center text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                      {link.title}
                    </span>
                    {/* Spacer for perfect centering */}
                    <div className="w-10 shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
