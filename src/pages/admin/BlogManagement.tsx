import { useState } from 'react';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Search, Eye, 
  Calendar, User, Clock, Save, X, FileText
} from 'lucide-react';
import { useBlogs, BlogPost } from '../../context/BlogContext';

interface BlogManagementProps {
  onBack: () => void;
}

const categories = [
  'Footwear Guide',
  'Style Tips',
  'Care Guide',
  'Buying Guide',
  'Fashion Trends',
  'News',
  'How To',
];

const BlogManagement = ({ onBack }: BlogManagementProps) => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useBlogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'ELITOS Team',
    category: 'Style Tips',
    readTime: '5 min read',
  });

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewBlog = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: 'ELITOS Team',
      category: 'Style Tips',
      readTime: '5 min read',
    });
    setIsEditing(true);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      author: blog.author,
      category: blog.category,
      readTime: blog.readTime,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }

    const today = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    if (editingBlog) {
      // Update existing blog
      updateBlog(editingBlog.id, {
        ...formData,
        date: editingBlog.date, // Keep original date
      });
    } else {
      // Add new blog
      addBlog({
        ...formData,
        date: today,
      });
    }

    setIsEditing(false);
    setEditingBlog(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(id);
    }
  };

  // Preview Modal
  if (previewBlog) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setPreviewBlog(null)} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-bold">Preview: {previewBlog.title}</h2>
          </div>
          <button
            onClick={() => {
              setPreviewBlog(null);
              handleEditBlog(previewBlog);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit
          </button>
        </header>

        <div className="max-w-3xl mx-auto p-6">
          <article className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img 
              src={previewBlog.image} 
              alt={previewBlog.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <span className="text-elitos-orange text-sm font-medium">{previewBlog.category}</span>
              <h1 className="text-2xl font-bold mt-2 mb-4">{previewBlog.title}</h1>
              <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {previewBlog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {previewBlog.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {previewBlog.readTime}
                </span>
              </div>
              <p className="text-gray-600 italic mb-6">{previewBlog.excerpt}</p>
              <div className="prose max-w-none">
                {previewBlog.content.split('\n\n').map((para, idx) => (
                  <p key={idx} className="mb-4 text-gray-700 whitespace-pre-wrap">{para}</p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Edit/Add Form
  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-bold">
              {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
            </h2>
          </div>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save size={18} />
            Save
          </button>
        </header>

        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog title..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Short Description)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description for preview..."
                rows={2}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
              />
              {formData.image && (
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="mt-2 h-32 w-full object-cover rounded-lg"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use Unsplash for free images (https://unsplash.com)
              </p>
            </div>

            {/* Category & Author Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
                />
              </div>
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Read Time
              </label>
              <select
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
              >
                <option value="3 min read">3 min read</option>
                <option value="5 min read">5 min read</option>
                <option value="7 min read">7 min read</option>
                <option value="10 min read">10 min read</option>
                <option value="15 min read">15 min read</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here...

Use **text** for bold
Use separate paragraphs for better readability
Add numbered lists like:
1. First point
2. Second point"
                rows={15}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-elitos-orange focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use **text** for bold, separate paragraphs with blank lines
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Blog List
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg lg:text-xl font-bold">Blog Management</h2>
        </div>
        <button onClick={handleNewBlog} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span className="hidden sm:inline">New Blog</span>
        </button>
      </header>

      <div className="p-4 lg:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{blogs.length}</p>
                <p className="text-sm text-gray-500">Total Posts</p>
              </div>
            </div>
          </div>
          {['Footwear Guide', 'Style Tips', 'Fashion Trends'].map(cat => (
            <div key={cat} className="bg-white rounded-xl p-4 shadow-sm hidden lg:block">
              <p className="text-lg font-bold">{blogs.filter(b => b.category === cat).length}</p>
              <p className="text-sm text-gray-500">{cat}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
            />
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredBlogs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No blogs found</h3>
              <p className="text-gray-500 mb-4">Create your first blog post to get started.</p>
              <button onClick={handleNewBlog} className="btn-primary">
                Create Blog Post
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredBlogs.map(blog => (
                <div key={blog.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-20 h-20 lg:w-32 lg:h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs text-elitos-orange font-medium">{blog.category}</span>
                          <h3 className="font-semibold text-gray-900 line-clamp-1 mt-1">{blog.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1 hidden sm:block">{blog.excerpt}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {blog.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {blog.date}
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <Clock size={12} />
                            {blog.readTime}
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setPreviewBlog(blog)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
