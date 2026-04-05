import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CATEGORIES = ['All', 'Strategy', 'AdTech', 'Automation', 'Execution', 'Operator Insights'];

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = activeCategory !== 'All' ? { category: activeCategory } : {};
        const res = await axios.get(`${API}/blog`, { params });
        setPosts(res.data.posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background" data-testid="blog-page">
      <Navbar />
      <div className="pt-24 pb-32 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-4 font-satoshi">INSIGHTS</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-none font-black font-cabinet" data-testid="blog-page-heading">
            The Operator's Blog
          </h1>
          <p className="text-base text-muted-foreground font-satoshi mt-4 max-w-xl">
            Strategy, execution, and automation insights for business leaders who build.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-12" data-testid="blog-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-satoshi border transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
              }`}
              data-testid={`blog-cat-${cat.toLowerCase().replace(' ', '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center" data-testid="blog-empty-state">
            <p className="text-muted-foreground font-satoshi">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-0 border border-border">
            {posts.map((post, i) => (
              <motion.div
                key={post.post_id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="block p-8 border-b border-border hover:bg-primary/5 transition-colors group"
                  data-testid={`blog-post-link-${i}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs px-3 py-1 border border-border font-satoshi text-muted-foreground">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground font-satoshi">
                          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl tracking-tight font-bold font-cabinet group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground font-satoshi mt-2 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-xl mt-2">&rarr;</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
