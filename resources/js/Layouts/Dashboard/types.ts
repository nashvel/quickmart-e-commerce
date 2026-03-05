import { ReactNode } from 'react';

export type UserRole = 'seller' | 'admin' | 'rider';

export interface MenuItem {
  path: string;
  icon: ReactNode;
  label: string;
  children?: MenuItem[];
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  data: any;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
