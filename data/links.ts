export interface Link {
  id: string;
  title: string;
  url: string;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const dummyLinks: Link[] = [
  {
    id: "1",
    title: "Instagram",
    url: "https://instagram.com",
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "YouTube",
    url: "https://youtube.com",
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "블로그",
    url: "https://blog.naver.com",
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Github",
    url: "https://github.com",
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://portfolio.com",
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
