import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API}/blog/${slug}`);
        setPost(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4" data-testid="blog-post-not-found">
          <p className="font-cabinet font-bold text-xl">Post not found</p>
          <Link to="/blog" className="text-primary font-satoshi text-sm hover:underline">
            &larr; Back to blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="blog-post-page">
      <Navbar />
      <article className="pt-24 pb-32 max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-satoshi mb-8 transition-colors"
            data-testid="blog-back-link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs px-3 py-1 border border-border font-satoshi text-muted-foreground">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground font-satoshi">
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl tracking-tighter leading-none font-black font-cabinet mb-6" data-testid="blog-post-title">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground font-satoshi leading-relaxed mb-8 border-l-2 border-primary pl-4">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-1 border border-border font-satoshi text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div
            className="prose prose-lg max-w-none font-satoshi
              prose-headings:font-cabinet prose-headings:tracking-tight
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-strong:text-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
            data-testid="blog-post-content"
          />
        </motion.div>
      </article>
      <Footer />
    </div>
  );
}
