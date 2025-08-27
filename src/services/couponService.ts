import type { AxiosError } from "axios";
import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";
import type { ListPageParams } from "../type/common/common";
import type {
  CouponCreateRequest,
  CouponUpdateRequest,
  SetCouponStatusResponse,
} from "../type/coupon/coupon";

export const couponService = {
  getListValidCoupon: (params: ListPageParams, promotionId?: string) =>
    axiosClient.post(endpoints.coupon.listValid(promotionId), params),
  getListCouponByIDs: (params: string[]) =>
    axiosClient.post(endpoints.coupon.listByIds(), params),
  getCouponList: (params: ListPageParams) =>
    axiosClient.post(
      endpoints.coupon.list(sessionStorage.getItem("storeId") as string),
      params
    ),
  couponDetail: (params: string) =>
    axiosClient.get(endpoints.coupon.detail(params)),
};

export const updateCoupon = async (
  couponId: string,
  couponData: CouponUpdateRequest
) => {
  const requestBody: Record<string, unknown> = {
    ...couponData,
    start_date: new Date(couponData.start_date).toISOString(),
    end_date: new Date(couponData.end_date).toISOString(),
  };

  try {
    const response = await axiosClient.put(
      endpoints.coupon.update(couponId),
      requestBody
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    throw message;
  }
};

export const createCoupon = async (couponData: CouponCreateRequest) => {
  const requestBody: Record<string, unknown> = {
    ...couponData,
    code: couponData.coupon_type === 1 ? couponData.code : "",
    start_date: new Date(couponData.start_date).toISOString(),
    end_date: new Date(couponData.end_date).toISOString(),
  };

  try {
    const response = await axiosClient.post(
      endpoints.coupon.create(),
      requestBody
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const data = axiosError.response?.data as { message?: string } | undefined;
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "An error occurred";
    throw message;
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
