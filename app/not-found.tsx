import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center bg-slate-50 p-6 text-slate-900 selection:bg-indigo-500/30">
      <div className="relative z-10 flex flex-col items-center max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center p-5 rounded-full bg-white shadow-sm ring-1 ring-slate-200/50">
          <FileQuestion className="h-14 w-14 text-indigo-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">페이지를 찾을 수 없습니다</h2>
        <p className="text-lg text-slate-500 font-medium px-4 leading-relaxed">
          요청하신 URL의 사용자 프로필을 찾을 수 없거나,<br className="hidden sm:block" /> 삭제된 페이지일 수 있습니다.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 rounded-full px-8 font-semibold">
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
