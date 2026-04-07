import { useState, useCallback } from 'react';
import { 
  ArrowLeft, Plus, Search, Edit2, Trash2, Eye, 
  Sparkles, Save, RefreshCw
} from 'lucide-react';
import { Product, Gender, SubCategory } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { adminAPI } from '../../services/api';
import ImageUpload from '../../components/ImageUpload';

interface ProductManagementProps {
  onBack: () => void;
}

const ProductManagement = ({ onBack }: ProductManagementProps) => {
  const { products, addProduct, updateProduct, deleteProduct, refreshProducts, isUsingAPI } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'footwear' as 'footwear' | 'winterwear',
    gender: 'men' as Gender,
    subCategory: '' as SubCategory | '',
    price: '',
    wholesalePrice: '',
    moq: '',
    stock: '',
    sizes: [] as string[],
    material: '',
    description: '',
    images: ['', '', '', ''],
    featured: false,
    bestseller: false,
    availableForWholesale: false,
    tags: [] as string[],
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleGenerateAIDescription = async () => {
    setIsGeneratingAI(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiDescription = `Introducing the ${formData.name || 'Premium Product'} - crafted with ${formData.material || 'premium materials'} for exceptional comfort and style. Perfect for everyday wear, this ${formData.category} piece combines modern design with lasting durability. Features include breathable construction, cushioned support, and a versatile look that pairs well with any outfit. Experience the ELITOS difference - where quality meets affordability.`;
    
    setFormData({ ...formData, description: aiDescription });
    setIsGeneratingAI(false);
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshProducts();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshProducts]);

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price) {
      alert('Please fill in required fields (Name and Price)');
      return;
    }
    
    setIsSaving(true);
    
    const filteredImages = formData.images.filter(img => img && img.trim() !== '');
    
    if (filteredImages.length === 0) {
      alert('Please add at least one product image');
      setIsSaving(false);
      return;
    }

    // Generate slug from name
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + 
      '-' + formData.gender;

    const productData = {
      name: formData.name,
      slug: editingProduct?.slug || slug,
      description: formData.description,
      price: parseFloat(formData.price),
      wholesalePrice: formData.wholesalePrice ? parseFloat(formData.wholesalePrice) : undefined,
      moq: formData.moq ? parseInt(formData.moq) : undefined,
      image: filteredImages[0] || '',
      images: filteredImages,
      category: formData.category,
      gender: formData.gender,
      subCategory: (formData.subCategory || undefined) as SubCategory | undefined,
      sizes: formData.sizes,
      colors: [],
      material: formData.material,
      stock: parseInt(formData.stock) || 0,
      featured: formData.featured,
      bestseller: formData.bestseller,
      tags: formData.tags,
    };

    try {
      // Try API first if available
      if (isUsingAPI) {
        const apiData = {
          name: productData.name,
          slug: productData.slug,
          description: productData.description || '',
          price: productData.price,
          wholesalePrice: productData.wholesalePrice,
          moq: productData.moq,
          images: productData.images,
          category: productData.category,
          subcategory: formData.subCategory || undefined,
          gender: formData.gender.toUpperCase() as 'MEN' | 'WOMEN' | 'KIDS' | 'UNISEX',
          sizes: productData.sizes,
          colors: [],
          material: productData.material,
          stock: productData.stock,
          featured: productData.featured,
          bestseller: productData.bestseller,
          tags: productData.tags,
        };
        
        if (editingProduct) {
          await adminAPI.updateProduct(editingProduct.id, apiData);
        } else {
          await adminAPI.createProduct(apiData);
        }
        
        // Refresh products from API
        await refreshProducts();
        alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        // Fallback to context
        if (editingProduct) {
          updateProduct(editingProduct.id, productData);
        } else {
          addProduct(productData);
        }
        alert(editingProduct ? 'Product updated locally!' : 'Product added locally!');
      }
      
      resetForm();
    } catch (err: any) {
      console.error('Save product error:', err);
      alert('Error saving product: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'footwear',
      gender: 'men',
      subCategory: '',
      price: '',
      wholesalePrice: '',
      moq: '',
      stock: '',
      sizes: [],
      material: '',
      description: '',
      images: ['', '', '', ''],
      featured: false,
      bestseller: false,
      availableForWholesale: false,
      tags: [],
    });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      gender: product.gender || 'men',
      subCategory: product.subCategory || '',
      price: product.price.toString(),
      wholesalePrice: product.wholesalePrice?.toString() || '',
      moq: product.moq?.toString() || '',
      stock: product.stock?.toString() || '0',
      sizes: product.sizes || [],
      material: product.material || '',
      description: product.description || '',
      images: product.images || [product.image, '', '', ''],
      featured: product.featured || false,
      bestseller: product.bestseller || false,
      availableForWholesale: !!product.wholesalePrice,
      tags: product.tags || [],
    });
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        if (isUsingAPI) {
          await adminAPI.deleteProduct(productId);
          await refreshProducts();
        } else {
          deleteProduct(productId);
        }
      } catch (err) {
        console.error('Delete error:', err);
        deleteProduct(productId);
      }
    }
  };

  const toggleSize = (size: string) => {
    if (formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  // Product Form
  if (isAddingProduct) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button onClick={handleSaveProduct} disabled={isSaving} className="btn-primary flex items-center gap-2">
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                    placeholder="e.g., Premium Leather Sneaker"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'footwear' | 'winterwear' })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                  >
                    <option value="footwear">Footwear</option>
                    <option value="winterwear">Winterwear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'men' | 'women' | 'kids' | 'unisex' })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                {formData.category === 'footwear' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                    <select
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value as SubCategory | '' })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                    >
                      <option value="">Select...</option>
                      <option value="sneakers">Sneakers</option>
                      <option value="casual-shoes">Casual Shoes</option>
                      <option value="formal-shoes">Formal Shoes</option>
                      <option value="sports-shoes">Sports Shoes</option>
                      <option value="sandals">Sandals</option>
                      <option value="heels">Heels</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                    placeholder="e.g., Genuine Leather"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                    placeholder="2999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
              <div className="mb-2">
                <span className="text-xs text-gray-500">Footwear (Indian):</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['4', '5', '6', '7', '8', '9', '10', '11', '12'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                      formData.sizes.includes(size)
                        ? 'border-elitos-orange bg-elitos-orange text-white'
                        : 'border-gray-200 hover:border-elitos-orange'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="mb-2">
                <span className="text-xs text-gray-500">Clothing:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                      formData.sizes.includes(size)
                        ? 'border-elitos-orange bg-elitos-orange text-white'
                        : 'border-gray-200 hover:border-elitos-orange'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Product Images</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag & drop images, paste from clipboard (Ctrl+V), or enter URL. First image will be the main product image.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, idx) => (
                  <ImageUpload
                    key={idx}
                    value={img}
                    onChange={(url) => {
                      const newImages = [...formData.images];
                      newImages[idx] = url;
                      setFormData({ ...formData, images: newImages });
                    }}
                    label={idx === 0 ? 'Main Image *' : `Image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Description with AI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <button
                  type="button"
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-2 text-sm text-elitos-orange hover:text-elitos-red"
                >
                  <Sparkles size={16} />
                  {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                placeholder="Product description..."
              />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-elitos-orange rounded"
                />
                <span>Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bestseller}
                  onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                  className="w-4 h-4 text-elitos-orange rounded"
                />
                <span>Bestseller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.availableForWholesale}
                  onChange={(e) => setFormData({ ...formData, availableForWholesale: e.target.checked })}
                  className="w-4 h-4 text-elitos-orange rounded"
                />
                <span>Available for Wholesale</span>
              </label>
            </div>

            {/* Wholesale Pricing (shown only when wholesale is enabled) */}
            {formData.availableForWholesale && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-lg mb-4 text-blue-800">Wholesale Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wholesale Price (₹)</label>
                    <input
                      type="number"
                      value={formData.wholesalePrice}
                      onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                      placeholder="1999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Qty (MOQ)</label>
                    <input
                      type="number"
                      value={formData.moq}
                      onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
                      placeholder="100"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Note: Wholesale buyers will contact via WhatsApp/Email. Prices are not shown publicly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Product List
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">Product Management</h2>
          {isUsingAPI && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">API Connected</span>}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            title="Refresh products"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsAddingProduct(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-elitos-orange"
          >
            <option value="all">All Categories</option>
            <option value="footwear">Footwear</option>
            <option value="winterwear">Winterwear</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-gray-700">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{formatPrice(product.price)}</p>
                    {product.wholesalePrice && (
                      <p className="text-xs text-gray-500">Wholesale: {formatPrice(product.wholesalePrice)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${(product.stock || 0) < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                      {product.stock || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {product.bestseller && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Bestseller</span>
                      )}
                      {product.featured && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
