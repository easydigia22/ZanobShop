export type UserRole = 'ADMIN' | 'MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  categoryId: string;
  price: number;
  promoPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  mainImage: string;
  galleryImages: string[];
  isActive: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'ENTRÉE' | 'SORTIE' | 'AJUSTEMENT';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName?: string;
  productSku?: string;
  quantity: number;
  type: MovementType;
  reason: string;
  userId: string;
  userName: string;
  date: string;
  notes?: string;
}

export type PostPlatform = 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'ALL';
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
export type PostStyle = 'Promotionnel' | 'Élégant' | 'Familial' | 'Court' | 'Storytelling';

export interface SocialPost {
  id: string;
  productId?: string;
  productName?: string;
  title: string;
  content: string;
  cta: string;
  hashtags: string[];
  platform: PostPlatform;
  status: PostStatus;
  scheduledFor: string;
  publishedAt?: string;
  image: string;
  style: PostStyle;
  variants?: string[];
  createdBy: string;
  createdAt: string;
}

export interface SocialAccount {
  id: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK';
  accountName: string;
  handle: string;
  accountId: string;
  isConnected: boolean;
  avatarUrl: string;
  lastSync: string;
  followersCount?: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  currency: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  address: string;
  email: string;
  lowStockAlertEmail: boolean;
  autoAiPostOnNewProduct: boolean;
  instagramUrl: string;
  facebookUrl: string;
  logoUrl?: string;
}

export interface AiGenerationRequest {
  productName: string;
  categoryName?: string;
  description: string;
  price: number;
  promoPrice?: number;
  style: PostStyle;
  platform: PostPlatform;
  customNotes?: string;
}

export interface AiGenerationResponse {
  title: string;
  content: string;
  cta: string;
  hashtags: string[];
  variants: string[];
}

export type OrderStatus = 'EN_ATTENTE' | 'CONFIRMÉE' | 'EN_LIVRAISON' | 'LIVRÉE' | 'ANNULÉE';

export interface OrderItem {
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
}
