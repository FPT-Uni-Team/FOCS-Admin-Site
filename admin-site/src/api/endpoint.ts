const endpoints = {
  promotion: {
    get: (storeId: string) => `/admin/promotion/${storeId}`,
  },
  auth: {
    login: () => "/me/login",
  },
  coupon: {
    list: () => `/admin/coupons`,
    detail: (id: string) => `/admin/coupon/${id}`,
  },
};

export default endpoints;
