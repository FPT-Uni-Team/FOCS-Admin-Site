const endpoints = {
  promotion: {
    get: (storeId: string) => `/admin/promotion/${storeId}`,
  },
};

export default endpoints;
