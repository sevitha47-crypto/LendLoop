import { UserProfile } from '../types';
import { MOCK_USERS } from '../data/mockData';

export interface StoredUserCredential {
  id: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
}

const STORAGE_KEY = 'lendloop_registered_users_v2';
const SESSION_KEY = 'lendloop_active_user_id_v2';

/**
 * Hashes a plain-text password using Web Crypto API SHA-256 with salt.
 * Ensures passwords are NEVER stored in plain text.
 */
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${password}:lendloop_salt_hash_2026`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Initializes and retrieves stored users from localStorage.
 * Pre-seeds initial mock users with secure password hashes.
 */
export async function getRegisteredUsers(): Promise<StoredUserCredential[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored users:', e);
  }

  // Pre-seed mock users with hashed default passwords
  const defaultPasswordHash = await hashPassword('Password123');
  const adminPasswordHash = await hashPassword('Admin123');

  const initialList: StoredUserCredential[] = [
    {
      id: MOCK_USERS['user_aarav'].id,
      email: MOCK_USERS['user_aarav'].email.toLowerCase(),
      passwordHash: defaultPasswordHash,
      profile: MOCK_USERS['user_aarav']
    },
    {
      id: MOCK_USERS['user_priya'].id,
      email: MOCK_USERS['user_priya'].email.toLowerCase(),
      passwordHash: defaultPasswordHash,
      profile: MOCK_USERS['user_priya']
    },
    {
      id: MOCK_USERS['user_vikram'].id,
      email: MOCK_USERS['user_vikram'].email.toLowerCase(),
      passwordHash: defaultPasswordHash,
      profile: MOCK_USERS['user_vikram']
    },
    {
      id: MOCK_USERS['user_admin'].id,
      email: MOCK_USERS['user_admin'].email.toLowerCase(),
      passwordHash: adminPasswordHash,
      profile: MOCK_USERS['user_admin']
    }
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialList));
  } catch (e) {
    console.error('Failed to save initial users:', e);
  }

  return initialList;
}

/**
 * Registers a new user account.
 * Validates fields, checks for duplicate email, hashes password, and persists user.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password) {
    return { success: false, error: 'Please fill in all fields (Name, Email, and Password).' };
  }

  if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const users = await getRegisteredUsers();
  const duplicate = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (duplicate) {
    return {
      success: false,
      error: 'An account with this email already exists. Please log in instead.'
    };
  }

  const passwordHash = await hashPassword(password);
  const newId = `user_${Date.now()}`;

  const newProfile: UserProfile = {
    id: newId,
    name: cleanName,
    email: cleanEmail,
    phone: '',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
    role: 'borrower',
    trustScore: 90,
    successfulTransactions: 0,
    onTimeReturnRate: 100,
    preferredLocation: 'Bengaluru',
    verifiedIdentity: true,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  };

  const newRecord: StoredUserCredential = {
    id: newId,
    email: cleanEmail,
    passwordHash,
    profile: newProfile
  };

  users.push(newRecord);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    saveActiveSession(newProfile);
  } catch (e) {
    console.error('Failed to persist registered user:', e);
  }

  return { success: true, user: newProfile };
}

/**
 * Authenticates an existing user via Email & Password.
 * Compares hashed input password against stored hash.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  const users = await getRegisteredUsers();
  const userRecord = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!userRecord) {
    return {
      success: false,
      error: 'Invalid email or password. Please check your credentials.'
    };
  }

  const inputHash = await hashPassword(password);
  if (inputHash !== userRecord.passwordHash) {
    return {
      success: false,
      error: 'Invalid email or password. Please check your credentials.'
    };
  }

  saveActiveSession(userRecord.profile);
  return { success: true, user: userRecord.profile };
}

/**
 * Saves or clears the active session in localStorage.
 */
export function saveActiveSession(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to update session:', e);
  }
}

/**
 * Retrieves the currently active user session from localStorage.
 */
export function getActiveSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw) as UserProfile;
    }
  } catch (e) {
    console.error('Failed to get active session:', e);
  }
  return null;
}
