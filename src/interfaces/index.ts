export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostBody {
  title: string;
  content: string;
  category: string;
  tags: string[];
}
