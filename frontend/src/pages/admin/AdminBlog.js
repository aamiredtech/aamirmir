import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CATEGORIES = ['Strategy', 'AdTech', 'Automation', 'Execution', 'Operator Insights'];

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'Strategy', tags: '', published: false });

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/admin/blog`, { withCredentials: true });
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const openCreate = () => {
    setEditingPost(null);
    setForm({ title: '', content: '', excerpt: '', category: 'Strategy', tags: '', published: false });
    setDialogOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category,
      tags: (post.tags || []).join(', '),
      published: post.published
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      if (editingPost) {
        await axios.put(`${API}/blog/${editingPost.post_id}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${API}/blog`, payload, { withCredentials: true });
      }
      setDialogOpen(false);
      fetchPosts();
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`${API}/blog/${postId}`, { withCredentials: true });
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div data-testid="admin-blog-page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-bold font-cabinet">Blog Posts</h1>
        <Button
          data-testid="create-post-btn"
          onClick={openCreate}
          className="bg-primary text-primary-foreground hover:opacity-90 rounded-none font-satoshi flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      <div className="border border-border">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-satoshi text-muted-foreground uppercase tracking-wider">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Actions</div>
        </div>
        {posts.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground font-satoshi" data-testid="no-posts-msg">
            No posts yet. Create your first post.
          </div>
        ) : (
          posts.map((post, i) => (
            <div key={post.post_id} className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border items-center" data-testid={`admin-post-row-${i}`}>
              <div className="col-span-5">
                <p className="text-sm font-satoshi font-medium truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground font-satoshi truncate">{post.slug}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs px-2 py-0.5 border border-border font-satoshi">{post.category}</span>
              </div>
              <div className="col-span-2">
                <span className={`text-xs px-2 py-0.5 ${post.published ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground font-satoshi">
                {new Date(post.created_at).toLocaleDateString()}
              </div>
              <div className="col-span-1 flex items-center gap-1">
                <button
                  onClick={() => openEdit(post)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid={`edit-post-btn-${i}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(post.post_id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  data-testid={`delete-post-btn-${i}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" data-testid="blog-post-dialog">
          <DialogHeader>
            <DialogTitle className="font-cabinet font-bold">
              {editingPost ? 'Edit Post' : 'New Post'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Title</label>
              <Input
                data-testid="post-title-input"
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                className="rounded-none font-satoshi"
              />
            </div>
            <div>
              <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Excerpt</label>
              <Input
                data-testid="post-excerpt-input"
                value={form.excerpt}
                onChange={(e) => setForm(p => ({ ...p, excerpt: e.target.value }))}
                className="rounded-none font-satoshi"
              />
            </div>
            <div>
              <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Category</label>
              <Select value={form.category} onValueChange={(val) => setForm(p => ({ ...p, category: val }))}>
                <SelectTrigger className="rounded-none font-satoshi" data-testid="post-category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Tags (comma separated)</label>
              <Input
                data-testid="post-tags-input"
                value={form.tags}
                onChange={(e) => setForm(p => ({ ...p, tags: e.target.value }))}
                className="rounded-none font-satoshi"
                placeholder="strategy, automation, growth"
              />
            </div>
            <div>
              <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Content (HTML)</label>
              <Textarea
                data-testid="post-content-input"
                value={form.content}
                onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
                className="rounded-none font-satoshi min-h-[200px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-testid="post-published-switch"
                checked={form.published}
                onCheckedChange={(checked) => setForm(p => ({ ...p, published: checked }))}
              />
              <label className="text-sm font-satoshi">Published</label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                data-testid="save-post-btn"
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground hover:opacity-90 rounded-none font-satoshi"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </Button>
              <Button
                data-testid="cancel-post-btn"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-none font-satoshi"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
