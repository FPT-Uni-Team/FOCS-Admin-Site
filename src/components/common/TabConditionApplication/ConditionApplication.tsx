import { useEffect, useState, type FC } from "react";
import {
  promotionApplyOption,
  type PromotionPayload,
} from "../../../type/promotion/promotion";
import { Col, Form, Input, Row, Select, Typography } from "antd";
import type { FormInstance } from "antd";
import TableReuse from "../Table/TableReuse";
import { columnsMenuItemNoSort } from "../Columns/Colums";
import styles from "../../promotion/promotionForm/PromotionForm.module.scss";
import type {
  SelectedTableItems,
  SelectedTableItemsBuyXGetY,
} from "../../promotion/promotionForm/PromotionForm";
import type { MenuListDataType } from "../../../type/menu/menu";

interface Props {
  dataGeneral: PromotionPayload;
  form: FormInstance;
}

const ConditionApplication: FC<Props> = ({ dataGeneral, form }) => {
  const promotionScope = Form.useWatch(["step2", "promotion_scope"], form);
  const promotionType = Form.useWatch(["step1", "promotionType"], form);
  const [dataMenuItemSeleted, setDataMenuItemSeleted] = useState<
    SelectedTableItems<MenuListDataType>
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

  const showMenuItemSelection = promotionScope === 0;

  useEffect(() => {
    if (dataGeneral) {
      form.setFieldsValue({
        step2: {
          promotion_scope: dataGeneral.promotion_scope,
          minimun_item_in_cart: dataGeneral.minimum_item_quantity,
          max_usage: dataGeneral.max_usage,
          max_discount_value: dataGeneral.max_discount_value,
          minimun_order_value: dataGeneral.minimum_order_amount,
          buy_x: dataGeneral.promotion_item_condition?.buy_quantity,
          get_y: dataGeneral.promotion_item_condition?.get_quantity,
          discount_value: dataGeneral.discount_value,
          menu_item_select_discount: dataGeneral?.accept_for_items,
          menu_item_select_buyX:
            dataGeneral?.promotion_item_condition?.buy_item_id,
          menu_item_select_getY:
            dataGeneral?.promotion_item_condition?.get_item_id,
        },
      });
      setDataMenuItemSeleted({
        keys: dataGeneral.accept_for_items || [],
        items: dataGeneral.accept_for_items_lists || [],
      });
      setDataMenuItemSeletedBuyXGetY({
        BuyX: {
          items: dataGeneral?.promotion_item_condition?.buy_item
            ? [dataGeneral.promotion_item_condition.buy_item]
            : [],
          keys: dataGeneral?.promotion_item_condition?.buy_item_id
            ? [dataGeneral.promotion_item_condition.buy_item_id]
            : [],
        },
        GetY: {
          items: dataGeneral?.promotion_item_condition?.get_item
            ? [dataGeneral.promotion_item_condition.get_item]
            : [],
          keys: dataGeneral?.promotion_item_condition?.get_item_id
            ? [dataGeneral.promotion_item_condition.get_item_id]
            : [],
        },
      });
    }
  }, [dataGeneral, form]);
  return (
    <Form
      form={form}
      layout="vertical"
      name="promotionDetailFormApplication"
      colon={true}
    >
      <div className={styles.conditionApplicationBlock}>
        <div className={styles.conditionBlock}>
          <Typography.Title level={5}>Condition</Typography.Title>
          {promotionType !== 4 ? (
            <div>
              <Row gutter={36}>
                <Col span={12}>
                  <Form.Item name={["step2", "promotion_scope"]}>
                    <Select options={promotionApplyOption} disabled />
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
                    <Input disabled />
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
                    <Input disabled />
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
                      E.g: For promotion "Get 20% off, up to 10,000Đ", fill in
                      10.000 in the field{" "}
                      <span className={styles.textExampleBold}>From VND</span>
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
                      <Input addonBefore={<>VND</>} disabled />
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
                    E.g: For promotion "Get 20% off when you spend 100.000Đ or
                    more", fill in 100.000 in the field{" "}
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
                    <Input addonBefore={<>VND</>} disabled />
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
                  >
                    <Input addonBefore={<>Buy</>} disabled />
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
                  >
                    <Input addonBefore={<>Get</>} disabled />
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
                  >
                    <Input
                      addonBefore={
                        <>{`${promotionType === 1 ? "VND" : "%"}`}</>
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              {showMenuItemSelection && (
                <Form.Item name={["step2", "menu_item_select_discount"]}>
                  <Row>
                    <div className={styles.customTableSelect}>
                      <div className={styles.titleSelectCustom}>
                        <Typography.Title level={5}>
                          Select menu item
                        </Typography.Title>
                      </div>

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
              <Form.Item name={["step2", "menu_item_select_buyX"]}>
                <div className={styles.customTableSelect}>
                  <div className={styles.titleSelectCustom}>
                    <Typography.Title level={5}>
                      Select buy X menu item
                    </Typography.Title>
                  </div>

                  <TableReuse
                    columns={columnsMenuItemNoSort}
                    dataSource={dataMenuItemSeletedBuyXGetY.BuyX.items}
                    rowKey="menuId"
                    pagination={false}
                  />
                </div>
              </Form.Item>
              <Form.Item name={["step2", "menu_item_select_getY"]}>
                <div className={styles.customTableSelect}>
                  <div className={styles.titleSelectCustom}>
                    <Typography.Title level={5}>
                      Select get Y menu item
                    </Typography.Title>
                  </div>
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
    </Form>
  );
};

export default ConditionApplication;
