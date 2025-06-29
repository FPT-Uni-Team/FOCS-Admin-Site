import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";
import type {
  CouponDetailType,
  CouponCreateRequest,
  CouponUpdateRequest,
  SetCouponStatusResponse,
} from "../type/coupon/coupon";

const fake_stroreId = "550e8400-e29b-41d4-a716-446655440000";

export const couponService = {
  getListValidCoupon: (params: ListPageParams) =>
    axiosClient.post(endpoints.coupon.listValid(), params),
  getListCouponByIDs: (params: string[]) =>
    axiosClient.post(endpoints.coupon.listByIds(), params),
  getCouponList: (params: ListPageParams) =>
    axiosClient.post(endpoints.coupon.list(fake_stroreId), params),
};

export const updateCoupon = async (
  couponId: string,
  couponData: CouponUpdateRequest
) => {
  const requestBody: Record<string, unknown> = {
    code: couponData.code,
    coupon_type: couponData.coupon_type,
    description: couponData.description,
    discount_type: couponData.discount_type,
    value: couponData.value,
    start_date: couponData.start_date,
    end_date: couponData.end_date,
    max_usage: couponData.max_usage,
    count_used: couponData.count_used,
    coupon_condition: {
      condition_type: couponData.coupon_condition.condition_type,
      value: couponData.coupon_condition.value,
    },
    is_active: couponData.is_active,
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
      requestBody
    );

    return response.data;
  } catch {
    throw new Error();
  }
};

export const getCouponDetail = async (
  couponId: string
): Promise<CouponDetailType> => {
  try {
    const response = await axiosClient.get(endpoints.coupon.detail(couponId));
    return response.data;
  } catch {
    throw new Error();
  }
};

export const createCoupon = async (couponData: CouponCreateRequest) => {
  const requestBody: Record<string, unknown> = {
    code: couponData.coupon_type === 1 ? couponData.code : "AUTO",
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

  console.log("requestBody", requestBody);
  try {
    const response = await axiosClient.post(
      endpoints.coupon.create(),
      requestBody
    );
    return response.data;
  } catch {
    throw new Error();
  }
};

export const deleteCoupon = async (couponId: string) => {
  try {
    const response = await axiosClient.delete(
      endpoints.coupon.delete(couponId)
    );

    return response.data;
  } catch {
    throw new Error();
  }
};

export const setCouponStatus = async (
  couponId: string,
  isActive: boolean
): Promise<SetCouponStatusResponse> => {
  try {
    await axiosClient.put(
      `${endpoints.coupon.setStatus(couponId)}?isActive=${isActive}`,
      {}
    );

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
  } catch {
    throw new Error();
  }
};
