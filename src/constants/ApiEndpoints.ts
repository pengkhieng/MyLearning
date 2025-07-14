export class ApiEndpoints {
    static readonly AUTH = {
      LOGIN:          '/auth/login',
      REFRESH:        '/auth/refresh',
      LOGOUT:         '/auth/logout',
      VERIFY_TOKEN:   '/protected',
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
    
  }