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
    list: (storeId: string) => `/admin/coupons/${storeId}`,
    detail: (id: string) => `/admin/coupon/${id}`,
    create: () => `/admin/coupon`,
    update: (id: string) => `/admin/coupon/${id}`,
    delete: (id: string) => `/admin/coupon/${id}`,
    trackUsage: (id: string) => `/admin/coupon/${id}/track-usage`,
    setStatus: (id: string) => `/admin/coupon/${id}/status`,
    assignPromotion: (storeId: string) => `/admin/coupon/${storeId}/assign-promotion`,
  },
};

export default endpoints;
