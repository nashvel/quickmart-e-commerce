import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { getProductImageUrl, ASSET_URLS } from '@/config/assets';
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  ChevronDown, 
  Clock, 
  Check, 
  X, 
  AlertTriangle,
  Utensils
} from 'lucide-react';

interface Variant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  attributes: Record<string, string>;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  product_type: 'single' | 'variable';
  price?: number;
  stock?: number;
  image: string;
  is_approved: boolean | number | string;
  is_active: boolean | number | string;
  rejection_reason?: string;
  variants?: Variant[];
}

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Gaming Laptop',
    description: 'High-performance gaming laptop with RTX 4060',
    product_type: 'single',
    price: 45999,
    stock: 15,
    image: 'laptop.jpg',
    is_approved: true,
    is_active: true,
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    product_type: 'variable',
    image: 'mouse.jpg',
    is_approved: true,
    is_active: true,
    variants: [
      {
        id: 1,
        sku: 'MOUSE-BLK-001',
        price: 899,
        stock: 50,
        image: 'mouse-black.jpg',
        attributes: { Color: 'Black', Size: 'Standard' }
      },
      {
        id: 2,
        sku: 'MOUSE-WHT-001',
        price: 899,
        stock: 30,
        image: 'mouse-white.jpg',
        attributes: { Color: 'White', Size: 'Standard' }
      },
    ]
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    product_type: 'single',
    price: 2499,
    stock: 0,
    image: 'keyboard.jpg',
    is_approved: false,
    is_active: false,
    rejection_reason: 'Product images are not clear. Please upload high-quality images.',
  },
  {
    id: 4,
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    product_type: 'single',
    price: 1299,
    stock: 25,
    image: 'usb-hub.jpg',
    is_approved: false,
    is_active: true,
  },
];

interface ProductListItemProps {
  product: Product;
  onSelect: (product: Product) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
}

const ProductListItem = ({ product, onSelect, onDelete, isSelected }: ProductListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAttribute = (variant: Variant, attributeName: string) => {
    if (!variant || !variant.attributes) return '';
    const attributeKey = Object.keys(variant.attributes).find(
      key => key.toLowerCase() === attributeName.toLowerCase()
    );
    return attributeKey ? variant.attributes[attributeKey] : '';
  };

  const getApprovalStatus = () => {
    const isApproved = product.is_approved === true || product.is_approved === 1 || product.is_approved === '1';
    const isActive = product.is_active === true || product.is_active === 1 || product.is_active === '1' || product.is_active === undefined;
    
    if (isApproved) {
      return {
        status: 'approved',
        label: 'Approved',
        icon: Check,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
      };
    } else if (!isApproved && !isActive) {
      return {
        status: 'rejected',
        label: 'Rejected',
        icon: X,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
      };
    } else {
      return {
        status: 'pending',
        label: 'Pending Approval',
        icon: Clock,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
      };
    }
  };

  const approvalStatus = getApprovalStatus();
  const StatusIcon = approvalStatus.icon;

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all duration-300 ${
      isSelected ? 'ring-2 ring-primary' : ''
    }`}>
      <div 
        className="p-4 grid grid-cols-12 gap-4 items-center cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Product Image */}
        <div className="col-span-2 flex items-center">
          <img 
            src={getProductImageUrl(product.image)}
            alt={product.name} 
            className="w-16 h-16 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = ASSET_URLS.PLACEHOLDERS.PRODUCT;
            }}
          />
        </div>

        {/* Product Info */}
        <div className="col-span-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-primary">{product.name}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              approvalStatus.bgColor
            } ${approvalStatus.textColor}`}>
              <StatusIcon className={`mr-1 ${approvalStatus.iconColor}`} size={10} />
              {approvalStatus.label}
            </span>
          </div>
          {product.product_type === 'variable' ? (
            <p className="text-sm text-gray-500">{product.variants?.length || 0} variant(s)</p>
          ) : (
            <p className="text-sm text-gray-500">₱{product.price} - {product.stock} in stock</p>
          )}
          {product.rejection_reason && approvalStatus.status === 'rejected' && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center text-red-700 text-xs font-medium mb-1">
                <AlertTriangle className="mr-1" size={10} />
                Rejection Reason
              </div>
              <p className="text-red-600 text-xs">{product.rejection_reason}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="col-span-5 flex items-center justify-end gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onSelect(product); }} 
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              approvalStatus.status === 'approved' 
                ? 'text-white bg-primary hover:bg-primary-dark' 
                : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
            }`}
            disabled={approvalStatus.status !== 'approved'}
          >
            Edit
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (window.confirm('Are you sure you want to delete this product?')) {
                onDelete(product.id);
              }
            }} 
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 size={18} />
          </button>
          <div className={`transform transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            <ChevronDown className="text-gray-500" size={20} />
          </div>
        </div>
      </div>

      {/* Expanded Content - Variants */}
      {product.product_type === 'variable' && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-96' : 'max-h-0'
        }`}>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-semibold mb-3 text-gray-700">Variants:</h4>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-6 gap-2 text-sm font-semibold text-gray-600 px-3 py-2 border-b">
                <div>Size</div>
                <div>Color</div>
                <div className="truncate">SKU</div>
                <div>Price</div>
                <div>Stock</div>
                <div>Image</div>
              </div>
              {/* Rows */}
              {product.variants?.map((variant) => (
                <div 
                  key={variant.id} 
                  className="grid grid-cols-6 gap-2 items-center text-sm bg-white p-2 rounded-lg shadow-sm"
                >
                  <div>{getAttribute(variant, 'Size')}</div>
                  <div>{getAttribute(variant, 'Color')}</div>
                  <div className="truncate">{variant.sku}</div>
                  <div>₱{variant.price}</div>
                  <div>{variant.stock}</div>
                  <div>
                    <img 
                      src={getProductImageUrl(variant.image || product.image)}
                      alt={`${product.name} - ${getAttribute(variant, 'Color')}`}
                      className="w-12 h-12 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.src = ASSET_URLS.PLACEHOLDERS.PRODUCT;
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expanded Content - Description */}
      {product.product_type === 'single' && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-96' : 'max-h-0'
        }`}>
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-md font-semibold mb-2 text-gray-700">Description:</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {product.description || 'No description available.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'addons'>('products');

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    // TODO: Open edit modal or navigate to edit page
    console.log('Edit product:', product);
  };

  const handleAddNew = () => {
    // TODO: Navigate to add product page or open modal
    window.location.href = '/seller/products/add';
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    // TODO: API call to delete product
  };

  return (
    <DashboardLayout role="seller">
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-primary">Product Management</h1>
            {activeTab === 'products' && (
              <button 
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors font-semibold"
              >
                <Plus size={18} /> Add New Product
              </button>
            )}
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'products'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package size={18} />
                  Products
                </div>
              </button>
              <button
                onClick={() => setActiveTab('addons')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'addons'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Utensils size={18} />
                  Add-ons
                </div>
              </button>
            </nav>
          </div>
        </header>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'products' && (
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-center py-16 px-6 bg-gray-50 rounded-lg">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No products yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first product.
                  </p>
                </div>
              ) : (
                products.map(product => (
                  <ProductListItem 
                    key={product.id} 
                    product={product}
                    onSelect={handleSelectProduct}
                    onDelete={handleDelete}
                    isSelected={selectedProduct?.id === product.id}
                  />
                ))
              )}
            </div>
          )}
          
          {activeTab === 'addons' && (
            <div className="text-center py-16 px-6 bg-gray-50 rounded-lg">
              <Utensils className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Add-ons Management</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product add-ons here.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
