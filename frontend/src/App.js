import "@/App.css";
import "@/index.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import HomePage from "@/pages/HomePage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import AdminLogin from "@/pages/AdminLogin";
import AuthCallback from "@/pages/AuthCallback";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminSubscribers from "@/pages/admin/AdminSubscribers";
import AdminContent from "@/pages/admin/AdminContent";

function AppRouter() {
  const location = useLocation();

  // Check URL fragment for session_id synchronously during render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="subscribers" element={<AdminSubscribers />} />
        <Route path="content" element={<AdminContent />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ContentProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ContentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
