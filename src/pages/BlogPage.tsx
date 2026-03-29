import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { BookOpen } from 'lucide-react';

const BlogPage = () => {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <Layout>
      <div className="gradient-warm py-12">
        <div className="container">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground mt-2">Tips, guides, and babywearing stories</p>
        </div>
      </div>

      <div className="container py-12 max-w-4xl">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="font-serif text-xl font-semibold mb-2">No posts yet</h2>
            <p className="text-muted-foreground">Check back soon for babywearing tips and guides!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link to={`/blog/${post.slug}`} className="block">
                  {post.cover_image_url && (
                    <div className="aspect-[2/1] rounded-xl overflow-hidden mb-4 shadow-sm">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(post.created_at), 'MMMM d, yyyy')}
                    </p>
                    <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    )}
                    <span className="text-primary text-sm font-medium group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </Link>
                <hr className="mt-8 border-border" />
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogPage;
