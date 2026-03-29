import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useAdminBlogPosts,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  generateSlug,
  type BlogPost,
  type CreateBlogPostData,
} from '@/hooks/useBlogPosts';
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const EMPTY_FORM: CreateBlogPostData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  cover_image_url: '',
  published: false,
};

const AdminBlog = () => {
  const { data: posts, isLoading } = useAdminBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<CreateBlogPostData>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const openCreate = () => {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setIsEditorOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      cover_image_url: post.cover_image_url || '',
      published: post.published,
    });
    setIsEditorOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      // Auto-generate slug only when creating (not editing)
      slug: editingPost ? prev.slug : generateSlug(title),
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        excerpt: form.excerpt || null,
        cover_image_url: form.cover_image_url || null,
      };
      if (editingPost) {
        await updatePost.mutateAsync({ id: editingPost.id, ...payload });
        toast.success('Post updated!');
      } else {
        await createPost.mutateAsync(payload);
        toast.success('Post created!');
      }
      setIsEditorOpen(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save post';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await updatePost.mutateAsync({ id: post.id, published: !post.published });
      toast.success(post.published ? 'Post unpublished' : 'Post published!');
    } catch {
      toast.error('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePost.mutateAsync(deleteId);
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Blog</h2>
          <p className="text-muted-foreground">Manage blog posts visible on your website</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Blog
          </a>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Posts List */}
      {!posts || posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No blog posts yet</h3>
            <p className="text-muted-foreground mb-4">Create your first blog post to get started.</p>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Create First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex items-center gap-4 py-4">
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    <span
                      className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(post.created_at), 'MMM d, yyyy')} · /blog/{post.slug}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(post)}
                    title={post.published ? 'Unpublish' : 'Publish'}
                    className="h-8 w-8 p-0"
                  >
                    {post.published ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(post)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(post.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'New Blog Post'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="blog-title">Title *</Label>
              <Input
                id="blog-title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Your blog post title"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="blog-slug">Slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground shrink-0">/blog/</span>
                <Input
                  id="blog-slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))
                  }
                  placeholder="your-post-slug"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <Label htmlFor="blog-cover">Cover Image URL</Label>
              <Input
                id="blog-cover"
                value={form.cover_image_url || ''}
                onChange={(e) => setForm(prev => ({ ...prev, cover_image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
              {form.cover_image_url && (
                <img
                  src={form.cover_image_url}
                  alt="Cover preview"
                  className="w-full max-h-48 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="blog-excerpt">Excerpt (short summary)</Label>
              <Textarea
                id="blog-excerpt"
                value={form.excerpt || ''}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="A brief summary shown in the blog listing..."
                rows={2}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>Content *</Label>
              <RichTextEditor
                value={form.content}
                onChange={(val) => setForm(prev => ({ ...prev, content: val }))}
                placeholder="Write your blog post content here..."
                minHeight="250px"
              />
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="blog-published"
                checked={form.published}
                onCheckedChange={(checked) => setForm(prev => ({ ...prev, published: checked }))}
              />
              <Label htmlFor="blog-published" className="cursor-pointer">
                {form.published ? 'Published (visible on site)' : 'Draft (hidden from site)'}
              </Label>
            </div>

            {/* Save */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                {isSaving ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blog post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBlog;
