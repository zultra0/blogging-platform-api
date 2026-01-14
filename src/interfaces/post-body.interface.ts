export interface CreatePostBody {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface UpdatePostBody extends CreatePostBody {}
