import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Product, Category, InventoryMovement,
  SocialPost, SocialAccount, StoreSettings, User,
} from '../types';
import {
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_MOVEMENTS,
  INITIAL_SOCIAL_ACCOUNTS, INITIAL_SOCIAL_POSTS, INITIAL_SETTINGS, INITIAL_USERS,
} from '../data/initialData';

// ── Converters app → Supabase row ────────────────────────────────────────────

function productToRow(p: Product) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    sku: p.sku,
    category_id: p.categoryId || null,
    price: p.price,
    promo_price: p.promoPrice ?? null,
    stock_quantity: p.stockQuantity,
    low_stock_threshold: p.lowStockThreshold,
    main_image: p.mainImage || '',
    gallery_images: p.galleryImages || [],
    is_active: p.isActive,
    is_featured: p.isFeatured ?? false,
    is_new_arrival: p.isNewArrival ?? false,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) || '',
    sku: row.sku as string,
    categoryId: (row.category_id as string) || '',
    price: Number(row.price),
    promoPrice: row.promo_price != null ? Number(row.promo_price) : undefined,
    stockQuantity: row.stock_quantity as number,
    lowStockThreshold: row.low_stock_threshold as number,
    mainImage: (row.main_image as string) || '',
    galleryImages: (row.gallery_images as string[]) || [],
    isActive: row.is_active as boolean,
    isFeatured: row.is_featured as boolean,
    isNewArrival: row.is_new_arrival as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function categoryToRow(c: Category) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
  };
}

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) || '',
    image: (row.image as string) || '',
  };
}

function movementToRow(m: InventoryMovement) {
  return {
    id: m.id,
    product_id: m.productId,
    product_name: m.productName || null,
    product_sku: m.productSku || null,
    quantity: m.quantity,
    type: m.type,
    reason: m.reason || '',
    user_id: m.userId,
    user_name: m.userName,
    date: m.date,
    notes: m.notes || null,
  };
}

function rowToMovement(row: Record<string, unknown>): InventoryMovement {
  return {
    id: row.id as string,
    productId: row.product_id as string,
    productName: (row.product_name as string) || undefined,
    productSku: (row.product_sku as string) || undefined,
    quantity: row.quantity as number,
    type: row.type as InventoryMovement['type'],
    reason: (row.reason as string) || '',
    userId: row.user_id as string,
    userName: row.user_name as string,
    date: row.date as string,
    notes: (row.notes as string) || undefined,
  };
}

function postToRow(p: SocialPost) {
  return {
    id: p.id,
    product_id: p.productId || null,
    product_name: p.productName || null,
    title: p.title,
    content: p.content,
    cta: p.cta || '',
    hashtags: p.hashtags || [],
    platform: p.platform,
    status: p.status,
    scheduled_for: p.scheduledFor || null,
    published_at: p.publishedAt || null,
    image: p.image || '',
    style: p.style || 'Élégant',
    variants: p.variants || [],
    created_by: p.createdBy,
    created_at: p.createdAt,
  };
}

function rowToPost(row: Record<string, unknown>): SocialPost {
  return {
    id: row.id as string,
    productId: (row.product_id as string) || undefined,
    productName: (row.product_name as string) || undefined,
    title: row.title as string,
    content: row.content as string,
    cta: (row.cta as string) || '',
    hashtags: (row.hashtags as string[]) || [],
    platform: row.platform as SocialPost['platform'],
    status: row.status as SocialPost['status'],
    scheduledFor: (row.scheduled_for as string) || '',
    publishedAt: (row.published_at as string) || undefined,
    image: (row.image as string) || '',
    style: (row.style as SocialPost['style']) || 'Élégant',
    variants: (row.variants as string[]) || [],
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
  };
}

function accountToRow(a: SocialAccount) {
  return {
    id: a.id,
    platform: a.platform,
    account_name: a.accountName,
    handle: a.handle,
    account_id: a.accountId,
    is_connected: a.isConnected,
    avatar_url: a.avatarUrl || '',
    last_sync: a.lastSync,
    followers_count: a.followersCount ?? 0,
  };
}

function rowToAccount(row: Record<string, unknown>): SocialAccount {
  return {
    id: row.id as string,
    platform: row.platform as SocialAccount['platform'],
    accountName: row.account_name as string,
    handle: row.handle as string,
    accountId: row.account_id as string,
    isConnected: row.is_connected as boolean,
    avatarUrl: (row.avatar_url as string) || '',
    lastSync: row.last_sync as string,
    followersCount: (row.followers_count as number) || 0,
  };
}

function settingsToRow(s: StoreSettings) {
  return {
    id: 1,
    store_name: s.storeName,
    tagline: s.tagline || '',
    currency: s.currency || 'MAD',
    phone: s.phone || '',
    whatsapp_number: s.whatsappNumber || '',
    whatsapp_message_template: s.whatsappMessageTemplate || '',
    address: s.address || '',
    email: s.email || '',
    low_stock_alert_email: s.lowStockAlertEmail,
    auto_ai_post_on_new_product: s.autoAiPostOnNewProduct,
    instagram_url: s.instagramUrl || '',
    facebook_url: s.facebookUrl || '',
  };
}

function rowToSettings(row: Record<string, unknown>): StoreSettings {
  return {
    storeName: row.store_name as string,
    tagline: (row.tagline as string) || '',
    currency: (row.currency as string) || 'MAD',
    phone: (row.phone as string) || '',
    whatsappNumber: (row.whatsapp_number as string) || '',
    whatsappMessageTemplate: (row.whatsapp_message_template as string) || '',
    address: (row.address as string) || '',
    email: (row.email as string) || '',
    lowStockAlertEmail: row.low_stock_alert_email as boolean,
    autoAiPostOnNewProduct: row.auto_ai_post_on_new_product as boolean,
    instagramUrl: (row.instagram_url as string) || '',
    facebookUrl: (row.facebook_url as string) || '',
  };
}

function userToRow(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar_url: u.avatarUrl || '',
  };
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    role: row.role as User['role'],
    avatarUrl: (row.avatar_url as string) || undefined,
  };
}

// ── Seed initial data ─────────────────────────────────────────────────────────

async function seedInitialData() {
  await supabase.from('categories').upsert(INITIAL_CATEGORIES.map(categoryToRow));
  await supabase.from('products').upsert(INITIAL_PRODUCTS.map(productToRow));
  await supabase.from('inventory_movements').upsert(INITIAL_MOVEMENTS.map(movementToRow));
  await supabase.from('social_posts').upsert(INITIAL_SOCIAL_POSTS.map(postToRow));
  await supabase.from('social_accounts').upsert(INITIAL_SOCIAL_ACCOUNTS.map(accountToRow));
  await supabase.from('store_settings').upsert([settingsToRow(INITIAL_SETTINGS)]);
  await supabase.from('users').upsert(INITIAL_USERS.map(userToRow));
}

// ── Init: load all data from Supabase into localStorage ──────────────────────

export async function initFromSupabase(): Promise<{
  products: Product[];
  categories: Category[];
  movements: InventoryMovement[];
  posts: SocialPost[];
  accounts: SocialAccount[];
  settings: StoreSettings;
  user: User;
} | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: existingProducts, error: checkError } = await supabase
      .from('products').select('id').limit(1);
    if (checkError) throw checkError;

    if (!existingProducts || existingProducts.length === 0) {
      await seedInitialData();
    }

    const [products, categories, movements, posts, accounts, settingsRes, users] =
      await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
        supabase.from('inventory_movements').select('*').order('date', { ascending: false }),
        supabase.from('social_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('social_accounts').select('*'),
        supabase.from('store_settings').select('*').eq('id', 1).single(),
        supabase.from('users').select('*').limit(2),
      ]);

    return {
      products: (products.data ?? []).map(rowToProduct),
      categories: (categories.data ?? []).map(rowToCategory),
      movements: (movements.data ?? []).map(rowToMovement),
      posts: (posts.data ?? []).map(rowToPost),
      accounts: (accounts.data ?? []).map(rowToAccount),
      settings: settingsRes.data ? rowToSettings(settingsRes.data) : INITIAL_SETTINGS,
      user: users.data?.[0] ? rowToUser(users.data[0]) : INITIAL_USERS[0],
    };
  } catch (err) {
    console.warn('[Supabase] Init failed — using localStorage fallback:', err);
    return null;
  }
}

// ── Fire-and-forget sync functions ───────────────────────────────────────────

function log(err: unknown, op: string) {
  if (err) console.error(`[Supabase] ${op}:`, err);
}

export function syncProduct(product: Product) {
  supabase.from('products').upsert(productToRow(product))
    .then(({ error }) => log(error, 'syncProduct'));
}

export function deleteProductSupabase(id: string) {
  supabase.from('products').delete().eq('id', id)
    .then(({ error }) => log(error, 'deleteProduct'));
}

export function syncCategory(category: Category) {
  supabase.from('categories').upsert(categoryToRow(category))
    .then(({ error }) => log(error, 'syncCategory'));
}

export function deleteCategorySupabase(id: string) {
  supabase.from('categories').delete().eq('id', id)
    .then(({ error }) => log(error, 'deleteCategory'));
}

export function syncMovement(movement: InventoryMovement) {
  supabase.from('inventory_movements').upsert(movementToRow(movement))
    .then(({ error }) => log(error, 'syncMovement'));
}

export function syncPost(post: SocialPost) {
  supabase.from('social_posts').upsert(postToRow(post))
    .then(({ error }) => log(error, 'syncPost'));
}

export function deletePostSupabase(id: string) {
  supabase.from('social_posts').delete().eq('id', id)
    .then(({ error }) => log(error, 'deletePost'));
}

export function syncAccount(account: SocialAccount) {
  supabase.from('social_accounts').upsert(accountToRow(account))
    .then(({ error }) => log(error, 'syncAccount'));
}

export function syncSettings(settings: StoreSettings) {
  supabase.from('store_settings').upsert(settingsToRow(settings))
    .then(({ error }) => log(error, 'syncSettings'));
}

export function syncUser(user: User) {
  supabase.from('users').upsert(userToRow(user))
    .then(({ error }) => log(error, 'syncUser'));
}

export async function resetSupabaseData() {
  try {
    await supabase.from('inventory_movements').delete().neq('id', '');
    await supabase.from('social_posts').delete().neq('id', '');
    await supabase.from('products').delete().neq('id', '');
    await supabase.from('social_accounts').delete().neq('id', '');
    await supabase.from('categories').delete().neq('id', '');
    await seedInitialData();
  } catch (err) {
    console.error('[Supabase] resetSupabaseData:', err);
  }
}
