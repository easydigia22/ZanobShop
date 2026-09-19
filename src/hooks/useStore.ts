import { useState, useEffect } from 'react';
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

export function useStore() {
  const [products, setProducts] = useState(getProducts());
  const [categories, setCategories] = useState(getCategories());
  const [movements, setMovements] = useState(getInventoryMovements());
  const [posts, setPosts] = useState(getSocialPosts());
  const [accounts, setAccounts] = useState(getSocialAccounts());
  const [settings, setSettings] = useState(getSettings());
  const [user, setUser] = useState(getCurrentUser());
  const [orders, setOrders] = useState<Order[]>(getOrders());

  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setProducts(getProducts());
      setCategories(getCategories());
      setMovements(getInventoryMovements());
      setPosts(getSocialPosts());
      setAccounts(getSocialAccounts());
      setSettings(getSettings());
      setUser(getCurrentUser());
      setOrders(getOrders());
    });
    return unsubscribe;
  }, []);

  // Calculate derived low stock & out of stock alerts
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0
  );
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0);
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.stockQuantity,
    0
  );
  const pendingOrdersCount = orders.filter((o) => o.status === 'EN_ATTENTE').length;

  return {
    products,
    categories,
    movements,
    posts,
    accounts,
    settings,
    user,
    lowStockProducts,
    outOfStockProducts,
    totalInventoryValue,
    orders,
    pendingOrdersCount,
  };
}
