import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  children?: Category[];
}

interface Variant {
  name: string;
  value: string;
  price: string;
  stock: string;
}

interface ProductData {
  name: string;
  price: string;
  stock: string;
  category_id: string;
  image: File | null;
  description: string;
  product_type: 'single' | 'variable';
  variants: Variant[];
}

interface Props {
  categories: Category[];
}

const ProductVariants: React.FC<{
  variants: Variant[];
  setVariants: (variants: Variant[]) => void;
}> = ({ variants, setVariants }) => {
  const handleAddVariant = () => {
    setVariants([...variants, { name: '', value: '', price: '', stock: '' }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Variants</h3>
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <input
              type="text"
              value={variant.name}
              onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
              placeholder="Attribute Name (e.g., Size)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            <input
              type="text"
              value={variant.value}
              onChange={(e) => handleVariantChange(index, 'value', e.target.value)}
              placeholder="Value (e.g., Small)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            <input
              type="number"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
              placeholder="Price"
              step="0.01"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            <input
              type="number"
              value={variant.stock}
              onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
              placeholder="Stock"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => handleRemoveVariant(index)}
              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddVariant}
          className="w-full mt-2 px-4 py-3 text-sm font-medium text-primary border-2 border-dashed border-primary/40 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Variant
        </button>
      </div>
    </div>
  );
};

export default function AddProduct({ categories = [] }: Props) {
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    price: '',
    stock: '',
    category_id: '',
    image: null,
    description: '',
    product_type: 'single',
    variants: [],
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Render category options recursively
  const renderCategoryOptions = (categories: Category[], level = 0): JSX.Element[] => {
    const options: JSX.Element[] = [];

    categories.forEach((category) => {
      const indent = '  '.repeat(level);
      const prefix = level > 0 ? '└─ ' : '';

      options.push(
        <option key={category.id} value={category.id}>
          {indent}{prefix}{category.name}
        </option>
      );

      if (category.children && category.children.length > 0) {
        options.push(...renderCategoryOptions(category.children, level + 1));
      }
    });

    return options;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'image' && e.target instanceof HTMLInputElement && e.target.files?.[0]) {
      const file = e.target.files[0];
      setProductData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    let parsedValue: string | number = value;
    if (name === 'price' || name === 'stock') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        parsedValue = '';
      }
    }

    setProductData((prev) => ({ ...prev, [name]: parsedValue }));

    if (name === 'product_type' && value === 'variable') {
      setProductData((prev) => ({ ...prev, variants: [] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('category_id', productData.category_id);
    formData.append('product_type', productData.product_type);

    if (productData.product_type === 'single') {
      formData.append('price', productData.price.toString());
      formData.append('stock', productData.stock.toString());
    } else {
      formData.append('variants', JSON.stringify(productData.variants));
    }

    if (productData.image) {
      formData.append('image', productData.image);
    }

    router.post('/seller/products', formData, {
      onSuccess: () => {
        // Redirect to manage products page
        router.visit('/seller/products/manage');
      },
      onError: (errors) => {
        console.error('Error adding product:', errors);
        setLoading(false);
      },
      onFinish: () => {
        setLoading(false);
      },
    });
  };

  const handleCancel = () => {
    router.visit('/seller/products/manage');
  };

  return (
    <DashboardLayout>
      <Head title="Add Product" />

      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark px-8 py-6 relative">
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-white hover:text-gray-200 text-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white">Add New Product</h2>
            <p className="text-primary/20 mt-1">Create and configure your product details</p>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[calc(95vh-120px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Type Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <label className="block text-lg font-semibold text-gray-800 mb-4">Product Type</label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="product_type"
                        value="single"
                        checked={productData.product_type === 'single'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          productData.product_type === 'single'
                            ? 'border-primary bg-primary'
                            : 'border-gray-300 group-hover:border-primary/40'
                        }`}
                      >
                        {productData.product_type === 'single' && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 font-medium group-hover:text-primary transition-colors">
                      Single Product
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="product_type"
                        value="variable"
                        checked={productData.product_type === 'variable'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          productData.product_type === 'variable'
                            ? 'border-primary bg-primary'
                            : 'border-gray-300 group-hover:border-primary/40'
                        }`}
                      >
                        {productData.product_type === 'variable' && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        )}
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 font-medium group-hover:text-primary transition-colors">
                      Variable Product
                    </span>
                  </label>
                </div>
              </div>

              {/* Basic Information Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white resize-none"
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category_id"
                    value={productData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {renderCategoryOptions(categories)}
                  </select>
                </div>
              </div>

              {/* Pricing Section - Only for Single Products */}
              {productData.product_type === 'single' && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Inventory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                      <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                      <input
                        type="number"
                        name="stock"
                        value={productData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Product Image Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Image</h3>
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/40 transition-colors bg-white">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="mx-auto h-48 w-auto object-cover rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600">Image uploaded successfully!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors">
                            Choose Image
                          </span>
                          <input
                            id="image-upload"
                            name="image"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                            accept="image/*"
                          />
                        </label>
                        <p className="mt-2 text-sm text-gray-500">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Variants - Only for Variable Products */}
              {productData.product_type === 'variable' && (
                <ProductVariants
                  variants={productData.variants}
                  setVariants={(newVariants) => setProductData((prev) => ({ ...prev, variants: newVariants }))}
                />
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-dark hover:to-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
