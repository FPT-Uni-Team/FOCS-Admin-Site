const endpoints = {
  promotion: {
    get: (storeId: string) => `/admin/promotion/${storeId}`,
    post: () => `/admin/promotion/`,
  },
  menuItem: {
    get: (storeId: string) => `/admin/menu-items?storeId=${storeId}`,
  },
  auth: {
    login: () => "/me/login",
    refresh: () => "/me/refresh-token",
  },
  coupon: {
    list: () => `/admin/coupons`,
    detail: (id: string) => `/admin/coupon/${id}`,
  },
};

export default endpoints;
