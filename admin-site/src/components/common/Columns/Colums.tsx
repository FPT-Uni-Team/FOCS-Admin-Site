import type { ColumnsType } from "antd/es/table";
import type { MenuListDataType } from "../../../type/menu/menu";
import CustomLink from "../Link/CustomLink";
import {
  CouponStatusLabel,
  CouponTypeLabel,
  type CouponAdminDTO,
} from "../../../type/coupon/coupon";
import type { SortOrder } from "antd/es/table/interface";
import { formatDate } from "../../../helper/formatDate";
import {
  PromotionStatusLabel,
  PromotionTypeLabel,
  type PromotionListDataType,
} from "../../../type/promotion/promotion";
import StatusTag from "../Status/StatusTag";

export const columnsMenuItemNoSort = [
  {
    title: "Menu item name",
    dataIndex: "menuName",
    key: "name",

    render: (value: string, _record: MenuListDataType) => {
      return <CustomLink title={value} href={`menu-item/${_record.menuId}`} />;
    },
  },
  {
    title: "Menu Base Price",
    dataIndex: "menuBasePrice",
    key: "base_price",
  },
  {
    title: "Status",
    dataIndex: "isAvailable",
    key: "is_available",
  },
  {
    title: "Menu category",
    dataIndex: "menuCategoryId",
    key: "menu_category_id",
  },
];

export const columnsCouponList: ColumnsType<CouponAdminDTO> = [
  {
    title: "Counpon Code",
    dataIndex: "code",
    key: "code",
    render: (_, record: CouponAdminDTO) => {
      return (
        <>
          <CustomLink
            title={record.code}
            href={`/coupons/${record.id}`}
            key={record.id}
          />
        </>
      );
    },
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    sorter: true,
  },
  {
    title: "Coupon Type",
    dataIndex: "discount_type",
    key: "discount_type",
    render: (discountType: number) => {
      return CouponTypeLabel[discountType as keyof typeof CouponTypeLabel];
    },
  },
  {
    title: "Coupon Status",
    dataIndex: "status",
    key: "status",
    render: (status: number) => {
      return (
        <StatusTag
          status={CouponStatusLabel[status as keyof typeof CouponStatusLabel]}
        />
      );
    },
  },
  {
    title: "Start Date",
    dataIndex: "start_date",
    key: "start_date",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (date: string) => {
      return formatDate(date);
    },
    sorter: true,
  },
  {
    title: "End Date",
    dataIndex: "end_date",
    key: "end_date",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (date: string) => {
      return formatDate(date);
    },
    sorter: true,
  },
];

export const columnsCouponListNoSort: ColumnsType<CouponAdminDTO> = [
  {
    title: "Counpon Code",
    dataIndex: "code",
    key: "code",
    render: (_, record: CouponAdminDTO) => {
      return (
        <>
          <CustomLink
            title={record.code}
            href={`/coupons/${record.id}`}
            key={record.id}
          />
        </>
      );
    },
  },
  {
    title: "Coupon Type",
    dataIndex: "discount_type",
    key: "discount_type",
    render: (discountType: number) => {
      return CouponTypeLabel[discountType as keyof typeof CouponTypeLabel];
    },
  },
  {
    title: "Coupon Status",
    dataIndex: "status",
    key: "status",
    render: (status: number) => {
      return CouponStatusLabel[status as keyof typeof CouponStatusLabel];
    },
  },
  {
    title: "Start Date",
    dataIndex: "start_date",
    key: "start_date",
    render: (date: string) => {
      return formatDate(date);
    },
  },
  {
    title: "End Date",
    dataIndex: "end_date",
    key: "end_date",
    render: (date: string) => {
      return formatDate(date);
    },
  },
];

export const columnsPromotionList: ColumnsType<PromotionListDataType> = [
  {
    title: "Promotion Name",
    dataIndex: "promotionName",
    key: "title",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (_, record) => {
      return (
        <CustomLink
          title={record.promotionName}
          href={`/promotions/${record.promotionId}`}
          key={record.promotionId}
        />
      );
    },
    sorter: true,
  },
  {
    title: "Promotion Type",
    dataIndex: "promotionType",
    key: "promotion_type",
    render: (text: number) => {
      return PromotionTypeLabel[text as keyof typeof PromotionTypeLabel];
    },
  },
  {
    title: "Status",
    dataIndex: "promotionStatus",
    key: "status",
    render: (text: number) => {
      return (
        <StatusTag
          status={
            PromotionStatusLabel[text as keyof typeof PromotionStatusLabel]
          }
        />
      );
    },
  },
  {
    title: "Start Date",
    dataIndex: "promotionStartDate",
    key: "start_date",
    sorter: true,
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (text: string) => {
      return formatDate(text);
    },
  },
  {
    title: "End Date",
    dataIndex: "promotionEndDate",
    key: "end_date",
    sorter: true,
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (text: string) => {
      return formatDate(text);
    },
  },
];

export const columnsPromotionListNoSort: ColumnsType<PromotionListDataType> = [
  {
    title: "Promotion Name",
    dataIndex: "promotionName",
    key: "title",
    render: (_, record) => {
      return (
        <CustomLink
          title={record.promotionName}
          href={`/promotions/${record.promotionId}`}
          key={record.promotionId}
        />
      );
    },
  },
  {
    title: "Promotion Type",
    dataIndex: "promotionType",
    key: "promotion_type",
    render: (text: number) => {
      return PromotionTypeLabel[text as keyof typeof PromotionTypeLabel];
    },
  },
  {
    title: "Status",
    dataIndex: "promotionStatus",
    key: "status",
    render: (text: number) => {
      return (
        <StatusTag
          status={
            PromotionStatusLabel[text as keyof typeof PromotionStatusLabel]
          }
        />
      );
    },
  },
  {
    title: "Start Date",
    dataIndex: "promotionStartDate",
    key: "start_date",
    render: (text: string) => {
      return formatDate(text);
    },
  },
  {
    title: "End Date",
    dataIndex: "promotionEndDate",
    key: "end_date",
    render: (text: string) => {
      return formatDate(text);
    },
  },
];
