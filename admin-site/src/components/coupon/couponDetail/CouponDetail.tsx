import { type FC } from "react";
import { Tabs, Table, Tag } from "antd";
import { CouponTypeLabel, type CouponDetailType } from "../../../type/coupon/coupon";
import { formatDate } from "../../../helper/formatDate";
import styles from "./CouponDetail.module.scss";

interface CouponDetailProps {
  coupon: CouponDetailType | null;
  loading: boolean;
  error: string | null;
}

const CouponDetail: FC<CouponDetailProps> = ({ coupon, loading, error }) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div>Đang tải thông tin coupon...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Có lỗi xảy ra</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className={styles.errorContainer}>
        <h3>Không tìm thấy coupon</h3>
        <p>Coupon không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  const renderStatus = (isActive: boolean) => {
    return (
      <Tag color={isActive ? "green" : "red"}>
        {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
      </Tag>
    );
  };

  const renderDiscountValue = () => {
    if (coupon.discount_type === 0) { // Percentage
      return `${coupon.value}%`;
    }
    return `${coupon.value.toLocaleString()}đ`;
  };

  // Data for the discount table
  const discountData = [
    {
      key: '1',
      discountType: CouponTypeLabel[coupon.discount_type as keyof typeof CouponTypeLabel],
      discountValue: renderDiscountValue(),
      startEndDate: `${formatDate(coupon.start_date)} - ${formatDate(coupon.end_date)}`,
      status: renderStatus(coupon.is_active),
    }
  ];

  const discountColumns = [
    {
      title: 'Discount Type',
      dataIndex: 'discountType',
      key: 'discountType',
    },
    {
      title: 'Discount Value',
      dataIndex: 'discountValue',
      key: 'discountValue',
    },
    {
      title: 'Start - End Date',
      dataIndex: 'startEndDate',
      key: 'startEndDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  // Mock product data for demonstration
  const productData = [
    {
      key: '1',
      productName: 'Sản phẩm A',
      category: 'Thời trang',
      price: '500,000đ',
      discount: renderDiscountValue(),
    },
    {
      key: '2',
      productName: 'Sản phẩm B',
      category: 'Điện tử',
      price: '1,200,000đ',
      discount: renderDiscountValue(),
    },
  ];

  const productColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Giá gốc',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Bundle price',
      children: (
        <div className={styles.tabContent}>
          <Table
            columns={discountColumns}
            dataSource={discountData}
            pagination={false}
            className={styles.discountTable}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Product list',
      children: (
        <div className={styles.tabContent}>
          <Table
            columns={productColumns}
            dataSource={productData}
            pagination={false}
            className={styles.productTable}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.couponDetailContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.couponInfo}>
          <h1 className={styles.couponTitle}>{coupon.description}</h1>
          <div className={styles.couponMeta}>
            <span className={styles.couponCode}>{coupon.code}</span>
            {renderStatus(coupon.is_active)}
          </div>
        </div>
      </div>

      {/* General Information */}
      <div className={styles.generalInfo}>
        <h3 className={styles.sectionTitle}>General Information</h3>
        
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>Bundle name</label>
            <div>{coupon.code}</div>
          </div>
          
          <div className={styles.infoItem}>
            <label>Description</label>
            <div>{coupon.description}</div>
          </div>
        </div>

        <div className={styles.infoItem}>
          <label>Bundle picture</label>
          <div className={styles.bundlePicture}>
            <div className={styles.imagePlaceholder}>
              <span>📷</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsSection}>
        <Tabs
          defaultActiveKey="1"
          items={tabItems}
          className={styles.customTabs}
        />
      </div>
    </div>
  );
};

export default CouponDetail; 