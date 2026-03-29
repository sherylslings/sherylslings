import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateBlogPostData = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBlogPostData = Partial<CreateBlogPostData>;

// Public: fetch only published posts
export const useBlogPosts = () =>
  useQuery({
    queryKey: ['blog-posts', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

// Public: fetch single post by slug
export const useBlogPost = (slug: string) =>
  useQuery({
    queryKey: ['blog-posts', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!slug,
  });

// Admin: fetch all posts (published + draft)
export const useAdminBlogPosts = () =>
  useQuery({
    queryKey: ['blog-posts', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

// Admin: create post
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBlogPostData) => {
      const { data: created, error } = await supabase
        .from('blog_posts')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return created as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

// Admin: update post
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateBlogPostData & { id: string }) => {
      const { data: updated, error } = await supabase
        .from('blog_posts')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return updated as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

// Admin: delete post
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

// Helper: generate slug from title
export const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
