export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  DOCUMENTS: '/documents',
  SIGNATURES: '/signatures',
  ADMIN: '/admin',
  USERS: '/users',
  DEMO: '/demo',
  NOT_FOUND: '*',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  REFRESH_TOKEN: 'refresh_token',
  THEME: 'theme',
  LANGUAGE: 'language',
};

export const QUERY_KEYS = {
  USERS: 'users',
  PROFILE: 'profile',
};

export const LOCALES = {
  EN: 'en',
  VI: 'vi',
};

export type Role = 'admin' | 'user' | 'guest';
