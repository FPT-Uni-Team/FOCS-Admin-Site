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
import { formatPrice } from "../../../helper/formatPrice";
import type { CategoryListDataType } from "../../../type/category/category";
import { Space, Typography } from "antd";
import type { Variant, VariantGroup } from "../../../type/variant/variant";
import TableReuse from "../Table/TableReuse";
import type { StaffDataType } from "../../../type/staff/staff";
import type { TableDataType } from "../../../type/table/table";
import { TableStatusLabel } from "../../../type/table/table";
import type { OrderListDataType } from "../../../type/order/order";
import { getOrderTypeText, type OrderType } from "../../../type/order/order";
import type { FeedbackListDataType } from "../../../type/feedback/feedback";
import type { WorkshiftItem } from "../../../type/workshift/workshift";
import { Rate, Image } from "antd";

const { Text } = Typography;

export const columnsMenuItem: ColumnsType<MenuListDataType> = [
  {
    title: "Menu item name",
    dataIndex: "menuName",
    key: "name",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (_, record) => {
      return (
        <CustomLink
          title={record.menuName}
          href={`menu-items/${record.menuId}`}
        />
      );
    },
    sorter: true,
  },
  {
    title: "Menu Base Price",
    dataIndex: "menuBasePrice",
    key: "base_price",
    sorter: true,
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (value: number) => {
      return formatPrice(value);
    },
  },
  {
    title: "Status",
    dataIndex: "isAvailable",
    key: "is_available",
    render: (_, record) => {
      return (
        <StatusTag status={record.isAvailable ? "available" : "unavailable"} />
      );
    },
  },
];

export const columnsMenuItemNoSort = [
  {
    title: "Menu item name",
    dataIndex: "menuName",
    key: "name",

    render: (value: string, _record: MenuListDataType) => {
      return <CustomLink title={value} href={_record.menuId} />;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (_: any, record: any) => {
      return (
        <StatusTag status={record.isAvailable ? "available" : "unavailable"} />
      );
    },
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
            href={`coupons/${record.id}`}
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
            href={`coupons/${record.id}`}
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
          href={`promotions/${record.promotionId}`}
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
          href={`promotions/${record.promotionId}`}
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

export const columnsCategory: ColumnsType<CategoryListDataType> = [
  {
    title: "Category name",
    dataIndex: "name",
    key: "name",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (_, record) => {
      return (
        <CustomLink title={record.name} href={`categories/${record.id}`} />
      );
    },
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "is_active",
    render: (_, record) => {
      return (
        <StatusTag status={record.is_active ? "available" : "unavailable"} />
      );
    },
  },
];

export const columnsCategoryNoSort: ColumnsType<CategoryListDataType> = [
  {
    title: "Category name",
    dataIndex: "name",
    key: "name",
    render: (_, record) => {
      return (
        <CustomLink title={record.name} href={`categories/${record.id}`} />
      );
    },
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "is_active",
    render: (_, record) => {
      return (
        <StatusTag status={record.is_active ? "available" : "unavailable"} />
      );
    },
  },
];

export const getColumnsVariantGroupNoEdit: ColumnsType<VariantGroup> = [
  {
    title: "Variant Group Name",
    dataIndex: "group_name",
    key: "group_name",
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: "Min Select",
    dataIndex: "min_select",
    key: "min_select",
    align: "center",
  },
  {
    title: "Max Select",
    dataIndex: "max_select",
    key: "max_select",
    align: "center",
  },
];

export const expandedRowRenderNoEdit = (group: VariantGroup) => {
  const variantColumns: ColumnsType<Variant> = [
    {
      title: "Variant Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Variant) => (
        <Space>
          <Text>{text}</Text>
          {!record.is_available && <Text type="secondary">(Unavailable)</Text>}
        </Space>
      ),
    },
    {
      title: "Prep Time (min)",
      dataIndex: "prep_per_time",
      key: "prep_per_time",
      align: "center",
      render: (prep: number) => `${prep}′`,
    },

    {
      title: "Qty / Time",
      dataIndex: "quantity_per_time",
      key: "quantity_per_time",
      align: "center",
      render: (qty: number) => (qty !== undefined ? qty : "-"),
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => {
        return (
          <Text type="success">
            {price > 0 ? `+${price.toLocaleString()}đ` : "-"}
          </Text>
        );
      },
    },
  ];

  return (
    <TableReuse
      columns={variantColumns}
      dataSource={group.variants}
      rowKey="id"
      pagination={false}
    />
  );
};

export const columnsStaffList: ColumnsType<StaffDataType> = [
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "first_name",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (_, record) => {
      return (
        <CustomLink
          title={record.first_name}
          href={`staffs/${record.id}`}
          key={record.id}
        />
      );
    },
    sorter: true,
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "last_name",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    sorter: true,
  },
  {
    title: "Phone Number",
    dataIndex: "phone_number",
    key: "phone_number",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
];

export const columnsTableList: ColumnsType<TableDataType> = [
  {
    title: "Table Number",
    dataIndex: "table_number",
    key: "table_number",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (_, record) => {
      return (
        <CustomLink
          title={`Table ${record.table_number}`}
          href={`tables/${record.id}`}
          key={record.id}
        />
      );
    },
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (status: number) => {
      const statusLabel =
        TableStatusLabel[status as keyof typeof TableStatusLabel];
      if (!statusLabel) {
        return <StatusTag status="unknown" />;
      }
      return <StatusTag status={statusLabel.toLowerCase()} />;
    },
    sorter: true,
  },
];

export const columnsOrderList: ColumnsType<OrderListDataType> = [
  {
    title: "Order Code",
    dataIndex: "order_code",
    key: "order_code",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (_, record) => {
      return (
        <CustomLink
          title={record.order_code}
          href={`orders/${record.order_code}`}
        />
      );
    },
    sorter: true,
  },
  {
    title: "Order Type",
    dataIndex: "order_type",
    key: "order_type",
    render: (order_type: number) => {
      return <Text>{getOrderTypeText(order_type as OrderType)}</Text>;
    },
  },
  {
    title: "Order Status",
    dataIndex: "order_status",
    key: "order_status",
    render: (order_status: number) => {
      let statusName = "";
      switch (order_status) {
        case 0:
          statusName = "pending";
          break;
        case 1:
          statusName = "confirmed";
          break;
        case 2:
          statusName = "preparing";
          break;
        case 3:
          statusName = "ready";
          break;
        case 4:
          statusName = "completed";
          break;
        case 5:
          statusName = "cancelled";
          break;
        default:
          statusName = "unknown";
          break;
      }
      return <StatusTag status={statusName} />;
    },
  },
  {
    title: "Payment Status",
    dataIndex: "payment_status",
    key: "payment_status",
    render: (payment_status: number) => {
      let statusName = "";
      switch (payment_status) {
        case 0:
          statusName = "pending";
          break;
        case 1:
          statusName = "paid";
          break;
        case 2:
          statusName = "failed";
          break;
        default:
          statusName = "unknown";
          break;
      }
      return <StatusTag status={statusName} />;
    },
  },
  {
    title: "Total Amount",
    dataIndex: "total_amount",
    key: "total_amount",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (total_amount: number) => {
      const roundedAmount = Math.round(total_amount * 100) / 100;
      const formattedAmount = roundedAmount
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return <Text strong>{formattedAmount}</Text>;
    },
    sorter: true,
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (created_at: string) => {
      return <Text>{formatDate(created_at)}</Text>;
    },
    sorter: true,
  },
];

export const columnsVariantList: ColumnsType<Variant> = [
  {
    title: "Variant Name",
    dataIndex: "name",
    key: "name",
    width: "40%",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (text: string, record: Variant) => {
      return <CustomLink title={text} href={`variants/${record.id}`} />;
    },
    sorter: true,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    width: "35%",
    align: "center",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (price: number) => (
      <Text type={price > 0 ? "success" : undefined}>
        {price > 0 ? `+${formatPrice(price)}` : "Free"}
      </Text>
    ),
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "is_available",
    key: "is_available",
    width: "25%",
    align: "center",
    render: (isAvailable: boolean) => (
      <StatusTag status={isAvailable ? "available" : "unavailable"} />
    ),
  },
];

export const columnsFeedback: ColumnsType<FeedbackListDataType> = [
  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (rating: number) => {
      return <Rate disabled defaultValue={rating} />;
    },
    sorter: true,
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (comment: string) => {
      return (
        <Text ellipsis={{ tooltip: comment }} style={{ maxWidth: 250 }}>
          {comment}
        </Text>
      );
    },
  },
  {
    title: "Images",
    dataIndex: "images",
    key: "images",
    render: (images: string[]) => {
      if (!images || images.length === 0) {
        return <Text type="secondary">No images</Text>;
      }
      return (
        <Image.PreviewGroup>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {images.slice(0, 3).map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Feedback image ${index + 1}`}
                width={40}
                height={40}
                style={{
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #d9d9d9",
                }}
                preview={{
                  mask: "Click to view",
                }}
              />
            ))}
            {images.length > 3 && (
              <Image
                src={images[3]}
                alt={`Feedback image 4`}
                width={40}
                height={40}
                style={{
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #d9d9d9",
                }}
                preview={{
                  mask: `+${images.length - 3} more`,
                }}
              />
            )}

            {images.slice(4).map((image, index) => (
              <Image
                key={`hidden-${index + 4}`}
                src={image}
                alt={`Feedback image ${index + 5}`}
                style={{ display: "none" }}
              />
            ))}
          </div>
        </Image.PreviewGroup>
      );
    },
  },
  {
    title: "Public",
    dataIndex: "is_public",
    key: "is_public",
    render: (isPublic: boolean) => {
      return (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            backgroundColor: isPublic ? "#f6ffed" : "#fff2e8",
            color: isPublic ? "#52c41a" : "#fa8c16",
            border: `1px solid ${isPublic ? "#52c41a" : "#fa8c16"}`,
          }}
        >
          {isPublic ? "True" : "False"}
        </span>
      );
    },
  },
  {
    title: "Reply",
    dataIndex: "reply",
    key: "reply",
    render: (reply: string | null) => {
      if (!reply) {
        return <Text type="secondary">No reply</Text>;
      }
      return (
        <Text ellipsis={{ tooltip: reply }} style={{ maxWidth: 200 }}>
          {reply}
        </Text>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (created_at: string) => {
      return <Text>{formatDate(created_at)}</Text>;
    },
    sorter: true,
  },
];

export const columnsWorkshiftList: ColumnsType<WorkshiftItem> = [
  {
    title: "Work Date",
    dataIndex: "workDate",
    key: "workDate",
    sortDirections: [
      "ascend" as SortOrder,
      "descend" as SortOrder,
      "ascend" as SortOrder,
    ],
    render: (workDate: string, record: WorkshiftItem) => {
      return (
        <CustomLink
          title={formatDate(workDate)}
          href={`workshifts/${record.id}`}
        />
      );
    },
    sorter: true,
  },
  {
    title: "Shifts",
    dataIndex: "shift",
    key: "shift",
    render: (shifts: WorkshiftItem["shift"]) => {
      return (
        <div>
          {shifts.map((shift, index) => (
            <div key={index} style={{ marginBottom: index > 0 ? "8px" : "0" }}>
              <div style={{ fontWeight: "500", color: "#1890ff" }}>
                {shift.staffName}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {shift.startTime} - {shift.endTime}
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
];
