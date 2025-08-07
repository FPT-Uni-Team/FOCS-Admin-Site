const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const endpoints = {
  promotion: {
    list: () => `${API_BASE_URL}/admin/promotion/list`,
    create: () => `${API_BASE_URL}/admin/promotion`,
    detail: (params: string) => `${API_BASE_URL}/admin/promotion/${params}`,
    update: (params: string) => `${API_BASE_URL}/admin/promotion/${params}`,
    delete: (id: string) => `${API_BASE_URL}/admin/promotion/${id}`,
    change: (action: string, id: string) =>
      `${API_BASE_URL}/admin/promotion/${action}/${id}`,
  },
  menuItem: {
    list: () => `${API_BASE_URL}/admin/menu-item/list`,
    listByIds: () => `${API_BASE_URL}/admin/menu-item/bulk`,
    create: () => `${API_BASE_URL}/admin/menu-item`,
    detail: (params: string) => `${API_BASE_URL}/admin/menu-item/${params}`,
    update: (params: string) => `${API_BASE_URL}/admin/menu-item/${params}`,
    delete: (id: string) => `${API_BASE_URL}/admin/menu-item/${id}`,
    images: (params: string) =>
      `${API_BASE_URL}/admin/menu-item/${params}/images`,
    variantGroups: (params: string) =>
      `${API_BASE_URL}/admin/menu-item/${params}/variant-groups`,
    createVariantGroups: (params: string) =>
      `${API_BASE_URL}/admin/menu-item/${params}/variant-group/variants`,
    menuItemCategory: (params: string) =>
      `${API_BASE_URL}/menu-item-category/menu-item/${params}/categories`,
    menuItemAssignCategory: (params: string) =>
      `${API_BASE_URL}/menu-item-category/assign-to-menu-item/${params}`,
    menuItemDeleteCategory: () =>
      `${API_BASE_URL}/menu-item-category/remove-from-product`,
    menuItemDeleteGroupVariant: (params: string) =>
      `${API_BASE_URL}/admin/menu-item/${params}/variant-groups`,
    menuItemDeleteVariant: (params: string) =>
      `${API_BASE_URL}/admin/menu-item/${params}/product-variants`,
    change: (action: string, id: string) =>
      `${API_BASE_URL}/admin/menu-item/${action}/${id}`,
  },
  auth: {
    login: () => `${API_BASE_URL}/me/login`,
    refresh: () => `${API_BASE_URL}/me/refresh-token`,
  },
  coupon: {
    listValid: (promotionId?: string) => {
      const baseUrl = `${API_BASE_URL}/admin/coupons/available`;
      return promotionId ? `${baseUrl}/${promotionId}` : baseUrl;
    },
    listByIds: () => `${API_BASE_URL}/admin/coupons/by-ids`,
    list: (storeId: string) => `${API_BASE_URL}/admin/coupons/${storeId}`,
    detail: (id: string) => `${API_BASE_URL}/admin/coupon/${id}`,
    create: () => `${API_BASE_URL}/admin/coupon`,
    update: (id: string) => `${API_BASE_URL}/admin/coupon/${id}`,
    delete: (id: string) => `${API_BASE_URL}/admin/coupon/${id}`,
    trackUsage: (id: string) =>
      `${API_BASE_URL}/admin/coupon/${id}/track-usage`,
    setStatus: (id: string) => `${API_BASE_URL}/admin/coupon/${id}/status`,
    assignPromotion: (storeId: string) =>
      `${API_BASE_URL}/admin/coupon/${storeId}/assign-promotion`,
  },
  category: {
    list: () => `${API_BASE_URL}/Category/categories`,
    create: () => `${API_BASE_URL}/Category`,
    detail: (params: string) => `${API_BASE_URL}/Category/${params}`,
    update: (param: string) => `${API_BASE_URL}/Category/${param}`,
    delete: (id: string) => `${API_BASE_URL}/menu-item-category/${id}/category`,
    change: (action: string, id: string) =>
      `${API_BASE_URL}/Category/${action}/${id}`,
  },
  variantGroup: {
    list: () => `${API_BASE_URL}/admin/variant-group/variants`,
    create: () => `${API_BASE_URL}/admin/variant-group`,
    detail: (id: string) => `${API_BASE_URL}/admin/variant-group/${id}`,
    update: (id: string) => `${API_BASE_URL}/admin/variant-group/${id}`,
    delete: (id: string) => `${API_BASE_URL}/admin/variant-group/${id}`,
    assignVariants: () => `${API_BASE_URL}/admin/menu-item-variant/assign-to-variant-group`,
  },
  variant: {
    list: () => `${API_BASE_URL}/admin/menu-item-variant/list`,
    create: () => `${API_BASE_URL}/admin/menu-item-variant`,
    detail: (id: string) => `${API_BASE_URL}/admin/menu-item-variant/${id}`,
    update: (id: string) => `${API_BASE_URL}/admin/menu-item-variant/${id}`,
    delete: (id: string) => `${API_BASE_URL}/admin/menu-item-variant/${id}`,
  },
  image: {
    upload: () => `${API_BASE_URL}/admin/menu-item/sync-images`,
  },
  staff: {
    list: () => `${API_BASE_URL}/staff/list`,
    create: () => `${API_BASE_URL}/staff`,
    detail: (id: string) => `${API_BASE_URL}/staff/${id}`,
    update: (id: string) => `${API_BASE_URL}/staff/${id}`,
    delete: (id: string) => `${API_BASE_URL}/staff/${id}`,
  },
  table: {
    list: () => `${API_BASE_URL}/manager/tables`,
    detail: (id: string) => `${API_BASE_URL}/manager/table/${id}`,
    create: () => `${API_BASE_URL}/manager/table`,
    update: (id: string) => `${API_BASE_URL}/manager/table/${id}`,
    delete: (id: string) => `${API_BASE_URL}/manager/table/${id}`,
    generateQR: () => `${API_BASE_URL}/manager/table/qrcode`,
    changeStatus: (tableId: string, storeId: string) => 
      `${API_BASE_URL}/manager/table/status?tableId=${tableId}&storeId=${storeId}`,
  },
  order: {
    list: () => `${API_BASE_URL}/cashier/orders`,
    detail: (orderCode: string) => `${API_BASE_URL}/order/order-by-code/${orderCode}`,
  },
  feedback: {
    list: () => `${API_BASE_URL}/feedback/list`,
    detail: (id: string) => `${API_BASE_URL}/feedback/${id}`,
    update: (id: string) => `${API_BASE_URL}/feedback/${id}`,
  },
};

export default endpoints;
