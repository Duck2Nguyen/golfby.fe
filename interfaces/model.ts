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
  firstName?: string;
  lastName?: string;
  isRegisteredWithGoogle: boolean;
  createdAt: string;
  trialEndDate?: string;
  lastLogin?: string;
}>;
