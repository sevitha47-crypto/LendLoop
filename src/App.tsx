import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { TopNavigation } from './components/common/TopNavigation';
import { DeviceFrame } from './components/common/DeviceFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { ItemDetailsScreen } from './components/screens/ItemDetailsScreen';
import { DepositCheckoutModal } from './components/screens/DepositCheckoutModal';
import { TransactionDetailScreen } from './components/screens/TransactionDetailScreen';
import { LendLoopMatchScreen } from './components/screens/LendLoopMatchScreen';
import { NearbyMapScreen } from './components/screens/NearbyMapScreen';
import { AddItemScreen } from './components/screens/AddItemScreen';
import { ActivityHubScreen } from './components/screens/ActivityHubScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { FlutterArchitectureScreen } from './components/screens/FlutterArchitectureScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { ItemListing, BorrowTransaction } from './types';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    selectedItem,
    setSelectedItem,
    selectedTransaction,
    setSelectedTransaction,
    viewportMode
  } = useApp();

  const [checkoutItem, setCheckoutItem] = useState<ItemListing | null>(null);
  const [activeChatTxId, setActiveChatTxId] = useState<string | null>(null);

  const handleOpenChat = (txId: string) => {
    setActiveChatTxId(txId);
  };

  const handleCloseChat = () => {
    setActiveChatTxId(null);
  };

  return (
    <DeviceFrame>
      {/* Top Header Navigation */}
      <TopNavigation />

      {/* Main Screen Routed Content */}
      <div className={viewportMode === 'mobile-frame' ? "p-3 pb-24" : "p-4 sm:p-6 lg:p-8"}>
        {!currentUser || activeTab === 'auth' ? (
          <AuthScreen />
        ) : activeChatTxId ? (
          <ChatScreen
            transactionId={activeChatTxId}
            onBack={handleCloseChat}
          />
        ) : selectedTransaction ? (
          <TransactionDetailScreen
            transaction={selectedTransaction}
            onBack={() => setSelectedTransaction(null)}
            onOpenChat={handleOpenChat}
          />
        ) : (
          <>
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'search' && <SearchScreen />}
            {activeTab === 'match' && <LendLoopMatchScreen />}
            {activeTab === 'map' && <NearbyMapScreen />}
            {activeTab === 'list' && <AddItemScreen />}
            {activeTab === 'activity' && (
              <ActivityHubScreen
                onSelectTransaction={tx => setSelectedTransaction(tx)}
                onOpenChat={handleOpenChat}
              />
            )}
            {activeTab === 'admin' && <AdminDashboardScreen />}
            {activeTab === 'flutter-code' && <FlutterArchitectureScreen />}
          </>
        )}
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <ItemDetailsScreen
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRequestBorrow={item => {
            setSelectedItem(null);
            setCheckoutItem(item);
          }}
        />
      )}

      {/* Security Deposit Checkout Modal */}
      {checkoutItem && (
        <DepositCheckoutModal
          item={checkoutItem}
          onClose={() => setCheckoutItem(null)}
          onSuccess={newTx => {
            setCheckoutItem(null);
            setSelectedTransaction(newTx);
          }}
        />
      )}
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
