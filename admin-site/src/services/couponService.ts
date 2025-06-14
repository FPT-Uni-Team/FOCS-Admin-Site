import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';
import type { CouponListParams, CouponDetailType } from '../type/coupon/coupon';

// Mock data for testing while backend is not ready
const mockCouponItems = [
  {
    id: "1",
    code: "SUMMER2023",
    description: "Giảm giá mùa hè",
    discount_type: 0, // Percentage
    value: 20,
    start_date: "2023-06-01T00:00:00.000Z",
    end_date: "2023-08-31T23:59:59.000Z",
    max_usage: 1000,
    count_used: 150,
    is_active: true,
  },
  {
    id: "2",
    code: "WELCOME50",
    description: "Chào mừng khách hàng mới",
    discount_type: 1, // Fixed amount
    value: 50000,
    start_date: "2023-01-01T00:00:00.000Z",
    end_date: "2023-12-31T23:59:59.000Z",
    max_usage: 500,
    count_used: 75,
    is_active: true,
  },
  {
    id: "3",
    code: "FREESHIP",
    description: "Miễn phí vận chuyển",
    discount_type: 2, // Free shipping
    value: 0,
    start_date: "2023-03-01T00:00:00.000Z",
    end_date: "2023-12-31T23:59:59.000Z",
    max_usage: 2000,
    count_used: 850,
    is_active: false,
  }
];

// Function to filter mock data based on search and filter params
const filterMockData = (params: CouponListParams) => {
  let filteredItems = [...mockCouponItems];

  // Handle search
  if (params.search_by && params.search_value) {
    const searchValue = params.search_value.toLowerCase();
    filteredItems = filteredItems.filter(item => {
      if (params.search_by === 'code') {
        return item.code.toLowerCase().includes(searchValue);
      }
      if (params.search_by === 'description') {
        return item.description.toLowerCase().includes(searchValue);
      }
      // Default search in both code and description
      return item.code.toLowerCase().includes(searchValue) || 
             item.description.toLowerCase().includes(searchValue);
    });
  }

  // Handle filters
  if (params.filters) {
    // Filter by discount_type
    if (params.filters.discount_type !== undefined) {
      const discountType = parseInt(params.filters.discount_type);
      filteredItems = filteredItems.filter(item => item.discount_type === discountType);
    }

    // Filter by is_active
    if (params.filters.is_active !== undefined) {
      const isActive = params.filters.is_active === 'true';
      filteredItems = filteredItems.filter(item => item.is_active === isActive);
    }

    // Filter by date range (start_date and end_date)
    if (params.filters.start_date && params.filters.end_date) {
      const filterStartDate = new Date(params.filters.start_date);
      const filterEndDate = new Date(params.filters.end_date);
      
      filteredItems = filteredItems.filter(item => {
        const itemStartDate = new Date(item.start_date);
        const itemEndDate = new Date(item.end_date);
        
        // Check if coupon period overlaps with filter period
        return itemStartDate <= filterEndDate && itemEndDate >= filterStartDate;
      });
    }
  }

  // Handle sorting
  if (params.sort_by && params.sort_order) {
    filteredItems.sort((a, b) => {
      const aValue = a[params.sort_by as keyof typeof a];
      const bValue = b[params.sort_by as keyof typeof b];

      // Handle date sorting
      if (params.sort_by === 'start_date' || params.sort_by === 'end_date') {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        return params.sort_order === 'asc' ? 
          (aDate.getTime() - bDate.getTime()) : 
          (bDate.getTime() - aDate.getTime());
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aStr = aValue.toLowerCase();
        const bStr = bValue.toLowerCase();
        return params.sort_order === 'asc' ? 
          (aStr > bStr ? 1 : -1) : 
          (aStr < bStr ? 1 : -1);
      }

      // Handle number sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return params.sort_order === 'asc' ? 
          (aValue - bValue) : 
          (bValue - aValue);
      }

      return 0;
    });
  }

  // Handle pagination
  const page = params.page || 1;
  const pageSize = params.page_size || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalCount: filteredItems.length,
    pageNumber: page,
    pageSize: pageSize,
    totalPages: Math.ceil(filteredItems.length / pageSize)
  };
};

export const getCouponList = async (params: CouponListParams) => {
  // Clean up undefined values to match API requirements
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  );
  
  // Ensure required fields are present
  const requestBody = {
    page: cleanParams.page || 1,
    page_size: cleanParams.page_size || 10,
    ...cleanParams
  };
  
  console.log('Sending coupon list request:', requestBody);
  
  try {
    return await axiosClient.post(endpoints.coupon.list(), requestBody);
  } catch (error) {
    console.warn('API not available, using mock data with filtering:', error);
    
    // Return filtered mock data when API fails
    const filteredData = filterMockData(params);
    console.log('Filtered mock data result:', filteredData);
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(filteredData), 1000); // Simulate network delay
    });
  }
};

// Mock data for coupon detail
const mockCouponDetails: Record<string, CouponDetailType> = {
  "1": {
    id: "1",
    code: "SUMMER2023",
    description: "Giảm giá mùa hè - Áp dụng cho tất cả sản phẩm thời trang",
    discount_type: 0, // Percentage
    value: 20,
    start_date: "2023-06-01T00:00:00.000Z",
    end_date: "2023-08-31T23:59:59.000Z",
    max_usage: 1000,
    count_used: 150,
    user_used: "Khách hàng VIP, Khách hàng thường",
    accept_for_items: "Thời trang nam, Thời trang nữ, Phụ kiện",
    minimum_order_amount: 200000,
    minimum_item_quantity: 1,
    is_active: true,
    store_id: "550e8400-e29b-41d4-a716-446655440000",
    promotion_id: "promo-summer-2023"
  },
  "2": {
    id: "2",
    code: "WELCOME50",
    description: "Chào mừng khách hàng mới - Giảm ngay 50K cho đơn hàng đầu tiên",
    discount_type: 1, // Fixed amount
    value: 50000,
    start_date: "2023-01-01T00:00:00.000Z",
    end_date: "2023-12-31T23:59:59.000Z",
    max_usage: 500,
    count_used: 75,
    user_used: "Khách hàng mới",
    accept_for_items: "Tất cả sản phẩm",
    minimum_order_amount: 100000,
    minimum_item_quantity: 1,
    is_active: true,
    store_id: "550e8400-e29b-41d4-a716-446655440000",
    promotion_id: "promo-welcome-new"
  },
  "3": {
    id: "3",
    code: "FREESHIP",
    description: "Miễn phí vận chuyển - Áp dụng cho đơn hàng từ 300K",
    discount_type: 2, // Free shipping
    value: 0,
    start_date: "2023-03-01T00:00:00.000Z",
    end_date: "2023-12-31T23:59:59.000Z",
    max_usage: 2000,
    count_used: 850,
    user_used: "Tất cả khách hàng",
    accept_for_items: "Tất cả sản phẩm",
    minimum_order_amount: 300000,
    minimum_item_quantity: 1,
    is_active: false,
    store_id: "550e8400-e29b-41d4-a716-446655440000",
    promotion_id: "promo-free-shipping"
  }
};

export const getCouponDetail = async (couponId: string, data: object = {}) => {
  console.log('Fetching coupon detail for ID:', couponId);
  
  try {
    return await axiosClient.put(endpoints.coupon.detail(couponId), data);
  } catch (error) {
    console.warn('API not available for coupon detail, using mock data:', error);
    
    // Return mock data when API fails
    const mockDetail = mockCouponDetails[couponId];
    if (mockDetail) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockDetail), 800); // Simulate network delay
      });
    } else {
      // Return a default coupon if ID not found in mock data
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          ...mockCouponDetails["1"],
          id: couponId,
          code: `COUPON-${couponId}`,
          description: `Chi tiết coupon ${couponId}`
        }), 800);
      });
    }
  }
}; 