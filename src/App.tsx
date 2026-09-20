import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { PublicStorefront } from './components/PublicStorefront';
import { AdminLogin, isAdminAuthenticated } from './components/AdminLogin';
import { AdminSidebar } from './components/AdminSidebar';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { CategoriesView } from './components/CategoriesView';
import { InventoryView } from './components/InventoryView';
import { AiContentGeneratorView } from './components/AiContentGeneratorView';
import { SocialMediaView } from './components/SocialMediaView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { OrdersView } from './components/OrdersView';
import { Product } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(
    isAdminAuthenticated()
  );

  // Modal triggers
  const [isOpenNewProductModal, setIsOpenNewProductModal] = useState<boolean>(false);
  const [isOpenStockModal, setIsOpenStockModal] = useState<boolean>(false);
  const [aiProduct, setAiProduct] = useState<Product | null>(null);

  const handleTriggerAiForProduct = (product: Product) => {
    setAiProduct(product);
    setCurrentView('admin');
    setAdminTab('ai-content');
  };

  const handleOpenNewProductModal = () => {
    setCurrentView('admin');
    setAdminTab('products');
    setIsOpenNewProductModal(true);
  };

  const handleOpenStockModal = () => {
    setCurrentView('admin');
    setAdminTab('inventory');
    setIsOpenStockModal(true);
  };

  return (
    <div className="min-h-screen bg-ivory text-noir flex flex-col font-jost antialiased">
      <PwaInstallBanner />
      {/* Shared Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        adminTab={adminTab}
        onSelectAdminTab={setAdminTab}
      />

      {/* Main Content Area */}
      {currentView === 'public' ? (
        <PublicStorefront />
      ) : !adminAuthenticated ? (
        <AdminLogin onSuccess={() => setAdminAuthenticated(true)} />
      ) : (
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
          {/* Admin Navigation Sidebar */}
          <AdminSidebar activeTab={adminTab} onSelectTab={setAdminTab} />

          {/* Admin Tab View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {adminTab === 'orders' && <OrdersView />}

            {adminTab === 'dashboard' && (
              <DashboardView
                onSelectTab={setAdminTab}
                onOpenNewProductModal={handleOpenNewProductModal}
                onOpenStockModal={handleOpenStockModal}
              />
            )}

            {adminTab === 'products' && (
              <ProductsView
                onTriggerAiPost={handleTriggerAiForProduct}
                isOpenNewProductModal={isOpenNewProductModal}
                onCloseNewProductModal={() => setIsOpenNewProductModal(false)}
              />
            )}

            {adminTab === 'categories' && <CategoriesView />}

            {adminTab === 'inventory' && (
              <InventoryView
                isOpenModal={isOpenStockModal}
                onCloseModal={() => setIsOpenStockModal(false)}
              />
            )}

            {adminTab === 'ai-content' && (
              <AiContentGeneratorView
                initialProduct={aiProduct}
                onNavigateToCalendar={() => setAdminTab('calendar')}
              />
            )}

            {adminTab === 'social-media' && <SocialMediaView />}

            {adminTab === 'calendar' && (
              <CalendarView onNavigateToAi={() => setAdminTab('ai-content')} />
            )}

            {adminTab === 'settings' && <SettingsView />}
          </main>
        </div>
      )}
    </div>
  );
}
