export class ApiEndpoints {

  static BASE_URL = 'https://khieng.online/api';
  // static BASE_URL = 'https://test.khieng.online/api';
  // static BASE_URL = 'https://dev.khieng.online/api';

  static readonly AUTH = {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY_TOKEN: '/protected',
  };

  static readonly USER = {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  };

  static readonly CATEGORY = {
    LIST: '/category',
    UPDATE: '/category',
    DELETE: '/category',
    CREATE: '/category',
  };


  static readonly PRODUCT = {
    LIST: '/item',
    UPDATE: '/item',
    DELETE: '/item',
    CREATE: '/item',
  };

  static readonly ORDER = {
    LIST: '/orders',
    UPDATE: '/orders',
    DELETE: '/orders',
    CREATE: '/orders',
  };

  static readonly PROFILE = {
    UPDATE: '/file/updateProfile',
  };

  static readonly DASHBOARD = {
    CATEGORY: '/dashboard/categories',
    LOW_STOCK: '/dashboard/low-stock',
    SUMMARY: '/dashboard/summary',
  };
}

export class KKey {
  static USER = 'user';
  static ACCESS_TOKEN = 'accessToken';
  static REFRESH_TOKEN = 'refreshToken';
  static TOKEN_EXPRIATION = 'tokenExpiration';
  static SUMMARY = 'summary';
  static ORDER = 'orders';
  static CATEGORY = 'categories';
  static PRODUCT = 'products';
}