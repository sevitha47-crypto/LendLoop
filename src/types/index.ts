export type UserRole = 'borrower' | 'lender' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  trustScore: number; // 0-100
  successfulTransactions: number;
  onTimeReturnRate: number; // 0-100%
  preferredLocation: string;
  verifiedIdentity: boolean;
  joinedDate: string;
}

export type ItemCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export interface ItemListing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerRating: number;
  ownerTrustScore: number;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  condition: ItemCondition;
  estimatedValue: number; // INR
  securityDeposit: number; // INR chosen by lender
  rentalFeePerDay: number; // INR (optional 0 if purely deposit-based)
  images: string[];
  pickupArea: string;
  coordinates: { lat: number; lng: number };
  maxDurationDays: number;
  includedAccessories: string[];
  usageInstructions: string;
  returnConditions: string;
  isAvailable: boolean;
  status: 'active' | 'paused' | 'borrowed' | 'under_review';
  createdAt: string;
}

export type TransactionStatus =
  | 'DRAFT'
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'DEPOSIT_PENDING'
  | 'DEPOSIT_CONFIRMED'
  | 'HANDOVER_PENDING'
  | 'ACTIVE_BORROW'
  | 'RETURN_REQUESTED'
  | 'RETURN_INSPECTION'
  | 'REFUND_PENDING'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED';

export interface ConditionReport {
  id: string;
  timestamp: string;
  photos: string[];
  notes: string;
  accessoriesVerified: boolean;
  damageNoted?: string;
  otpCode: string;
  isVerified: boolean;
}

export interface SettlementReceipt {
  securityDeposit: number; // INR
  rentalCharges: number; // INR
  approvedDamageDeduction: number; // INR
  disputedAmount: number; // INR
  eligibleRefund: number; // INR (deposit - approved deduction)
  settledAt?: string;
  paymentGatewayRef?: string;
  status: 'pending' | 'settled' | 'disputed';
}

export interface BorrowTransaction {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  borrowerId: string;
  borrowerName: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  securityDeposit: number; // INR
  rentalFee: number; // INR
  totalPaid: number; // INR
  status: TransactionStatus;
  handoverReport?: ConditionReport;
  returnReport?: ConditionReport;
  settlement?: SettlementReceipt;
  disputeReason?: string;
  disputeEvidence?: string[];
  disputeOutcome?: string;
  handoverOtp: string;
  returnOtp: string;
  createdAt: string;
  updatedAt: string;
}

export interface NeedRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  requiredItem: string;
  category: string;
  description: string;
  requiredStartDate: string;
  requiredEndDate: string;
  preferredLocation: string;
  maxDistanceKm: number;
  maxDepositBudget: number; // INR
  status: 'open' | 'matched' | 'fulfilled' | 'closed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  transactionId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'deposit' | 'handover' | 'return' | 'refund' | 'dispute' | 'message';
  transactionId?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Review {
  id: string;
  transactionId: string;
  reviewerId: string;
  reviewerName: string;
  targetUserId: string;
  rating: number; // 1-5
  comment: string;
  onTimeReturn: boolean;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'listing' | 'user' | 'dispute' | 'settlement';
  targetId: string;
  reason: string;
  timestamp: string;
}
