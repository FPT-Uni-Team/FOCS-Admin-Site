import styles from "./PromotionForm.module.scss";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  type FormInstance,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { getDisabledTime, validateDate } from "../../../helper/formatDate";
import dayjs from "dayjs";
import {
  PromotionType,
  PromotionTypeLabel,
} from "../../../type/promotion/promotion";
import { useEffect, useState, type FC } from "react";
import StepBlock from "../../common/Step/StepBlock";
import { PlusOutlined } from "@ant-design/icons";
import ModalMenuItem from "../../common/modal/ModalMenuItem";
import TableReuse from "../../common/Table/TableReuse";
import type { MenuListDataType } from "../../../type/menu/menu";
import { columnsMenuItemNoSort } from "../../common/Columns/Colums";
import clsx from "clsx";

interface Props {
  title?: string;
  mode?: string;
  form: FormInstance;
  step: number;
}

export interface SelectedTableItems {
  keys: React.Key[];
  items: MenuListDataType[];
}

export interface SelectedTableItemsBuyXGetY {
  BuyX: SelectedTableItems;
  GetY: SelectedTableItems;
}
const promotionOptions = [
  {
    value: PromotionType.Percentage,
    label: PromotionTypeLabel[PromotionType.Percentage],
  },
  {
    value: PromotionType.FixedAmount,
    label: PromotionTypeLabel[PromotionType.FixedAmount],
  },
  {
    value: PromotionType.BuyXGetY,
    label: PromotionTypeLabel[PromotionType.BuyXGetY],
  },
];

const promotionApplyOption = [
  {
    value: 0,
    label: "Item",
  },
  {
    value: 1,
    label: "Order",
  },
];

const PromotionForm: FC<Props> = ({ mode, form, step }) => {
  const promotionScope = Form.useWatch(["step2", "promotion_scope"], form);
  const useCoupon = Form.useWatch(["step1", "use_coupon"], form);
  const promotionType = Form.useWatch(["step1", "promotionType"], form);
  const [showModalMenuItem, setShowModalMenuItem] = useState<boolean>(false);
  const [showModalCoupon, setShowModalCoupon] = useState<boolean>(false);
  const [showModalBuyXGetY, setShowModalBuyXGetY] = useState({
    buyX: false,
    getY: false,
  });

  const [dataMenuItemSeleted, setDataMenuItemSeleted] =
    useState<SelectedTableItems>({
      keys: [],
      items: [],
    });

  const [dataMenuItemSeletedBuyXGetY, setDataMenuItemSeletedBuyXGetY] =
    useState<SelectedTableItemsBuyXGetY>({
      BuyX: {
        items: [],
        keys: [],
      },
      GetY: {
        items: [],
        keys: [],
      },
    });

  const showMenuItemSelection = promotionScope === 0;

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="promotionForm"
        colon={true}
        initialValues={{
          step1: {
            use_coupon: false,
            use_other_promotion: false,
          },
          step2: {
            menu_item_select_discount: [],
          },
        }}
      >
        <StepBlock currentStep={step} step={1}>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item
                label="Promotion Name"
                name={["step1", "promotionName"]}
                rules={[
                  {
                    required: true,
                    message: "Please input promotion name!",
                  },
                ]}
              >
                <Input placeholder="Enter promotion name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={36}>
            <Col span={24}>
              <Form.Item label="Description" name={["step1", "description"]}>
                <TextArea rows={4} placeholder="Enter promotion description" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item
                name={["step1", "start_date"]}
                label="Promotion Start Date"
                rules={[
                  {
                    required: true,
                    message: "Please select start date!",
                  },
                ]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={() => getDisabledTime()}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["step1", "end_date"]}
                label="Promotion End Date"
                dependencies={[["step1", "start_date"]]}
                rules={[
                  {
                    required: true,
                    message: "Please select end date!",
                  },
                  validateDate({
                    getFieldValue: form.getFieldValue,
                    fieldName: ["step1", "start_date"],
                    message: "End date must be after start date!",
                  }),
                ]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={() => getDisabledTime()}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item
                label="Promotion type"
                name={["step1", "promotionType"]}
                rules={[
                  {
                    required: true,
                    message: "Please select promotion type!",
                  },
                ]}
              >
                <Select
                  placeholder="Select promotion type"
                  options={promotionOptions}
                />
              </Form.Item>
            </Col>
          </Row>
          <Space direction="vertical">
            <div className={styles.flexClass}>
              <Form.Item
                name={["step1", "use_other_promotion"]}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch />
              </Form.Item>
              <div>Use with other promotions</div>
            </div>
            <div className={styles.flexClass}>
              <Form.Item
                name={["step1", "use_coupon"]}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch />
              </Form.Item>
              <div>Use coupon for promotion</div>
            </div>
          </Space>
          {useCoupon && (
            <div className={clsx(styles.customTableSelect, styles.marginItem)}>
              <div className={styles.titleSelectCustom}>
                <Typography.Title level={5}>Select coupon</Typography.Title>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setShowModalCoupon(true)}
                >
                  Select
                </Button>
              </div>
              {showModalCoupon && (
                <>
                  <div>cuong</div>
                </>
              )}
              <TableReuse />
            </div>
          )}
        </StepBlock>

        <StepBlock currentStep={step} step={2}>
          <div className={styles.conditionApplicationBlock}>
            <div className={styles.conditionBlock}>
              <Typography.Title level={5}>Condition</Typography.Title>
              {promotionType !== 4 ? (
                <div>
                  <Row gutter={36}>
                    <Col span={12}>
                      <Form.Item
                        name={["step2", "promotion_scope"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input apply promotion!",
                          },
                        ]}
                      >
                        <Select
                          options={promotionApplyOption}
                          placeholder="Apply promotion to"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={36}>
                    <Col span={12}>
                      <Input
                        value="Minimum item in cart"
                        disabled
                        className={styles.textInputLabelDisabled}
                      />
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        name={["step2", "minimun_item_in_cart"]}
                        normalize={(value) => {
                          const formatted = value
                            .replace(/\./g, "")
                            .replace(/[^0-9]/g, "");

                          return formatted;
                        }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={36}>
                    <Col span={12}>
                      <Input
                        value="Max Usage"
                        disabled
                        className={styles.textInputLabelDisabled}
                      />
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        name={["step2", "max_usage"]}
                        normalize={(value) => {
                          if (value === "") return undefined;
                          const formatted = value
                            .replace(/\./g, "")
                            .replace(/[^0-9]/g, "");

                          return formatted;
                        }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  {promotionType !== 1 && (
                    <Row gutter={36}>
                      <Col span={12}>
                        <Input
                          value="Max Discount Value"
                          disabled
                          className={styles.textInputLabelDisabled}
                        />
                        <div className={styles.textExample}>
                          E.g: For promotion "Get 20% off, up to 10,000Đ", fill
                          in 10.000 in the field{" "}
                          <span className={styles.textExampleBold}>
                            From VND
                          </span>
                        </div>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={["step2", "max_discount_value"]}
                          normalize={(value) => {
                            const rawValue = value
                              .replace(/\./g, "")
                              .replace(/[^0-9]/g, "");
                            const formatted = rawValue.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              "."
                            );
                            return formatted;
                          }}
                        >
                          <Input
                            placeholder="From VND"
                            addonBefore={<>VND</>}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  <Row gutter={36}>
                    <Col span={12}>
                      <Input
                        value="Minimum order value"
                        disabled
                        className={styles.textInputLabelDisabled}
                      />
                      <div className={styles.textExample}>
                        E.g: For promotion "Get 20% off when you spend 100.000Đ
                        or more", fill in 100.000 in the field{" "}
                        <span className={styles.textExampleBold}>From VND</span>
                      </div>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["step2", "minimun_order_value"]}
                        normalize={(value) => {
                          const rawValue = value
                            .replace(/\./g, "")
                            .replace(/[^0-9]/g, "");
                          const formatted = rawValue.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          );
                          return formatted;
                        }}
                      >
                        <Input placeholder="From VND" addonBefore={<>VND</>} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div>
                  <Row gutter={36}>
                    <Col span={12}>
                      <Input
                        value="Buy X"
                        disabled
                        className={styles.textInputLabelDisabled}
                      />
                      <div className={styles.textExample}>
                        E.g: For promotion "Buy 3 Get 5", fill in 3 in the field{" "}
                        <span className={styles.textExampleBold}>Buy</span>
                      </div>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name={["step2", "buy_x"]}
                        normalize={(value) => {
                          if (value === "") return undefined;
                          const formatted = value
                            .replace(/\./g, "")
                            .replace(/[^0-9]/g, "");

                          return formatted;
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please input buy X!",
                          },
                        ]}
                      >
                        <Input addonBefore={<>Buy</>} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={36}>
                    <Col span={12}>
                      <Input
                        value="Get Y"
                        disabled
                        className={styles.textInputLabelDisabled}
                      />
                      <div className={styles.textExample}>
                        E.g: For promotion "Buy 3 Get 5", fill in 5 in the field{" "}
                        <span className={styles.textExampleBold}>Get</span>
                      </div>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name={["step2", "get_y"]}
                        normalize={(value) => {
                          if (value === "") return undefined;
                          const formatted = value
                            .replace(/\./g, "")
                            .replace(/[^0-9]/g, "");

                          return formatted;
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please input get Y!",
                          },
                        ]}
                      >
                        <Input addonBefore={<>Get</>} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
            <div className={styles.applicationBlock}>
              <Typography.Title level={5}>Application</Typography.Title>
              {promotionType !== 4 ? (
                <div>
                  <Row gutter={36}>
                    <Col span={12}>
                      <Input
                        value="Discount value"
                        disabled
                        className={styles.textInputLabelDisabled}
                      />
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={["step2", "discount_value"]}
                        normalize={(value) => {
                          let formatted;
                          if (promotionType === 1) {
                            const rawValue = value
                              .replace(/\./g, "")
                              .replace(/[^0-9]/g, "");
                            formatted = rawValue.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              "."
                            );
                          } else {
                            formatted = value
                              .replace(/\./g, "")
                              .replace(/[^0-9]/g, "");
                          }
                          return formatted;
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please input discount value!",
                          },
                          {
                            validator: (_, value) => {
                              if (promotionType !== 1) {
                                const numericValue = Number(
                                  value?.replace(/\./g, "")
                                );
                                if (numericValue > 100) {
                                  return Promise.reject(
                                    "Percentage discount cannot exceed 100."
                                  );
                                }
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder={`${
                            promotionType === 1 ? "From VND" : "From %"
                          }`}
                          addonBefore={
                            <>{`${promotionType === 1 ? "VND" : "%"}`}</>
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  {showMenuItemSelection && (
                    <Form.Item
                      name={["step2", "menu_item_select_discount"]}
                      rules={[
                        {
                          validator: (_, value) => {
                            if (!value || value.length <= 0) {
                              return Promise.reject("Please select menu item");
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Row>
                        <div className={styles.customTableSelect}>
                          <div className={styles.titleSelectCustom}>
                            <Typography.Title level={5}>
                              Select menu item
                            </Typography.Title>
                            <Button
                              icon={<PlusOutlined />}
                              onClick={() => setShowModalMenuItem(true)}
                            >
                              Select
                            </Button>
                          </div>
                          {showModalMenuItem && (
                            <ModalMenuItem
                              open={showModalMenuItem}
                              width={1000}
                              onCancel={() => setShowModalMenuItem(false)}
                              selectedData={dataMenuItemSeleted.items}
                              selectedDataKey={dataMenuItemSeleted.keys}
                              handleSubmitModal={(items, keys) => {
                                setShowModalMenuItem(false);
                                setDataMenuItemSeleted({
                                  keys,
                                  items,
                                });
                                form.setFieldsValue({
                                  step2: {
                                    menu_item_select_discount: keys,
                                  },
                                });
                                form.validateFields([
                                  ["step2", "menu_item_select_discount"],
                                ]);
                              }}
                            />
                          )}
                          <TableReuse
                            columns={columnsMenuItemNoSort}
                            dataSource={dataMenuItemSeleted.items}
                            rowKey="menuId"
                            pagination={{
                              pageSize: 5,
                            }}
                          />
                        </div>
                      </Row>
                    </Form.Item>
                  )}
                </div>
              ) : (
                <>
                  <Form.Item
                    name={["step2", "menu_item_select_buyX"]}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value || value.length <= 0) {
                            return Promise.reject("Please select menu item!");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <div className={styles.customTableSelect}>
                      <div className={styles.titleSelectCustom}>
                        <Typography.Title level={5}>
                          Select buy X menu item
                        </Typography.Title>
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() =>
                            setShowModalBuyXGetY({
                              buyX: true,
                              getY: false,
                            })
                          }
                        >
                          Select
                        </Button>
                      </div>
                      {showModalBuyXGetY.buyX && (
                        <ModalMenuItem
                          open={showModalBuyXGetY.buyX}
                          width={1000}
                          onCancel={() =>
                            setShowModalBuyXGetY({
                              buyX: false,
                              getY: false,
                            })
                          }
                          selectedData={dataMenuItemSeletedBuyXGetY.BuyX.items}
                          selectedDataKey={
                            dataMenuItemSeletedBuyXGetY.BuyX.keys
                          }
                          handleSubmitModal={(items, keys) => {
                            setShowModalBuyXGetY({
                              buyX: false,
                              getY: false,
                            });
                            setDataMenuItemSeletedBuyXGetY({
                              ...dataMenuItemSeletedBuyXGetY,
                              BuyX: {
                                items,
                                keys,
                              },
                            });
                            form.setFieldsValue({
                              step2: {
                                menu_item_select_buyX: keys,
                              },
                            });
                            form.validateFields([
                              ["step2", "menu_item_select_buyX"],
                            ]);
                          }}
                          singleSelectMode={true}
                        />
                      )}
                      <TableReuse
                        columns={columnsMenuItemNoSort}
                        dataSource={dataMenuItemSeletedBuyXGetY.BuyX.items}
                        rowKey="menuId"
                        pagination={false}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    name={["step2", "menu_item_select_getY"]}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value || value.length <= 0) {
                            return Promise.reject("Please select menu item!");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <div className={styles.customTableSelect}>
                      <div className={styles.titleSelectCustom}>
                        <Typography.Title level={5}>
                          Select get Y menu item
                        </Typography.Title>
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() =>
                            setShowModalBuyXGetY({
                              buyX: false,
                              getY: true,
                            })
                          }
                        >
                          Select
                        </Button>
                      </div>
                      {showModalBuyXGetY.getY && (
                        <ModalMenuItem
                          open={showModalBuyXGetY.getY}
                          width={1000}
                          onCancel={() =>
                            setShowModalBuyXGetY({
                              buyX: false,
                              getY: false,
                            })
                          }
                          selectedData={dataMenuItemSeletedBuyXGetY.GetY.items}
                          selectedDataKey={
                            dataMenuItemSeletedBuyXGetY.GetY.keys
                          }
                          handleSubmitModal={(items, keys) => {
                            setShowModalBuyXGetY({
                              buyX: false,
                              getY: false,
                            });
                            setDataMenuItemSeletedBuyXGetY({
                              ...dataMenuItemSeletedBuyXGetY,
                              GetY: {
                                items,
                                keys,
                              },
                            });
                            form.setFieldsValue({
                              step2: {
                                menu_item_select_getY: keys,
                              },
                            });
                            form.validateFields([
                              ["step2", "menu_item_select_getY"],
                            ]);
                          }}
                          singleSelectMode={true}
                        />
                      )}
                      <TableReuse
                        columns={columnsMenuItemNoSort}
                        dataSource={dataMenuItemSeletedBuyXGetY.GetY.items}
                        rowKey="menuId"
                        pagination={false}
                      />
                    </div>
                  </Form.Item>
                </>
              )}
            </div>
          </div>
        </StepBlock>
      </Form>
    </>
  );
};
export default PromotionForm;
