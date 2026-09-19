import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initFromSupabase } from './services/supabaseSync';

const STORAGE_KEYS = {
  PRODUCTS: 'smart_boutique_products_v1',
  CATEGORIES: 'smart_boutique_categories_v1',
  MOVEMENTS: 'smart_boutique_movements_v1',
  POSTS: 'smart_boutique_posts_v1',
  ACCOUNTS: 'smart_boutique_accounts_v1',
  SETTINGS: 'smart_boutique_settings_v1',
  CURRENT_USER: 'smart_boutique_user_v1',
};

async function bootstrap() {
  const data = await initFromSupabase();

  if (data) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(data.movements));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(data.posts));
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(data.accounts));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
