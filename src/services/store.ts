import {
  Product,
  Category,
  InventoryMovement,
  SocialPost,
  SocialAccount,
  StoreSettings,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_MOVEMENTS,
  INITIAL_SOCIAL_ACCOUNTS,
  INITIAL_SOCIAL_POSTS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'smart_boutique_products_v1',
  CATEGORIES: 'smart_boutique_categories_v1',
  MOVEMENTS: 'smart_boutique_movements_v1',
  POSTS: 'smart_boutique_posts_v1',
  ACCOUNTS: 'smart_boutique_accounts_v1',
  SETTINGS: 'smart_boutique_settings_v1',
  CURRENT_USER: 'smart_boutique_user_v1',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribeToStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// Store State Accessors & Mutators

// 1. USER & AUTH ROLE
export function getCurrentUser(): User {
  return loadFromStorage<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
}

export function setUserRole(role: UserRole): User {
  const user = getCurrentUser();
  const updatedUser: User = { ...user, role };
  saveToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);
  return updatedUser;
}

// 2. PRODUCTS
export function getProducts(): Product[] {
  return loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function saveProduct(productData: Partial<Product> & { name: string; price: number; categoryId: string }): Product {
  const products = getProducts();
  const now = new Date().toISOString();
  
  if (productData.id) {
    // Update existing
    const index = products.findIndex((p) => p.id === productData.id);
    if (index !== -1) {
      const updated: Product = {
        ...products[index],
        ...productData,
        updatedAt: now,
      };
      products[index] = updated;
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return updated;
    }
  }

  // Create new
  const id = `prod_${Date.now()}`;
  const slug = productData.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const newProduct: Product = {
    id,
    name: productData.name,
    slug: productData.slug || slug,
    description: productData.description || '',
    sku: productData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    categoryId: productData.categoryId,
    price: Number(productData.price),
    promoPrice: productData.promoPrice ? Number(productData.promoPrice) : undefined,
    stockQuantity: productData.stockQuantity !== undefined ? Number(productData.stockQuantity) : 10,
    lowStockThreshold: productData.lowStockThreshold !== undefined ? Number(productData.lowStockThreshold) : 5,
    mainImage: productData.mainImage || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    galleryImages: productData.galleryImages || [],
    isActive: productData.isActive !== undefined ? productData.isActive : true,
    isFeatured: productData.isFeatured || false,
    isNewArrival: productData.isNewArrival || true,
    createdAt: now,
    updatedAt: now,
  };

  const updatedProducts = [newProduct, ...products];
  saveToStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);

  // Auto record initial movement if stock > 0
  if (newProduct.stockQuantity > 0) {
    const user = getCurrentUser();
    addInventoryMovement({
      productId: newProduct.id,
      productName: newProduct.name,
      productSku: newProduct.sku,
      quantity: newProduct.stockQuantity,
      type: 'ENTRÉE',
      reason: 'Stock initial à la création du produit',
      userId: user.id,
      userName: user.name,
      notes: 'Initialisation automatique de stock',
    });
  }

  return newProduct;
}

export function deleteProduct(productId: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== productId);
  if (filtered.length !== products.length) {
    saveToStorage(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  }
  return false;
}

// 3. CATEGORIES
export function getCategories(): Category[] {
  const categories = loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const products = getProducts();

  // Dynamically update productCount
  return categories.map((cat) => ({
    ...cat,
    productCount: products.filter((p) => p.categoryId === cat.id).length,
  }));
}

export function saveCategory(categoryData: Partial<Category> & { name: string }): Category {
  const categories = getCategories();

  if (categoryData.id) {
    const index = categories.findIndex((c) => c.id === categoryData.id);
    if (index !== -1) {
      const updated: Category = { ...categories[index], ...categoryData };
      categories[index] = updated;
      saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
      return updated;
    }
  }

  const id = `cat_${Date.now()}`;
  const slug = categoryData.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const newCategory: Category = {
    id,
    name: categoryData.name,
    slug: categoryData.slug || slug,
    description: categoryData.description || '',
    image: categoryData.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    productCount: 0,
  };

  saveToStorage(STORAGE_KEYS.CATEGORIES, [newCategory, ...categories]);
  return newCategory;
}

export function deleteCategory(categoryId: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== categoryId);
  if (filtered.length !== categories.length) {
    saveToStorage(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  }
  return false;
}

// 4. INVENTORY MOVEMENTS
export function getInventoryMovements(): InventoryMovement[] {
  return loadFromStorage<InventoryMovement[]>(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
}

export function addInventoryMovement(
  movementData: Omit<InventoryMovement, 'id' | 'date'>
): InventoryMovement {
  const movements = getInventoryMovements();
  const products = getProducts();
  const productIndex = products.findIndex((p) => p.id === movementData.productId);

  const newMovement: InventoryMovement = {
    id: `mov_${Date.now()}`,
    ...movementData,
    date: new Date().toISOString(),
  };

  // Update product stock accordingly
  if (productIndex !== -1) {
    const product = products[productIndex];
    let newQty = product.stockQuantity;

    if (movementData.type === 'ENTRÉE') {
      newQty += Number(movementData.quantity);
    } else if (movementData.type === 'SORTIE') {
      newQty = Math.max(0, newQty - Number(movementData.quantity));
    } else if (movementData.type === 'AJUSTEMENT') {
      newQty = Number(movementData.quantity);
    }

    products[productIndex] = {
      ...product,
      stockQuantity: newQty,
      updatedAt: new Date().toISOString(),
    };

    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  saveToStorage(STORAGE_KEYS.MOVEMENTS, [newMovement, ...movements]);
  return newMovement;
}

// 5. SOCIAL POSTS
export function getSocialPosts(): SocialPost[] {
  return loadFromStorage<SocialPost[]>(STORAGE_KEYS.POSTS, INITIAL_SOCIAL_POSTS);
}

export function saveSocialPost(postData: Partial<SocialPost> & { title: string; content: string }): SocialPost {
  const posts = getSocialPosts();
  const user = getCurrentUser();
  const now = new Date().toISOString();

  if (postData.id) {
    const index = posts.findIndex((p) => p.id === postData.id);
    if (index !== -1) {
      const updated: SocialPost = { ...posts[index], ...postData };
      posts[index] = updated;
      saveToStorage(STORAGE_KEYS.POSTS, posts);
      return updated;
    }
  }

  const newPost: SocialPost = {
    id: `post_${Date.now()}`,
    productId: postData.productId,
    productName: postData.productName,
    title: postData.title,
    content: postData.content,
    cta: postData.cta || '',
    hashtags: postData.hashtags || [],
    platform: postData.platform || 'INSTAGRAM',
    status: postData.status || 'DRAFT',
    scheduledFor: postData.scheduledFor || new Date(Date.now() + 86400000).toISOString(),
    image: postData.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    style: postData.style || 'Élégant',
    variants: postData.variants || [],
    createdBy: user.name,
    createdAt: now,
  };

  saveToStorage(STORAGE_KEYS.POSTS, [newPost, ...posts]);
  return newPost;
}

export function deleteSocialPost(postId: string): boolean {
  const posts = getSocialPosts();
  const filtered = posts.filter((p) => p.id !== postId);
  if (filtered.length !== posts.length) {
    saveToStorage(STORAGE_KEYS.POSTS, filtered);
    return true;
  }
  return false;
}

export function publishPostNow(postId: string): SocialPost | null {
  const posts = getSocialPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index !== -1) {
    const updated: SocialPost = {
      ...posts[index],
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
    };
    posts[index] = updated;
    saveToStorage(STORAGE_KEYS.POSTS, posts);
    return updated;
  }
  return null;
}

// 6. SOCIAL ACCOUNTS
export function getSocialAccounts(): SocialAccount[] {
  return loadFromStorage<SocialAccount[]>(STORAGE_KEYS.ACCOUNTS, INITIAL_SOCIAL_ACCOUNTS);
}

export function toggleAccountConnection(accountId: string): SocialAccount | null {
  const accounts = getSocialAccounts();
  const index = accounts.findIndex((a) => a.id === accountId);
  if (index !== -1) {
    const updated: SocialAccount = {
      ...accounts[index],
      isConnected: !accounts[index].isConnected,
      lastSync: new Date().toISOString(),
    };
    accounts[index] = updated;
    saveToStorage(STORAGE_KEYS.ACCOUNTS, accounts);
    return updated;
  }
  return null;
}

// 7. SETTINGS
export function getSettings(): StoreSettings {
  return loadFromStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function updateSettings(newSettings: Partial<StoreSettings>): StoreSettings {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  saveToStorage(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

// CSV Export & Import Utilities
export function exportProductsToCsv(): string {
  const products = getProducts();
  const headers = ['ID', 'Nom', 'SKU', 'CategorieID', 'Prix', 'PrixPromo', 'Stock', 'SeuilAlerte', 'Actif', 'Creation'];
  const rows = products.map((p) => [
    p.id,
    `"${p.name.replace(/"/g, '""')}"`,
    p.sku,
    p.categoryId,
    p.price,
    p.promoPrice || '',
    p.stockQuantity,
    p.lowStockThreshold,
    p.isActive ? 'Oui' : 'Non',
    p.createdAt,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function resetDemoData(): void {
  saveToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  saveToStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  saveToStorage(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
  saveToStorage(STORAGE_KEYS.POSTS, INITIAL_SOCIAL_POSTS);
  saveToStorage(STORAGE_KEYS.ACCOUNTS, INITIAL_SOCIAL_ACCOUNTS);
  saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  saveToStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
}
