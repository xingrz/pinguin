export const PORT = parseInt(process.env.PORT || '3000');

export const ENV = process.env.NODE_ENV || 'development';
export const IS_DEV = ENV === 'development';
export const IS_PROD = ENV === 'production';

export const CONFIG_FILE = process.env.CONFIG_FILE || '/etc/pinguin/pinguin.yaml';
