export interface NotificationConfig {
  title?: string;
  ignoreSuccess?: boolean;
  ignoreError?: boolean;
  type?: 'TOAST' | 'MODAL';
  content?: string;
  errorMessage?: string;
}

export interface SessionInfo {
  accessToken?: string;
  refeshToken?: string;
  userInfo?: UserInfo;
  isAuthenticated?: boolean;
  loading?: boolean;
  isFirstLogin?: boolean;
}

export type UserInfo = Partial<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
  role: string;
  userStatus: string;
  phoneNumber: string;
  image: string | null;
  address: string | null;
  province: string | null;
  commune: string | null;
  notification: boolean;
  receiveEmailAds: boolean;
  hasPassword: boolean;
  isRegisteredWithGoogle: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}>;
