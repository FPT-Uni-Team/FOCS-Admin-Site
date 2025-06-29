import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";
import type {
  CouponListParams,
  CouponDetailType,
  CouponCreateRequest,
  CouponUpdateRequest,
  SetCouponStatusResponse,
  CouponAssignRequest,
  CouponAssignResponse,
} from "../type/coupon/coupon";

export const couponService = {
  getListValidCoupon: (params: ListPageParams) =>
    axiosClient.post(endpoints.coupon.listValid(), params),
  getListCouponByIDs: (params: string[]) =>
    axiosClient.post(endpoints.coupon.listByIds(), params),
};

export const getCouponList = async (params: CouponListParams) => {
  const storeId =
    localStorage.getItem("storeId") || "550e8400-e29b-41d4-a716-446655440000";

  const requestBody = {
    page: params.page || 1,
    page_size: params.page_size || 10,
    search_by: params.search_by || "",
    search_value: params.search_value || "",
    sort_by: params.sort_by || "",
    sort_order: params.sort_order || "",
    filters: params.filters || {},
  };

  try {
    const response = await axiosClient.post(
      endpoints.coupon.list(storeId),
      requestBody,
      {
        timeout: 15000, // Increase timeout for coupon list API
      }
    );

    if (response.data) {
      if (response.data.items && Array.isArray(response.data.items)) {
        return {
          ...response.data,
          isFromAPI: true,
        };
      }
      // If response is directly an array
      else if (Array.isArray(response.data)) {
        return {
          items: response.data,
          totalCount: response.data.length,
          pageNumber: params.page || 1,
          pageSize: params.page_size || 10,
          totalPages: Math.ceil(
            response.data.length / (params.page_size || 10)
          ),
          isFromAPI: true,
        };
      }
      // If response has different structure, try to adapt
      else {
        return {
          items: [],
          totalCount: 0,
          pageNumber: params.page || 1,
          pageSize: params.page_size || 10,
          totalPages: 0,
          isFromAPI: true,
        };
      }
    }

    // Empty response
    return {
      items: [],
      totalCount: 0,
      pageNumber: params.page || 1,
      pageSize: params.page_size || 10,
      totalPages: 0,
      isFromAPI: true,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      config?: {
        url?: string;
        method?: string;
        data?: string;
      };
      message?: string;
    };

    // Re-throw the error to be handled by Redux
    let errorMessage = "Failed to fetch coupons";

    if (err.response?.status === 401) {
      errorMessage = "Authentication required. Please login again.";
    } else if (err.response?.status === 400) {
      const errorData = err.response?.data as { message?: string };
      errorMessage = `Bad request: ${
        errorData?.message || "Invalid request format"
      }`;
    } else if (err.response?.status === 500) {
      const errorData = err.response?.data as { message?: string };
      errorMessage = `Server error: ${
        errorData?.message || "Internal server error"
      }`;
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

export const updateCoupon = async (
  couponId: string,
  couponData: CouponUpdateRequest
) => {
  const storeId =
    localStorage.getItem("storeId") || "550e8400-e29b-41d4-a716-446655440000";
  const accessToken = localStorage.getItem("accessToken");

  // Check if we have valid authentication
  if (!accessToken) {
    throw new Error("No access token found. Please login again.");
  }

  // Create request body with all required fields according to API documentation
  const requestBody: Record<string, unknown> = {
    code: couponData.code, // Required and not empty if CouponType is Manual
    coupon_type: couponData.coupon_type, // Required - enum value
    description: couponData.description, // Required
    discount_type: couponData.discount_type, // Required - enum value
    value: couponData.value, // Required - discount value
    start_date: couponData.start_date, // Required - DateTime (keep original format)
    end_date: couponData.end_date, // Required - DateTime (keep original format)
    max_usage: couponData.max_usage, // Required
    count_used: couponData.count_used, // Required
    coupon_condition: {
      condition_type: couponData.coupon_condition.condition_type,
      value: couponData.coupon_condition.value,
    }, // Required
    is_active: couponData.is_active, // Required
  };

  if (couponData.status !== undefined && couponData.status !== null) {
    requestBody.status = couponData.status;
  }

  if (
    couponData.max_usage_per_user !== undefined &&
    couponData.max_usage_per_user !== null
  ) {
    requestBody.max_usage_per_user = couponData.max_usage_per_user;
  }

  if (couponData.accept_for_items) {
    requestBody.accept_for_items = couponData.accept_for_items;
  }

  if (couponData.promotion_id) {
    requestBody.promotion_id = couponData.promotion_id;
  }

  try {
    const response = await axiosClient.put(
      endpoints.coupon.update(couponId),
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          StoreId: storeId,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      message?: string;
    };

    // Handle specific error cases according to API documentation
    let errorMessage = "Failed to update coupon";

    if (err.response?.status === 400) {
      const errorData = err.response?.data as {
        message?: string;
        errors?: Record<string, string[]>;
        title?: string;
      };

      // Handle specific business rule violations
      if (errorData?.message?.includes("Coupon code already exists")) {
        errorMessage = "Mã coupon đã tồn tại. Vui lòng sử dụng mã khác.";
      } else if (
        errorData?.message?.includes("Start date must be before end date")
      ) {
        errorMessage = "Ngày bắt đầu phải trước ngày kết thúc.";
      } else if (
        errorData?.errors &&
        Object.keys(errorData.errors).length > 0
      ) {
        // Handle validation errors
        const errorMessages = Object.entries(errorData.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${messages?.join(", ") || "Invalid"}`
          )
          .join("; ");
        errorMessage = `Lỗi xác thực - ${errorMessages}`;
      } else {
        errorMessage =
          errorData?.message || errorData?.title || "Dữ liệu không hợp lệ";
      }
    } else if (err.response?.status === 404) {
      errorMessage = "Không tìm thấy coupon để cập nhật.";
    } else if (err.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";

      // Redirect to login page
      window.location.href = "/login";
      return;
    } else if (err.response?.status === 500) {
      const errorData = err.response?.data as { message?: string };
      errorMessage = `Lỗi server: ${
        errorData?.message || "Internal Server Error"
      }. Vui lòng kiểm tra dữ liệu và thử lại.`;
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

// Mock coupon details for development
const mockCouponDetails: Record<string, CouponDetailType> = {
  "616ff0c8-48c3-444c-bda9-017ac829541c": {
    id: "616ff0c8-48c3-444c-bda9-017ac829541c",
    code: "SUMMER2023",
    description: "Giảm giá mùa hè - Áp dụng cho tất cả sản phẩm thời trang",
    discount_type: 0,
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
    promotion_id: "promo-summer-2023",
  },
  "1": {
    id: "1",
    code: "WELCOME50",
    description:
      "Chào mừng khách hàng mới - Giảm ngay 50K cho đơn hàng đầu tiên",
    discount_type: 1,
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
    promotion_id: "promo-welcome-2023",
  },
  "2": {
    id: "2",
    code: "FREESHIP",
    description: "Miễn phí vận chuyển cho tất cả đơn hàng",
    discount_type: 2,
    value: 0,
    start_date: "2023-03-01T00:00:00.000Z",
    end_date: "2023-12-31T23:59:59.000Z",
    max_usage: 2000,
    count_used: 850,
    user_used: "Tất cả khách hàng",
    accept_for_items: "Tất cả sản phẩm",
    minimum_order_amount: 0,
    minimum_item_quantity: 1,
    is_active: false,
    store_id: "550e8400-e29b-41d4-a716-446655440000",
    promotion_id: "promo-freeship-2023",
  },
};

export const getCouponDetail = async (
  couponId: string
): Promise<CouponDetailType> => {
  try {
    const response = await axiosClient.get(endpoints.coupon.detail(couponId));
    return response.data;
  } catch {
    // Fallback to mock data if API fails
    const mockDetail = mockCouponDetails[couponId];
    if (mockDetail) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockDetail);
        }, 500);
      });
    } else {
      throw new Error("Coupon not found");
    }
  }
};

export const createCoupon = async (couponData: CouponCreateRequest) => {
  const storeId =
    localStorage.getItem("storeId") || "550e8400-e29b-41d4-a716-446655440000";
  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id") ||
    "admin-user-id";
  const accessToken = localStorage.getItem("accessToken");

  // Check if we have valid authentication
  if (!accessToken) {
    throw new Error("No access token found. Please login again.");
  }

  // Create request body with all required fields
  const requestBody: Record<string, unknown> = {
    code: couponData.coupon_type === 1 ? couponData.code : "AUTO", // hoặc "AUTOGEN", hoặc random string, miễn không rỗng
    coupon_type: couponData.coupon_type,
    description: couponData.description,
    discount_type: couponData.discount_type,
    value: couponData.value,
    start_date: new Date(couponData.start_date).toISOString(),
    end_date: new Date(couponData.end_date).toISOString(),
    max_usage: couponData.max_usage,
    count_used: 0,
    is_active: couponData.is_active,
    coupon_condition: {
      condition_type: couponData.coupon_condition.condition_type,
      value: couponData.coupon_condition.value,
    },
  };

  if (
    couponData.max_usage_per_user !== undefined &&
    couponData.max_usage_per_user !== null
  ) {
    requestBody.max_usage_per_user = couponData.max_usage_per_user;
  }

  if (couponData.accept_for_items) {
    requestBody.accept_for_items = couponData.accept_for_items;
  }

  if (couponData.promotion_id) {
    requestBody.promotion_id = couponData.promotion_id;
  }

  try {
    const response = await axiosClient.post(
      endpoints.coupon.create(),
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          StoreId: storeId,
          UserId: userId,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      message?: string;
    };

    // Handle specific error cases
    let errorMessage = "Failed to create coupon";

    if (err.response?.status === 400) {
      const errorData = err.response?.data as {
        message?: string;
        errors?: Record<string, string[]>;
        title?: string;
      };

      // Handle validation errors
      if (errorData?.errors && Object.keys(errorData.errors).length > 0) {
        const errorMessages = Object.entries(errorData.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${messages?.join(", ") || "Invalid"}`
          )
          .join("; ");
        errorMessage = `Validation error - ${errorMessages}`;
      } else {
        errorMessage =
          errorData?.message ||
          errorData?.title ||
          "Bad request - Invalid coupon data";
      }
    } else if (err.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      errorMessage = "Session expired. Please login again.";

      // Redirect to login page
      window.location.href = "/login";
      return;
    } else if (err.response?.status === 500) {
      errorMessage = "Server error occurred while creating coupon.";
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

export const deleteCoupon = async (couponId: string) => {
  const accessToken = localStorage.getItem("accessToken");

  // Check if we have valid authentication
  if (!accessToken) {
    throw new Error("No access token found. Please login again.");
  }

  try {
    const response = await axiosClient.delete(
      endpoints.coupon.delete(couponId),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      message?: string;
    };

    // Handle specific error cases according to API documentation
    let errorMessage = "Failed to delete coupon";

    if (err.response?.status === 404) {
      errorMessage = "Delete unsuccessfully"; // According to the documentation
    } else if (err.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      errorMessage = "Session expired. Please login again.";

      // Redirect to login page
      window.location.href = "/login";
      return;
    } else if (err.response?.status === 400) {
      const errorData = err.response?.data as { message?: string };
      errorMessage = errorData?.message || "Bad request - Invalid coupon ID";
    } else if (err.response?.status === 500) {
      errorMessage = "Server error occurred while deleting coupon.";
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

export const trackCouponUsage = async (couponId: string, userId?: string) => {
  const accessToken = localStorage.getItem("accessToken");

  // Check if we have valid authentication
  if (!accessToken) {
    throw new Error("No access token found. Please login again.");
  }

  try {
    // Build query string if userId is provided
    const queryParams = userId ? `?userId=${userId}` : "";
    const url = `${endpoints.coupon.trackUsage(couponId)}${queryParams}`;

    const response = await axiosClient.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    // Transform response to match our interface
    const result = {
      totalLeft: response.data.totalLeft || 0,
      leftPerUser: response.data.leftPerUser,
      couponId: couponId,
      currentUsage: response.data.currentUsage || 0,
      maxUsage: response.data.maxUsage || 0,
      maxUsagePerUser: response.data.maxUsagePerUser,
      userUsage: response.data.userUsage,
    };

    return result;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      message?: string;
    };

    // Handle specific error cases according to API documentation
    let errorMessage = "Failed to track coupon usage";

    if (err.response?.status === 404) {
      const errorData = err.response?.data as { message?: string };
      errorMessage = errorData?.message || "Coupon cannot be used anymore.";
    } else if (err.response?.status === 400) {
      const errorData = err.response?.data as { message?: string };
      errorMessage = errorData?.message || "Invalid coupon data.";
    } else if (err.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      errorMessage = "Session expired. Please login again.";

      // Redirect to login page
      window.location.href = "/login";
      return;
    } else if (err.response?.status === 500) {
      errorMessage = "Server error occurred while tracking coupon usage.";
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

// Set Coupon Status - Enable or disable a coupon
export const setCouponStatus = async (
  couponId: string,
  isActive: boolean
): Promise<SetCouponStatusResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  // Check if we have valid authentication
  if (!accessToken) {
    throw new Error("No access token found. Please login again.");
  }

  try {
    // According to API documentation: PUT /admin/coupon/{id}/status?isActive={isActive}
    await axiosClient.put(
      `${endpoints.coupon.setStatus(couponId)}?isActive=${isActive}`,
      {}, // Empty body for PUT request
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    // Transform response to match our interface
    const result: SetCouponStatusResponse = {
      success: true,
      message: `Coupon status ${
        isActive ? "enabled" : "disabled"
      } successfully`,
      data: {
        id: couponId,
        isActive: isActive,
      },
    };

    return result;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      message?: string;
    };

    // Handle specific error cases according to API documentation
    let errorMessage = "Failed to set coupon status";

    if (err.response?.status === 404) {
      const errorData = err.response?.data as { message?: string };
      errorMessage =
        errorData?.message || "Coupon not found or has been deleted.";
    } else if (err.response?.status === 400) {
      const errorData = err.response?.data as { message?: string };
      errorMessage = errorData?.message || "Invalid request parameters.";
    } else if (err.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      errorMessage = "Session expired. Please login again.";

      // Redirect to login page
      window.location.href = "/login";
      return {
        success: false,
        message: errorMessage,
      };
    } else if (err.response?.status === 500) {
      errorMessage = "Server error occurred while setting coupon status.";
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};

// Assign Coupons to Promotion - Assign one or more coupons to a promotion for a specific store
export const assignCouponsToPromotion = async (
  storeId: string,
  assignRequest: CouponAssignRequest
): Promise<CouponAssignResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  // Check if we have valid authentication
  if (!accessToken) {
    throw new Error("No access token found. Please login again.");
  }

  // Validate input parameters
  if (!storeId) {
    throw new Error("Store ID is required");
  }

  if (!assignRequest.promotionId) {
    throw new Error("Promotion ID is required");
  }

  if (!assignRequest.couponIds || assignRequest.couponIds.length === 0) {
    throw new Error("At least one coupon ID is required");
  }

  // Request body according to API documentation - using PascalCase for C# backend
  const requestBody = {
    coupon_ids: assignRequest.couponIds,
    promotion_id: assignRequest.promotionId,
  };

  try {
    await axiosClient.put(
      endpoints.coupon.assignPromotion(storeId),
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    // Transform response to match our interface
    const result: CouponAssignResponse = {
      success: true,
      message: "Coupons assigned to promotion successfully",
      data: {
        promotionId: assignRequest.promotionId,
        assignedCouponIds: assignRequest.couponIds,
        totalAssigned: assignRequest.couponIds.length,
      },
    };

    return result;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      message?: string;
    };

    // Handle specific error cases according to API documentation
    let errorMessage = "Failed to assign coupons to promotion";

    if (err.response?.status === 404) {
      const errorData = err.response?.data as { message?: string };
      if (errorData?.message?.includes("Promotion not found")) {
        errorMessage = "Promotion not found or deleted.";
      } else {
        errorMessage = errorData?.message || "Update unsuccessfully";
      }
    } else if (err.response?.status === 400) {
      const errorData = err.response?.data as {
        message?: string;
        errors?: Record<string, string[]>;
        title?: string;
      };

      // Handle validation errors
      if (errorData?.errors && Object.keys(errorData.errors).length > 0) {
        const errorMessages = Object.entries(errorData.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${messages?.join(", ") || "Invalid"}`
          )
          .join("; ");
        errorMessage = `Validation error - ${errorMessages}`;
      } else {
        errorMessage =
          errorData?.message || errorData?.title || "Invalid request data";
      }
    } else if (err.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      errorMessage = "Session expired. Please login again.";

      // Redirect to login page
      window.location.href = "/login";
      return {
        success: false,
        message: errorMessage,
      };
    } else if (err.response?.status === 403) {
      errorMessage =
        "You do not have permission to assign promotions for this store.";
    } else if (err.response?.status === 500) {
      errorMessage =
        "Server error occurred while assigning coupons to promotion.";
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};
