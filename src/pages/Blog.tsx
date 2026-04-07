import { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, Search } from 'lucide-react';
import { useBlogs, BlogPost } from '../context/BlogContext';

interface BlogProps {
  onClose: () => void;
}

const Blog = ({ onClose }: BlogProps) => {
  const { blogs } = useBlogs();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogs.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Blog Post Detail
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b z-10">
          <div className="container-custom py-4 flex items-center justify-between">
            <button onClick={() => setSelectedPost(null)} className="text-gray-600 hover:text-gray-900">
              ← Back to Blog
            </button>
          </div>
        </header>

        <article className="container-custom py-8 max-w-3xl mx-auto">
          <span className="text-elitos-orange text-sm font-medium">{selectedPost.category}</span>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {selectedPost.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-500 text-sm mb-8">
            <span className="flex items-center gap-1">
              <User size={14} />
              {selectedPost.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {selectedPost.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {selectedPost.readTime}
            </span>
          </div>

          <img 
            src={selectedPost.image} 
            alt={selectedPost.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          />

          <div className="prose prose-lg max-w-none">
            {selectedPost.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h3 key={idx} className="text-xl font-bold mt-6 mb-3">{paragraph.replace(/\*\*/g, '')}</h3>;
              }
              if (paragraph.startsWith('**')) {
                return <h4 key={idx} className="text-lg font-semibold mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</h4>;
              }
              if (paragraph.match(/^\d\./)) {
                return <p key={idx} className="ml-4 mb-2">{paragraph}</p>;
              }
              if (paragraph.startsWith('-')) {
                return <p key={idx} className="ml-4 mb-1">{paragraph}</p>;
              }
              return <p key={idx} className="text-gray-700 mb-4 leading-relaxed">{paragraph}</p>;
            })}
          </div>

          <div className="mt-12 p-8 bg-elitos-cream rounded-xl text-center">
            <h3 className="text-xl font-bold text-elitos-brown mb-2">
              Ready to Shop?
            </h3>
            <p className="text-gray-600 mb-4">
              Explore our collection of premium footwear.
            </p>
            <button onClick={onClose} className="btn-primary">
              Shop Now
            </button>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {blogs.filter(p => p.id !== selectedPost.id).slice(0, 2).map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="text-left bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <span className="text-elitos-orange text-xs font-medium">{post.category}</span>
                    <h4 className="font-semibold mt-1 line-clamp-2">{post.title}</h4>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Blog List
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b z-10">
        <div className="container-custom py-4 flex items-center justify-between">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ← Back to Shop
          </button>
          <h1 className="font-semibold">ELITOS Blog</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-elitos-brown mb-4">
            Style Tips & Guides
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest trends, care guides, and styling tips from the ELITOS team.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 border rounded-full focus:ring-2 focus:ring-elitos-orange focus:border-transparent"
            />
          </div>
        </div>

        {filteredPosts.length > 0 && (
          <button
            onClick={() => setSelectedPost(filteredPosts[0])}
            className="w-full mb-12 bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow text-left"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <img 
                src={filteredPosts[0].image} 
                alt={filteredPosts[0].title}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <span className="text-elitos-orange text-sm font-medium mb-2">
                  {filteredPosts[0].category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {filteredPosts[0].title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span>{filteredPosts[0].date}</span>
                  <span>•</span>
                  <span>{filteredPosts[0].readTime}</span>
                </div>
                <span className="mt-4 text-elitos-orange font-medium flex items-center gap-2">
                  Read More <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </button>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="text-left bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="text-elitos-orange text-xs font-medium">
                  {post.category}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
