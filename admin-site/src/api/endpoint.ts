const endpoints = {
  promotion: {
    list: () => `/admin/promotion/list`,
    create: () => `/admin/promotion`,
    detail: (params: string) => `/admin/promotion/${params}`,
    update: (params: string) => `/admin/promotion/${params}`,
    change: (action: string, id: string) => `admin/promotion/${action}/${id}`,
  },
  menuItem: {
    list: (storeId: string) => `/admin/menu-items?storeId=${storeId}`,
    listByIds: () => "/admin/menu-item-list",
  },
  auth: {
    login: () => "/me/login",
    refresh: () => "/me/refresh-token",
  },
  coupon: {
    listValid: () => "/admin/coupons/available",
    listByIds: () => "admin/coupons/by-ids",
    list: (storeId: string) => `/admin/coupons/${storeId}`,
    detail: (id: string) => `/admin/coupon/${id}`,
    create: () => `/admin/coupon`,
    update: (id: string) => `/admin/coupon/${id}`,
    delete: (id: string) => `/admin/coupon/${id}`,
    trackUsage: (id: string) => `/admin/coupon/${id}/track-usage`,
    setStatus: (id: string) => `/admin/coupon/${id}/status`,
    assignPromotion: (storeId: string) =>
      `/admin/coupon/${storeId}/assign-promotion`,
  },
};

export default endpoints;
