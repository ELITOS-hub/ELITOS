import { Instagram } from 'lucide-react';

const instagramPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
    likes: 234,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
    likes: 456,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    likes: 189,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop',
    likes: 567,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=300&fit=crop',
    likes: 321,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop',
    likes: 278,
  },
];

const InstagramFeed = () => {
  return (
    <section className="py-10 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center">
              <Instagram size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-elitos-brown">@elitos.official</h2>
              <p className="text-gray-500 text-sm">Follow for style inspiration</p>
            </div>
          </div>
          <a
            href="https://instagram.com/elitos.official"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-elitos-orange font-medium hover:underline hidden md:block"
          >
            Follow Us →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/elitos.official"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden rounded-lg group"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">❤️ {post.likes}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
