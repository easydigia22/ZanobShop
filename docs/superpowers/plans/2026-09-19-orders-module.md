# Orders Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un module complet de gestion des commandes — formulaire client sur le storefront + vue admin avec statuts, filtres et débit stock automatique.

**Architecture:** Les commandes sont stockées en localStorage (clé `smart_boutique_orders_v1`), suivant le même pattern que les autres entités (loadFromStorage / saveToStorage / notifyListeners). Le client passe commande via une modale sur la fiche produit ; l'admin gère les statuts dans un nouvel onglet. La confirmation d'une commande déclenche automatiquement un mouvement SORTIE dans l'inventaire.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, localStorage uniquement (pas de DB)

**Spec:** Conversation du 2026-09-19 — design approuvé par l'utilisateur.

## Global Constraints

- Dark theme uniquement : `bg-slate-950` racine, `bg-slate-900` sidebar, accent amber (`amber-500`)
- Toutes les chaînes UI en français
- Aucun package npm supplémentaire — icônes via lucide-react déjà installé
- Suivre le pattern localStorage existant : `loadFromStorage` / `saveToStorage` / `notifyListeners`
- `npm run lint` (`tsc --noEmit`) doit passer après chaque tâche
- Numéro de commande format : `CMD-YYYY-NNN` (ex: `CMD-2026-001`)

---

### Task 1 : Types — Order, OrderItem, OrderStatus

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Produces: `OrderStatus`, `OrderItem`, `Order` — utilisés par toutes les tâches suivantes

- [ ] **Étape 1 : Ajouter les types dans `src/types.ts`** (à la fin du fichier)

```typescript
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
```

- [ ] **Étape 2 : Vérifier le build TypeScript**

```bash
npm run lint
```
Expected: aucune erreur

- [ ] **Étape 3 : Commit**

```bash
git add src/types.ts
git commit -m "feat(orders): add Order, OrderItem, OrderStatus types"
```

---

### Task 2 : Store — fonctions CRUD commandes

**Files:**
- Modify: `src/services/store.ts`

**Interfaces:**
- Consumes: `Order`, `OrderItem`, `OrderStatus` de `src/types.ts` (Task 1)
- Consumes: `addInventoryMovement`, `getCurrentUser`, `getProducts` — déjà dans store.ts
- Produces:
  - `getOrders(): Order[]`
  - `addOrder(data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'total'>): Order`
  - `updateOrderStatus(orderId: string, status: OrderStatus): Order | null`
  - `deleteOrder(orderId: string): boolean`

- [ ] **Étape 1 : Ajouter la clé ORDERS dans STORAGE_KEYS**

Dans `src/services/store.ts`, ajouter dans l'objet `STORAGE_KEYS` :
```typescript
ORDERS: 'smart_boutique_orders_v1',
```

- [ ] **Étape 2 : Ajouter l'import du type Order**

En haut du fichier, dans l'import depuis `'../types'`, ajouter `Order, OrderStatus` :
```typescript
import {
  Product,
  Category,
  InventoryMovement,
  SocialPost,
  SocialAccount,
  StoreSettings,
  User,
  UserRole,
  Order,
  OrderStatus,
} from '../types';
```

- [ ] **Étape 3 : Ajouter les 4 fonctions en bas de store.ts** (avant `resetDemoData`)

```typescript
// 8. ORDERS
export function getOrders(): Order[] {
  return loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
}

export function addOrder(
  data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
): Order {
  const orders = getOrders();
  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const seq = String(orders.length + 1).padStart(3, '0');

  const newOrder: Order = {
    ...data,
    id: `order_${Date.now()}`,
    orderNumber: `CMD-${year}-${seq}`,
    createdAt: now,
    updatedAt: now,
  };

  saveToStorage(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const prev = orders[index];
  const now = new Date().toISOString();
  const updated: Order = {
    ...prev,
    status,
    updatedAt: now,
    confirmedAt: status === 'CONFIRMÉE' ? now : prev.confirmedAt,
  };

  // Débiter le stock à la confirmation
  if (status === 'CONFIRMÉE' && prev.status !== 'CONFIRMÉE') {
    const user = getCurrentUser();
    for (const item of updated.items) {
      addInventoryMovement({
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        quantity: item.quantity,
        type: 'SORTIE',
        reason: `Commande ${updated.orderNumber} confirmée`,
        userId: user.id,
        userName: user.name,
      });
    }
  }

  orders[index] = updated;
  saveToStorage(STORAGE_KEYS.ORDERS, orders);
  return updated;
}

export function deleteOrder(orderId: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== orderId);
  if (filtered.length === orders.length) return false;
  saveToStorage(STORAGE_KEYS.ORDERS, filtered);
  return true;
}
```

- [ ] **Étape 4 : Ajouter la réinitialisation dans `resetDemoData`**

Dans la fonction `resetDemoData`, ajouter :
```typescript
saveToStorage(STORAGE_KEYS.ORDERS, []);
```

- [ ] **Étape 5 : Lint**

```bash
npm run lint
```

- [ ] **Étape 6 : Commit**

```bash
git add src/services/store.ts
git commit -m "feat(orders): add getOrders, addOrder, updateOrderStatus, deleteOrder to store"
```

---

### Task 3 : useStore — exposer orders + pendingOrdersCount

**Files:**
- Modify: `src/hooks/useStore.ts`

**Interfaces:**
- Consumes: `getOrders` de `src/services/store.ts` (Task 2)
- Produces: `orders: Order[]`, `pendingOrdersCount: number` dans le retour du hook

- [ ] **Étape 1 : Ajouter l'import**

```typescript
import {
  subscribeToStore,
  getProducts,
  getCategories,
  getInventoryMovements,
  getSocialPosts,
  getSocialAccounts,
  getSettings,
  getCurrentUser,
  getOrders,
} from '../services/store';
import { Order } from '../types';
```

- [ ] **Étape 2 : Ajouter l'état orders dans le hook**

Après `const [user, setUser] = useState(getCurrentUser());` :
```typescript
const [orders, setOrders] = useState<Order[]>(getOrders());
```

- [ ] **Étape 3 : Ajouter setOrders dans le subscribeToStore callback**

```typescript
const unsubscribe = subscribeToStore(() => {
  setProducts(getProducts());
  setCategories(getCategories());
  setMovements(getInventoryMovements());
  setPosts(getSocialPosts());
  setAccounts(getSocialAccounts());
  setSettings(getSettings());
  setUser(getCurrentUser());
  setOrders(getOrders()); // <-- ajouter
});
```

- [ ] **Étape 4 : Ajouter la valeur dérivée et le retour**

Après `const totalInventoryValue = ...` :
```typescript
const pendingOrdersCount = orders.filter((o) => o.status === 'EN_ATTENTE').length;
```

Dans le `return { ... }`, ajouter :
```typescript
orders,
pendingOrdersCount,
```

- [ ] **Étape 5 : Lint**

```bash
npm run lint
```

- [ ] **Étape 6 : Commit**

```bash
git add src/hooks/useStore.ts
git commit -m "feat(orders): expose orders and pendingOrdersCount in useStore"
```

---

### Task 4 : AdminSidebar — onglet Commandes avec badge

**Files:**
- Modify: `src/components/AdminSidebar.tsx`

**Interfaces:**
- Consumes: `pendingOrdersCount` de `useStore` (Task 3)
- Produces: onglet `'orders'` cliquable dans la sidebar

- [ ] **Étape 1 : Ajouter l'icône ShoppingBag à l'import lucide**

```typescript
import {
  LayoutDashboard,
  Package,
  Layers,
  ArrowDownUp,
  Sparkles,
  Share2,
  Calendar,
  Settings,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';
```

- [ ] **Étape 2 : Exposer pendingOrdersCount depuis useStore**

```typescript
const { lowStockProducts, outOfStockProducts, posts, pendingOrdersCount } = useStore();
```

- [ ] **Étape 3 : Ajouter l'item Commandes dans navItems** (après `dashboard`, avant `products`)

```typescript
{
  id: 'orders',
  label: 'Commandes',
  icon: ShoppingBag,
  badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
  badgeColor: 'bg-rose-500 text-white',
},
```

- [ ] **Étape 4 : Lint**

```bash
npm run lint
```

- [ ] **Étape 5 : Commit**

```bash
git add src/components/AdminSidebar.tsx
git commit -m "feat(orders): add Commandes nav item with pending badge in AdminSidebar"
```

---

### Task 5 : OrdersView — vue admin complète

**Files:**
- Create: `src/components/OrdersView.tsx`

**Interfaces:**
- Consumes: `orders: Order[]` de `useStore` (Task 3)
- Consumes: `updateOrderStatus`, `deleteOrder` de `src/services/store`
- Consumes: `settings.whatsappNumber` pour lien WhatsApp client
- Produces: composant `<OrdersView />` à monter dans App.tsx (Task 6)

- [ ] **Étape 1 : Créer `src/components/OrdersView.tsx`**

```typescript
import React, { useState } from 'react';
import {
  ShoppingBag,
  Phone,
  MapPin,
  ChevronRight,
  X,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Clock,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { updateOrderStatus, deleteOrder } from '../services/store';
import { Order, OrderStatus } from '../types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  EN_ATTENTE: {
    label: 'En attente',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  CONFIRMÉE: {
    label: 'Confirmée',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  EN_LIVRAISON: {
    label: 'En livraison',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  LIVRÉE: {
    label: 'Livrée',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: <PackageCheck className="w-3.5 h-3.5" />,
  },
  ANNULÉE: {
    label: 'Annulée',
    color: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const STATUS_FLOW: OrderStatus[] = ['EN_ATTENTE', 'CONFIRMÉE', 'EN_LIVRAISON', 'LIVRÉE'];

export const OrdersView: React.FC = () => {
  const { orders, settings } = useStore();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const countByStatus = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleDelete = (orderId: string) => {
    if (!confirm('Supprimer cette commande ?')) return;
    deleteOrder(orderId);
    if (selectedOrder?.id === orderId) setSelectedOrder(null);
  };

  const openWhatsApp = (phone: string, orderNumber: string) => {
    const msg = `Bonjour, concernant votre commande ${orderNumber} passée sur ZANOUBSHOP.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const nextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx !== -1 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            Commandes
          </h1>
          <p className="text-sm text-slate-400 mt-1">{orders.length} commande(s) au total</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            filterStatus === 'ALL'
              ? 'bg-amber-500 text-slate-950 border-amber-500'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          Toutes ({orders.length})
        </button>
        {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              filterStatus === s
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {STATUS_CONFIG[s].icon}
            {STATUS_CONFIG[s].label} ({countByStatus(s)})
          </button>
        ))}
      </div>

      {/* Main Layout: Table + Detail Panel */}
      <div className="flex gap-4">
        {/* Table */}
        <div className={`flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden ${selectedOrder ? 'hidden md:block' : ''}`}>
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Aucune commande</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">N°</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Client</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden sm:table-cell">Ville</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold">Total</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const sc = STATUS_CONFIG[order.status];
                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-slate-800/50 hover:bg-slate-800/40 cursor-pointer transition ${selectedOrder?.id === order.id ? 'bg-slate-800/60' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-4 py-3 font-mono text-amber-400 font-semibold">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-white">{order.customer.name}</td>
                      <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{order.customer.city}</td>
                      <td className="px-4 py-3 text-right text-white font-semibold">{order.total.toFixed(2)} MAD</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-semibold ${sc.color}`}>
                          {sc.icon}{sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        {selectedOrder && (
          <div className="w-full md:w-96 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden flex-shrink-0">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="font-mono text-amber-400 font-bold text-sm">{selectedOrder.orderNumber}</span>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-slate-800 rounded-lg transition">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Client Info */}
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Client</p>
                <p className="text-white font-semibold">{selectedOrder.customer.name}</p>
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3" />{selectedOrder.customer.phone}
                </p>
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{selectedOrder.customer.city} — {selectedOrder.customer.address}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Articles</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-800/60 rounded-xl px-3 py-2">
                    <div>
                      <p className="text-white text-xs font-medium">{item.productName}</p>
                      <p className="text-slate-400 text-[10px]">Qté : {item.quantity} × {item.unitPrice} MAD</p>
                    </div>
                    <p className="text-amber-400 font-semibold text-xs">{(item.quantity * item.unitPrice).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between px-3 pt-1">
                  <span className="text-slate-400 text-xs">Total</span>
                  <span className="text-white font-bold">{selectedOrder.total.toFixed(2)} MAD</span>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Statut</p>
                <div className="grid grid-cols-1 gap-1">
                  {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => {
                    const sc = STATUS_CONFIG[s];
                    const isActive = selectedOrder.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedOrder.id, s)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                          isActive ? sc.color : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {sc.icon}{sc.label}
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Notes</p>
                  <p className="text-slate-300 text-xs bg-slate-800/60 rounded-xl px-3 py-2">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => openWhatsApp(selectedOrder.customer.phone, selectedOrder.orderNumber)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              {nextStatus(selectedOrder.status) && (
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, nextStatus(selectedOrder.status)!)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition"
                >
                  Avancer → {STATUS_CONFIG[nextStatus(selectedOrder.status)!].label}
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedOrder.id)}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Étape 2 : Lint**

```bash
npm run lint
```

- [ ] **Étape 3 : Commit**

```bash
git add src/components/OrdersView.tsx
git commit -m "feat(orders): add OrdersView admin component"
```

---

### Task 6 : App.tsx — route orders

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `<OrdersView />` de `src/components/OrdersView.tsx` (Task 5)

- [ ] **Étape 1 : Ajouter l'import**

```typescript
import { OrdersView } from './components/OrdersView';
```

- [ ] **Étape 2 : Ajouter la route dans le switch des onglets**

Après `{adminTab === 'dashboard' && (...)}`, ajouter :
```typescript
{adminTab === 'orders' && <OrdersView />}
```

- [ ] **Étape 3 : Lint**

```bash
npm run lint
```

- [ ] **Étape 4 : Commit**

```bash
git add src/App.tsx
git commit -m "feat(orders): wire OrdersView in App.tsx router"
```

---

### Task 7 : OrderForm — modale commande sur le storefront

**Files:**
- Create: `src/components/OrderForm.tsx`
- Modify: `src/components/PublicStorefront.tsx`

**Interfaces:**
- Consumes: `addOrder` de `src/services/store` (Task 2)
- Consumes: `Product` de `src/types`
- Consumes: `settings.currency` de `useStore`

- [ ] **Étape 1 : Créer `src/components/OrderForm.tsx`**

```typescript
import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { addOrder } from '../services/store';
import { Product } from '../types';

interface OrderFormProps {
  product: Product;
  currency: string;
  onClose: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ product, currency, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const unitPrice = product.promoPrice ?? product.price;
  const total = unitPrice * quantity;
  const maxQty = Math.min(product.stockQuantity, 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = addOrder({
      customer: { name, phone, city, address },
      items: [{
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity,
        unitPrice,
      }],
      total,
      status: 'EN_ATTENTE',
      notes: notes || undefined,
    });
    setOrderNumber(order.orderNumber);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">Passer une commande</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {submitted ? (
          /* Success State */
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Commande reçue !</h3>
            <p className="text-slate-400 text-sm">
              Votre commande <span className="text-amber-400 font-mono font-bold">{orderNumber}</span> a bien été enregistrée. Nous vous contacterons sous peu.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
            >
              Fermer
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Product Summary */}
            <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-3">
              <img src={product.mainImage} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                <p className="text-amber-400 text-xs font-bold">{unitPrice} {currency}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-bold transition"
                >−</button>
                <span className="text-white font-bold w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-bold transition"
                >+</button>
              </div>
            </div>

            {/* Customer Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Nom complet *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Téléphone *</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 XX XX XX XX"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Ville *</label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Casablanca"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Adresse *</label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rue, quartier..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Notes (optionnel)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Taille, couleur, instructions de livraison..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Total + Submit */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs text-slate-400">Total</p>
                <p className="text-xl font-bold text-amber-400">{total.toFixed(2)} {currency}</p>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
              >
                Confirmer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Étape 2 : Modifier `PublicStorefront.tsx` — ajouter l'import et l'état**

En haut du fichier, ajouter :
```typescript
import { OrderForm } from './OrderForm';
```

Dans le composant, après `const [showWhatsappModal, setShowWhatsappModal] = useState<boolean>(false);` :
```typescript
const [orderProduct, setOrderProduct] = useState<Product | null>(null);
```

- [ ] **Étape 3 : Ajouter le bouton "Commander" sur les cartes produits**

Trouver le bloc bouton WhatsApp sur les cartes produits (le `<button onClick={() => handleOpenWhatsapp(product)}>` ou similaire) et ajouter juste avant :

```typescript
<button
  onClick={(e) => { e.stopPropagation(); setOrderProduct(product); }}
  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
>
  <ShoppingBag className="w-3.5 h-3.5" />
  Commander
</button>
```

- [ ] **Étape 4 : Monter la modale OrderForm en bas du return**

Juste avant le `</div>` final du composant `PublicStorefront` :
```typescript
{orderProduct && (
  <OrderForm
    product={orderProduct}
    currency={settings.currency}
    onClose={() => setOrderProduct(null)}
  />
)}
```

- [ ] **Étape 5 : Ajouter ShoppingBag à l'import lucide dans PublicStorefront.tsx**

S'assurer que `ShoppingBag` est dans l'import lucide-react en haut du fichier.

- [ ] **Étape 6 : Lint**

```bash
npm run lint
```

- [ ] **Étape 7 : Commit**

```bash
git add src/components/OrderForm.tsx src/components/PublicStorefront.tsx
git commit -m "feat(orders): add OrderForm modal on storefront product cards"
```

---

### Task 8 : Push final

- [ ] **Étape 1 : Push vers GitHub**

```bash
git push origin main
```

Vercel déclenche le déploiement automatiquement.
