const endpoints = {
  promotion: {
    list: () => `/admin/promotion/list`,
    create: () => `/admin/promotion`,
    detail: (params: string) => `/admin/promotion/${params}`,
    update: (params: string) => `/admin/promotion/${params}`,
    change: (action: string, id: string) => `admin/promotion/${action}/${id}`,
  },
  menuItem: {
    list: () => `/admin/menu-item/list`,
    listByIds: () => "/admin/menu-item-list",
    create: () => `/admin/menu-item`,
    detail: (params: string) => `/admin/menu-item/${params}`,
    update: (params: string) => `/admin/menu-item/${params}`,
    images: (params: string) => `/admin/menu-item/${params}/images`,
    variantGroups: (params: string) =>
      `/admin/menu-item/${params}/variant-groups`,
    createVariantGroups: (params: string) =>
      `/admin/menu-item/${params}/variant-group/variants`,
    menuItemCategory: (params: string) =>
      `/menu-item-category/menu-item/${params}/categories`,
    menuItemAssignCategory: (params: string) =>
      `/menu-item-category/assign-to-menu-item/${params}`,
    menuItemDeleteCategory: () => `/menu-item-category/remove-from-product`,
    menuItemDeleteGroupVariant: (params: string) =>
      `/admin/menu-item/${params}/variant-groups`,
    menuItemDeleteVariant: (params: string) =>
      `/admin/menu-item/${params}/product-variants`,
  },
  auth: {
    login: () => "/me/login",
    refresh: () => "/me/refresh-token",
  },
  coupon: {
    listValid: () => "/admin/coupons/available",
    listByIds: () => "/admin/coupons/by-ids",
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
  category: {
    list: () => "/Category/categories",
    create: () => "/Category",
    detail: (params: string) => `/Category/${params}`,
    update: (param: string) => `Category/${param}`,
    change: (action: string, id: string) => `/Category/${action}/${id}`,
  },
  variant: {
    list: () => "/admin/variant-group/variants",
  },
  image: {
    upload: () => "/admin/menu-item/sync-images",
  },
  staff: {
    list: () => `/staff/list`,
  },
};

export default endpoints;
