// Map and safe-get VITE_* environment variables
type Env = {
  VITE_API_URL: string;
  VITE_APP_NAME: string;
  VITE_USE_MSW: string;
  VITE_USE_REDUX_DEVTOOLS: string;
  VITE_I18N_DEFAULT_LANG: string;
  VITE_IS_DEV: string;
  VITE_IS_PROD: string;
  [key: string]: string;
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  const value = import.meta.env[key];
  if (!value && key === 'VITE_API_URL') {
    console.error(`[ENV] Missing required environment variable: ${key}`);
    console.error('[ENV] Please create .env file with VITE_API_URL');
  }
  return value || defaultValue;
};

export const env: Env = {
  VITE_API_URL: getEnvVar('VITE_API_URL'),
  VITE_APP_NAME: getEnvVar('VITE_APP_NAME', 'Digital Signature'),
  VITE_USE_MSW: getEnvVar('VITE_USE_MSW', 'false'),
  VITE_USE_REDUX_DEVTOOLS: getEnvVar('VITE_USE_REDUX_DEVTOOLS', 'false'),
  VITE_I18N_DEFAULT_LANG: getEnvVar('VITE_I18N_DEFAULT_LANG', 'en'),
  VITE_IS_DEV: getEnvVar('VITE_IS_DEV', 'true'),
  VITE_IS_PROD: getEnvVar('VITE_IS_PROD', 'false'),
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'React Boilerplate',
  VITE_USE_MSW: import.meta.env.VITE_USE_MSW || 'true',
  VITE_USE_REDUX_DEVTOOLS: import.meta.env.VITE_USE_REDUX_DEVTOOLS || 'false',
  VITE_I18N_DEFAULT_LANG: import.meta.env.VITE_I18N_DEFAULT_LANG || 'en',
  VITE_IS_DEV: import.meta.env.VITE_IS_DEV || 'true',
  VITE_IS_PROD: import.meta.env.VITE_IS_PROD || 'false',
};

if (!env.VITE_API_URL) {
  console.warn('[ENV] VITE_API_URL is not set. API calls may fail.');
}
