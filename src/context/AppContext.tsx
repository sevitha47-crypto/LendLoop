import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ItemListing,
  UserProfile,
  BorrowTransaction,
  NeedRequest,
  ChatMessage,
  AppNotification,
  Review,
  AdminAuditLog,
  TransactionStatus
} from '../types';
import {
  MOCK_USERS,
  INITIAL_LISTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_NEED_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS
} from '../data/mockData';
import { calculateSettlement } from '../utils/settlementCalculator';
import { getActiveSession, saveActiveSession } from '../utils/auth';

interface AppContextType {
  // User & Roles
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;

  // Items
  listings: ItemListing[];
  selectedItem: ItemListing | null;
  setSelectedItem: (item: ItemListing | null) => void;
  addListing: (listing: Omit<ItemListing, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerRating' | 'ownerTrustScore'>) => void;
  updateListing: (id: string, updates: Partial<ItemListing>) => void;
  toggleListingStatus: (id: string) => void;

  // Transactions
  transactions: BorrowTransaction[];
  selectedTransaction: BorrowTransaction | null;
  setSelectedTransaction: (tx: BorrowTransaction | null) => void;
  createBorrowRequest: (listingId: string, startDate: string, endDate: string, durationDays: number) => BorrowTransaction;
  approveBorrowRequest: (txId: string) => void;
  rejectBorrowRequest: (txId: string) => void;
  processDepositPayment: (txId: string, utrOrRef?: string) => Promise<boolean>;
  verifyHandover: (txId: string, otp: string, notes: string, photos: string[]) => boolean;
  initiateReturn: (txId: string) => void;
  verifyReturnInspection: (txId: string, otp: string, damageDeduction: number, notes: string, photos: string[], damageDescription?: string) => boolean;
  settleTransactionRefund: (txId: string) => void;
  submitDispute: (txId: string, reason: string, evidencePhotos: string[]) => void;
  resolveDisputeByAdmin: (txId: string, approvedDeduction: number, resolutionNote: string) => void;

  // LendLoop Match
  needRequests: NeedRequest[];
  addNeedRequest: (req: Omit<NeedRequest, 'id' | 'createdAt' | 'userId' | 'userName' | 'userAvatar' | 'status'>) => void;

  // Messages
  messages: ChatMessage[];
  sendChatMessage: (txId: string, text: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;

  // Reviews
  reviews: Review[];
  submitReview: (txId: string, targetUserId: string, rating: number, comment: string, onTime: boolean) => void;

  // Admin Logs
  auditLogs: AdminAuditLog[];
  logAdminAction: (action: string, targetType: AdminAuditLog['targetType'], targetId: string, reason: string) => void;

  // App Modes & Navigation
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  viewportMode: 'mobile-frame' | 'responsive-web';
  setViewportMode: (val: 'mobile-frame' | 'responsive-web') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Search & Filters state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return getActiveSession() || null;
  });
  const [listings, setListings] = useState<ItemListing[]>(INITIAL_LISTINGS);
  const [selectedItem, setSelectedItem] = useState<ItemListing | null>(null);
  const [transactions, setTransactions] = useState<BorrowTransaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState<BorrowTransaction | null>(null);
  const [needRequests, setNeedRequests] = useState<NeedRequest[]>(INITIAL_NEED_REQUESTS);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      transactionId: 'tx_calc_demo',
      senderId: 'user_priya',
      senderName: 'Priya Patel',
      text: 'Hi Aarav, please bring a valid student ID during collection at Gate 2 Indiranagar Metro.',
      timestamp: 'Yesterday 04:12 PM',
      isRead: true
    },
    {
      id: 'msg_2',
      transactionId: 'tx_calc_demo',
      senderId: 'user_aarav',
      senderName: 'Aarav Sharma',
      text: 'Understood Priya! I will be there on time with the Handover OTP ready.',
      timestamp: 'Yesterday 04:30 PM',
      isRead: true
    }
  ]);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([
    {
      id: 'log_1',
      adminId: 'user_admin',
      adminName: 'Staff Moderator',
      action: 'CATEGORY_VERIFIED',
      targetType: 'listing',
      targetId: 'item_1',
      reason: 'Academic tool standard verified. Lender selected positive security deposit ₹80.',
      timestamp: '2026-04-10 11:00 AM'
    }
  ]);

  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [viewportMode, setViewportMode] = useState<'mobile-frame' | 'responsive-web'>('responsive-web');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Handle user login / session update
  const handleSetCurrentUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    saveActiveSession(user);
  };

  // Logout option - clears session and redirects to auth
  const logout = () => {
    saveActiveSession(null);
    setCurrentUser(null);
    setActiveTab('auth');
  };

  // Switch current active demo user
  const switchUser = (userId: string) => {
    if (MOCK_USERS[userId]) {
      setCurrentUser(MOCK_USERS[userId]);
      saveActiveSession(MOCK_USERS[userId]);
    }
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      saveActiveSession(updated);
      return updated;
    });
  };

  // Add Item Listing
  const addListing = (newListingData: Omit<ItemListing, 'id' | 'createdAt' | 'ownerId' | 'ownerName' | 'ownerRating' | 'ownerTrustScore'>) => {
    if (!currentUser) return;
    const newId = `item_${Date.now()}`;
    const newListing: ItemListing = {
      ...newListingData,
      id: newId,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerRating: 5.0,
      ownerTrustScore: currentUser.trustScore,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setListings(prev => [newListing, ...prev]);

    // Send notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'Item Listed Successfully',
      message: `Your listing "${newListing.title}" is now active with ₹${newListing.securityDeposit} refundable deposit.`,
      type: 'request',
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<ItemListing>) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const toggleListingStatus = (id: string) => {
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'active' ? 'paused' : 'active';
        return { ...item, status: nextStatus, isAvailable: nextStatus === 'active' };
      }
      return item;
    }));
  };

  // Create Borrow Request
  const createBorrowRequest = (listingId: string, startDate: string, endDate: string, durationDays: number): BorrowTransaction => {
    if (!currentUser) {
      throw new Error('User must be logged in to create a borrow request');
    }
    const item = listings.find(i => i.id === listingId);
    if (!item) throw new Error('Listing not found');

    const rentalTotal = item.rentalFeePerDay * durationDays;
    const totalPaid = item.securityDeposit + rentalTotal;
    const genHandoverOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const genReturnOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newTx: BorrowTransaction = {
      id: `tx_${Date.now()}`,
      listingId: item.id,
      listingTitle: item.title,
      listingImage: item.images[0] || '',
      borrowerId: currentUser.id,
      borrowerName: currentUser.name,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      startDate,
      endDate,
      durationDays,
      securityDeposit: item.securityDeposit,
      rentalFee: rentalTotal,
      totalPaid,
      status: 'DEPOSIT_PENDING',
      handoverOtp: genHandoverOtp,
      returnOtp: genReturnOtp,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString()
    };

    setTransactions(prev => [newTx, ...prev]);
    setSelectedTransaction(newTx);

    // Notify lender
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: item.ownerId,
        title: 'New Borrow Request Received',
        message: `${currentUser.name} requested to borrow "${item.title}" for ${durationDays} days.`,
        type: 'request',
        transactionId: newTx.id,
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);

    return newTx;
  };

  const approveBorrowRequest = (txId: string) => {
    setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'DEPOSIT_PENDING', updatedAt: new Date().toLocaleString() } : tx));
  };

  const rejectBorrowRequest = (txId: string) => {
    setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'REJECTED', updatedAt: new Date().toLocaleString() } : tx));
  };

  // Process Deposit Payment
  const processDepositPayment = async (txId: string, utrOrRef = 'RZP_DEMO_UPI_OK'): Promise<boolean> => {
    // In demo mode or simulated gateway, record successful deposit confirmation
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        return {
          ...tx,
          status: 'HANDOVER_PENDING',
          updatedAt: new Date().toLocaleString()
        };
      }
      return tx;
    }));

    // Add confirmation notification
    if (currentUser) {
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          userId: currentUser.id,
          title: 'Deposit Payment Confirmed',
          message: `Security deposit of ₹${selectedTransaction?.securityDeposit || 80} held securely. Proceed to physical handover.`,
          type: 'deposit',
          transactionId: txId,
          timestamp: 'Just now',
          isRead: false
        },
        ...prev
      ]);
    }

    return true;
  };

  // Handover Verification
  const verifyHandover = (txId: string, otp: string, notes: string, photos: string[]): boolean => {
    let success = false;
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        if (tx.handoverOtp === otp.trim()) {
          success = true;
          return {
            ...tx,
            status: 'ACTIVE_BORROW',
            handoverReport: {
              id: `ho_${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              photos: photos.length > 0 ? photos : [tx.listingImage],
              notes,
              accessoriesVerified: true,
              otpCode: otp,
              isVerified: true
            },
            updatedAt: new Date().toLocaleString()
          };
        }
      }
      return tx;
    }));

    return success;
  };

  // Initiate Return
  const initiateReturn = (txId: string) => {
    setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'RETURN_REQUESTED', updatedAt: new Date().toLocaleString() } : tx));
  };

  // Return Inspection Verification
  const verifyReturnInspection = (
    txId: string,
    otp: string,
    damageDeduction: number,
    notes: string,
    photos: string[],
    damageDescription?: string
  ): boolean => {
    let success = false;
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        if (tx.returnOtp === otp.trim()) {
          success = true;
          const settlementRes = calculateSettlement({
            depositInInr: tx.securityDeposit,
            approvedDamageInInr: damageDeduction
          });

          return {
            ...tx,
            status: damageDeduction > 0 ? 'RETURN_INSPECTION' : 'REFUND_PENDING',
            returnReport: {
              id: `ret_${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              photos: photos.length > 0 ? photos : [tx.listingImage],
              notes,
              accessoriesVerified: true,
              damageNoted: damageDescription,
              otpCode: otp,
              isVerified: true
            },
            settlement: {
              securityDeposit: tx.securityDeposit,
              rentalCharges: tx.rentalFee,
              approvedDamageDeduction: settlementRes.approvedDamageInInr,
              disputedAmount: 0,
              eligibleRefund: settlementRes.eligibleRefundInInr,
              status: 'pending'
            },
            updatedAt: new Date().toLocaleString()
          };
        }
      }
      return tx;
    }));

    return success;
  };

  // Settle Refund
  const settleTransactionRefund = (txId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.settlement) {
        return {
          ...tx,
          status: 'COMPLETED',
          settlement: {
            ...tx.settlement,
            status: 'settled',
            settledAt: new Date().toLocaleString(),
            paymentGatewayRef: `LL_REFUND_${Math.floor(100000 + Math.random() * 900000)}`
          },
          updatedAt: new Date().toLocaleString()
        };
      }
      return tx;
    }));

    if (currentUser) {
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          userId: currentUser.id,
          title: 'Refund Successfully Credited',
          message: 'Eligible deposit refund settled via payment provider back to original payment method.',
          type: 'refund',
          transactionId: txId,
          timestamp: 'Just now',
          isRead: false
        },
        ...prev
      ]);
    }
  };

  // Submit Dispute
  const submitDispute = (txId: string, reason: string, evidencePhotos: string[]) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        return {
          ...tx,
          status: 'DISPUTED',
          disputeReason: reason,
          disputeEvidence: evidencePhotos,
          updatedAt: new Date().toLocaleString()
        };
      }
      return tx;
    }));

    // Log admin alert
    logAdminAction('DISPUTE_RAISED', 'dispute', txId, `User opened dispute: ${reason}`);

    if (currentUser) {
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          userId: currentUser.id,
          title: 'Dispute Registered for Review',
          message: 'Dispute submitted with evidence. Both parties notified. Deposit settlement paused pending admin mediation.',
          type: 'dispute',
          transactionId: txId,
          timestamp: 'Just now',
          isRead: false
        },
        ...prev
      ]);
    }
  };

  // Resolve Dispute
  const resolveDisputeByAdmin = (txId: string, approvedDeduction: number, resolutionNote: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        const deposit = tx.securityDeposit;
        const finalDeduction = Math.min(approvedDeduction, deposit);
        const finalRefund = deposit - finalDeduction;

        return {
          ...tx,
          status: 'COMPLETED',
          disputeOutcome: resolutionNote,
          settlement: {
            securityDeposit: deposit,
            rentalCharges: tx.rentalFee,
            approvedDamageDeduction: finalDeduction,
            disputedAmount: 0,
            eligibleRefund: finalRefund,
            settledAt: new Date().toLocaleString(),
            paymentGatewayRef: `ADMIN_RESOLVED_${Date.now()}`,
            status: 'settled'
          },
          updatedAt: new Date().toLocaleString()
        };
      }
      return tx;
    }));

    logAdminAction('DISPUTE_RESOLVED', 'dispute', txId, `Arbitrated deduction ₹${approvedDeduction}. Reason: ${resolutionNote}`);
  };

  // Need Requests
  const addNeedRequest = (reqData: Omit<NeedRequest, 'id' | 'createdAt' | 'userId' | 'userName' | 'userAvatar' | 'status'>) => {
    if (!currentUser) return;
    const newReq: NeedRequest = {
      ...reqData,
      id: `need_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setNeedRequests(prev => [newReq, ...prev]);

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'LendLoop Match Active',
        message: `Your need request for "${newReq.requiredItem}" is broadcast to nearby verified lenders.`,
        type: 'request',
        timestamp: 'Just now',
        isRead: false
      },
      ...prev
    ]);
  };

  // Chat
  const sendChatMessage = (txId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      transactionId: txId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: 'Just now',
      isRead: false
    };
    setMessages(prev => [...prev, newMsg]);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadNotificationsCount = currentUser
    ? notifications.filter(n => !n.isRead && n.userId === currentUser.id).length
    : 0;

  // Reviews
  const submitReview = (txId: string, targetUserId: string, rating: number, comment: string, onTime: boolean) => {
    if (!currentUser) return;
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      transactionId: txId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      targetUserId,
      rating,
      comment,
      onTimeReturn: onTime,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);
  };

  // Audit Logs
  const logAdminAction = (action: string, targetType: AdminAuditLog['targetType'], targetId: string, reason: string) => {
    if (!currentUser) return;
    const log: AdminAuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action,
      targetType,
      targetId,
      reason,
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        logout,
        switchUser,
        updateCurrentUserProfile,
        listings,
        selectedItem,
        setSelectedItem,
        addListing,
        updateListing,
        toggleListingStatus,
        transactions,
        selectedTransaction,
        setSelectedTransaction,
        createBorrowRequest,
        approveBorrowRequest,
        rejectBorrowRequest,
        processDepositPayment,
        verifyHandover,
        initiateReturn,
        verifyReturnInspection,
        settleTransactionRefund,
        submitDispute,
        resolveDisputeByAdmin,
        needRequests,
        addNeedRequest,
        messages,
        sendChatMessage,
        notifications,
        markNotificationAsRead,
        unreadNotificationsCount,
        reviews,
        submitReview,
        auditLogs,
        logAdminAction,
        isDemoMode,
        setIsDemoMode,
        viewportMode,
        setViewportMode,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
