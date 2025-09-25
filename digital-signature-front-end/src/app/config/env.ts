// Map and safe-get VITE_* environment variables
interface Env {
  VITE_API_URL: string;
  VITE_APP_NAME: string;
  VITE_USE_MSW: string;
  VITE_USE_REDUX_DEVTOOLS: string;
  VITE_I18N_DEFAULT_LANG: string;
  VITE_IS_DEV: string;
  VITE_IS_PROD: string;
  [key: string]: string;
}

// Get environment variables with defaults
export const env: Env = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'React Boilerplate',
  VITE_USE_MSW: import.meta.env.VITE_USE_MSW || 'false',
  VITE_USE_REDUX_DEVTOOLS: import.meta.env.VITE_USE_REDUX_DEVTOOLS || 'false',
  VITE_I18N_DEFAULT_LANG: import.meta.env.VITE_I18N_DEFAULT_LANG || 'en',
  VITE_IS_DEV: import.meta.env.VITE_IS_DEV || 'true',
  VITE_IS_PROD: import.meta.env.VITE_IS_PROD || 'false',
};
