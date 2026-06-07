export interface User {
  uid: string;
  displayName: string; // URL 슬러그로 사용되는 닉네임
  username: string; // 화면 프로필 상단에 노출되는 실제 이름
  bio: string; // 프로필 한줄 소개글
  avatarUrl: string; // 아바타 이미지 URL (PRD상 사용자가 업로드하진 않지만, 더미/소셜 로그인용으로 유지)
  visitorCount: number;
}

export const dummyUser: User = {
  uid: "user_12345",
  displayName: "dev_ko",
  username: "Developer Ko",
  bio: "Frontend Developer & Creator.\nSharing my projects and thoughts.",
  avatarUrl: "https://github.com/shadcn.png",
  visitorCount: 1542,
};
