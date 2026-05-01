export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: Array<{
    type: string;
    children: Array<{
      type: string;
      text: string;
    }>;
  }>;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  author?: {
    id: number;
    documentId: string;
    name: string;
    email: string;
  };
  tags?: Array<{
    id: number;
    documentId: string;
    name: string;
  }>;
}
