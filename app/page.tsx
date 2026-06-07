import { dummyLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh p-6 flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-4">
        {dummyLinks.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="hover:bg-accent transition-colors">
              <CardContent className="flex items-center justify-center p-4">
                <span className="font-medium text-lg">{link.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
