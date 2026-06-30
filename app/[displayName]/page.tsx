import type { Metadata } from "next";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import UserPageClient from "./user-page-client";

type Props = {
  params: Promise<{ displayName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { displayName } = await params;

  let username = displayName;
  let bio = "내 링크들을 확인해보세요!";

  try {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", displayName)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      username = userData.username || displayName;
      bio = userData.bio || bio;
    }
  } catch (error) {
    console.error("Error fetching user for metadata:", error);
  }

  const title = `${username}의 링크`;
  const description = bio.length > 155 ? bio.slice(0, 155) + "…" : bio;

  return {
    title,
    description,
    openGraph: {
      title: `${username}의 링크 | MyLink`,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${username}의 링크 | MyLink`,
      description,
    },
  };
}

export default function Page() {
  return <UserPageClient />;
}
