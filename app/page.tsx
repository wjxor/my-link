import { dummyLinks } from "@/data/links";
import { dummyUser } from "@/data/user";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function Page() {
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
          {dummyLinks.map((link) => {
            const urlObj = new URL(link.url);
            const domain = urlObj.hostname;
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={faviconUrl} 
                        alt={`${link.title} icon`} 
                        className="h-6 w-6 rounded-sm object-contain"
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
