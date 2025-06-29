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
  promotionApplyOption,
  promotionOptions,
  type PromotionPayload,
} from "../../../type/promotion/promotion";
import { useEffect, useState, type FC } from "react";
import StepBlock from "../../common/Step/StepBlock";
import { PlusOutlined } from "@ant-design/icons";
import ModalMenuItem from "../../common/modal/ModalMenuItem";
import TableReuse from "../../common/Table/TableReuse";
import type { MenuListDataType } from "../../../type/menu/menu";
import {
  columnsCouponListNoSort,
  columnsMenuItemNoSort,
} from "../../common/Columns/Colums";
import clsx from "clsx";
import ModalCouponList from "../../common/modal/ModalCouponList";
import type { CouponAdminDTO } from "../../../type/coupon/coupon";

interface Props {
  title?: string;
  mode?: "Update" | "Create";
  form: FormInstance;
  step: number;
  initData?: PromotionPayload;
  canEditField?: number;
}

export interface SelectedTableItems<T> {
  keys: React.Key[];
  items: T[];
}

export interface SelectedTableItemsBuyXGetY {
  BuyX: SelectedTableItems<MenuListDataType>;
  GetY: SelectedTableItems<MenuListDataType>;
}

const PromotionForm: FC<Props> = ({
  form,
  step,
  mode = "Create",
  initData,
  canEditField,
}) => {
  const promotionScope = Form.useWatch(["step2", "promotion_scope"], form);
  const useCoupon = Form.useWatch(["step1", "use_coupon"], form);
  const promotionType = Form.useWatch(["step1", "promotionType"], form);
  const showMenuItemSelection = promotionScope === 0;
  const disableField =
    mode == "Update" &&
    (canEditField == 0 ? true : canEditField == 2 ? false : true);
  const disableFieldEndDate =
    mode == "Update" && (canEditField == 0 ? true : false);
  const [showModalMenuItem, setShowModalMenuItem] = useState<boolean>(false);
  const [showModalCoupon, setShowModalCoupon] = useState<boolean>(false);
  const [showModalBuyXGetY, setShowModalBuyXGetY] = useState({
    buyX: false,
    getY: false,
  });
  const [dataMenuItemSeleted, setDataMenuItemSeleted] = useState<
    SelectedTableItems<MenuListDataType>
  >({
    keys: [],
    items: [],
  });

  const [dataCouponSeleted, setDataCouponSeleted] = useState<
    SelectedTableItems<CouponAdminDTO>
  >({
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

  useEffect(() => {
    if (initData) {
      form.setFieldsValue({
        step1: {
          promotionName: initData.title,
          description: initData?.description,
          start_date: dayjs(initData.start_date),
          end_date: dayjs(initData.end_date),
          promotionType: initData.promotion_type,
          use_other_promotion: initData.can_apply_combine,
          use_coupon: initData.coupon_ids && initData?.coupon_ids?.length > 0,
          use_coupon_list: initData?.coupon_ids,
        },
        step2: {
          promotion_scope: initData.promotion_scope,
          minimun_item_in_cart: initData?.minimum_item_quantity,
          max_usage: initData?.max_usage,
          max_discount_value: initData?.max_discount_value,
          minimun_order_value: initData?.minimum_order_amount,
          buy_x: String(initData.promotion_item_condition?.buy_quantity),
          get_y: String(initData.promotion_item_condition?.get_quantity),
          discount_value: initData?.discount_value,
          menu_item_select_discount: initData?.accept_for_items,
          menu_item_select_buyX: [
            initData?.promotion_item_condition?.buy_item_id,
          ],
          menu_item_select_getY: [
            initData?.promotion_item_condition?.get_item_id,
          ],
        },
      });
      setDataMenuItemSeleted({
        keys: initData.accept_for_items || [],
        items: initData.accept_for_items_lists || [],
      });
      setDataCouponSeleted({
        keys: initData?.coupon_ids || [],
        items: initData?.coupon_lists || [],
      });
      setDataMenuItemSeletedBuyXGetY({
        BuyX: {
          items: initData?.promotion_item_condition?.buy_item
            ? [initData.promotion_item_condition.buy_item]
            : [],
          keys: initData?.promotion_item_condition?.buy_item_id
            ? [initData.promotion_item_condition.buy_item_id]
            : [],
        },
        GetY: {
          items: initData?.promotion_item_condition?.get_item
            ? [initData.promotion_item_condition.get_item]
            : [],
          keys: initData?.promotion_item_condition?.get_item_id
            ? [initData.promotion_item_condition.get_item_id]
            : [],
        },
      });
    }
  }, [initData, form]);

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
                <Input
                  placeholder="Enter promotion name"
                  disabled={disableField}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={36}>
            <Col span={24}>
              <Form.Item label="Description" name={["step1", "description"]}>
                <TextArea
                  rows={4}
                  placeholder="Enter promotion description"
                  disabled={disableField}
                />
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
                  format="DD/MM/YYYY HH:mm"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={(current) => getDisabledTime(current)}
                  style={{ width: "100%" }}
                  disabled={disableField}
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
                  format="DD/MM/YYYY HH:mm"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  disabledTime={(current) => getDisabledTime(current)}
                  style={{ width: "100%" }}
                  disabled={disableFieldEndDate}
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
                  onChange={() => {
                    form.setFieldValue(["step2", "discount_value"], undefined);
                  }}
                  placeholder="Select promotion type"
                  options={promotionOptions}
                  disabled={disableField}
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
                <Switch disabled={disableField} />
              </Form.Item>
              <div>Use with other promotions</div>
            </div>
            <div className={styles.flexClass}>
              <Form.Item
                name={["step1", "use_coupon"]}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch disabled={disableField} />
              </Form.Item>
              <div>Use coupon for promotion</div>
            </div>
          </Space>
          {useCoupon && (
            <Form.Item
              name={["step1", "use_coupon_list"]}
              rules={[
                {
                  validator: (_, value) => {
                    console.log("pass", value);
                    if (!value || value.length <= 0) {
                      return Promise.reject("Please select coupon!");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Row>
                <div
                  className={clsx(styles.customTableSelect, styles.marginItem)}
                >
                  <div className={styles.titleSelectCustom}>
                    <Typography.Title level={5}>Select Coupon</Typography.Title>
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => setShowModalCoupon(true)}
                      disabled={disableField}
                    >
                      Select
                    </Button>
                  </div>
                  {showModalCoupon && (
                    <>
                      <ModalCouponList
                        open={showModalCoupon}
                        width={1000}
                        onCancel={() => setShowModalCoupon(false)}
                        selectedData={dataCouponSeleted.items}
                        selectedDataKey={dataCouponSeleted.keys}
                        handleSubmitModal={(items, keys) => {
                          setShowModalCoupon(false);
                          setDataCouponSeleted({
                            keys,
                            items,
                          });
                          form.setFieldsValue({
                            step1: {
                              use_coupon_list: keys,
                            },
                          });
                          form.validateFields([["step1", "use_coupon_list"]]);
                        }}
                      />
                    </>
                  )}
                  <TableReuse
                    columns={columnsCouponListNoSort}
                    dataSource={dataCouponSeleted.items}
                    rowKey="id"
                    pagination={{
                      pageSize: 5,
                    }}
                  />
                </div>
              </Row>
            </Form.Item>
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
                          disabled={disableField}
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
                        <Input disabled={disableField} />
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
                        <Input disabled={disableField} />
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
                            disabled={disableField}
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
                        <Input
                          placeholder="From VND"
                          addonBefore={<>VND</>}
                          disabled={disableField}
                        />
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
                        <Input addonBefore={<>Buy</>} disabled={disableField} />
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
                        <Input addonBefore={<>Get</>} disabled={disableField} />
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
                                  String(value)?.replace(/\./g, "")
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
                          disabled={disableField}
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
                              disabled={disableField}
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
                          disabled={disableField}
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
                          disabled={disableField}
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
