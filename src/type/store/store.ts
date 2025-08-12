import { createSelectOptions } from "../../helper/common";
import type { SelectConfigCommon } from "../common/common";

export const CouponApplyType = {
  CouponOnly: 0,
  PromotionOnly: 1,
  CouponThenPromotion: 2,
  MaxDiscountOnly: 3,
} as const;

export type CouponApplyType =
  (typeof CouponApplyType)[keyof typeof CouponApplyType];

export const couponApplyTypeOptions = createSelectOptions(CouponApplyType);

export const selectConfigsCouponApplyType: SelectConfigCommon = {
  name: "apply_type",
  type: "select",
  label: "Apply Type",
  placeholder: "Select Apply Type",
  options: couponApplyTypeOptions,
};

export const PaymentConfig = {
  Cash: 0,
  Card: 1,
  Momo: 2,
  VnPay: 3,
} as const;

export type PaymentConfig = (typeof PaymentConfig)[keyof typeof PaymentConfig];

export const paymentConfigOptions = createSelectOptions(PaymentConfig);

export const selectConfigsPaymentConfig: SelectConfigCommon = {
  name: "payment_method",
  type: "select",
  label: "Payment Method",
  placeholder: "Select Payment Method",
  options: paymentConfigOptions,
};
