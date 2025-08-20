export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  readTime: number;
  tableOfContents?: TableOfContentsItem[];
  faqs?: FAQ[];
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}