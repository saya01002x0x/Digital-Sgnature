export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  USERS: '/users',
  NOT_FOUND: '*',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
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
