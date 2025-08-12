import {
  Col,
  Form,
  Row,
  Switch,
  TimePicker,
  InputNumber,
  type FormInstance,
  Select,
} from "antd";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";
import { useEffect } from "react";
import type { StoreConfig } from "../../services/storeService";
import dayjs from "dayjs";

interface Props {
  mode?: "Update" | "Detail";
  form: FormInstance;
  initData?: StoreConfig;
}

const TIME_FORMAT = "HH:mm:ss";

const StoreSettingDetail: React.FC<Props> = ({
  mode = "Update",
  form,
  initData,
}) => {
  useEffect(() => {
    if (initData) {
      const processedData = {
        ...initData,
        open_time: initData.open_time
          ? dayjs(initData.open_time, TIME_FORMAT)
          : null,
        close_time: initData.close_time
          ? dayjs(initData.close_time, TIME_FORMAT)
          : null,
      };
      form.setFieldsValue(processedData);
    }
  }, [initData, form]);

  return (
    <Form form={form} layout="vertical" name="storeSettingForm" colon>
      <ContentInner>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Open Time"
              name="open_time"
              rules={[{ required: true, message: "Please select open time" }]}
            >
              <TimePicker
                format="HH:mm"
                disabled={mode === "Detail"}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Close Time"
              name="close_time"
              rules={[
                { required: true, message: "Please select close time" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const openTime = getFieldValue("open_time");
                    if (!value || !openTime || value.isAfter(openTime)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Close time must be later than open time")
                    );
                  },
                }),
              ]}
              dependencies={["open_time"]}
            >
              <TimePicker
                format="HH:mm"
                disabled={mode === "Detail"}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          {/* <Col span={12}>
              <Form.Item
                label="Currency"
                name="currency"
                rules={[{ required: true, message: "Please input currency" }]}
              >
                <Input disabled={mode === "Detail"} placeholder="e.g. USD" />
              </Form.Item>
            </Col> */}

          <Col span={12}>
            <Form.Item
              label="Payment Config"
              name="payment_config"
              rules={[
                { required: true, message: "Please select payment config" },
              ]}
            >
              <Select disabled={mode === "Detail"}>
                <Select.Option value={0}>Cash</Select.Option>
                <Select.Option value={1}>Card</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Discount Strategy"
              name="discount_strategy"
              rules={[
                {
                  required: true,
                  message: "Please select discount strategy",
                },
              ]}
            >
              <Select disabled={mode === "Detail"}>
                <Select.Option value={0}>Coupon Only</Select.Option>
                <Select.Option value={1}>Promotion Only</Select.Option>
                <Select.Option value={2}>Coupon Then Promotion</Select.Option>
                <Select.Option value={3}>Max Discount Only</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Self Service"
              name="is_self_service"
              valuePropName="checked"
            >
              <Switch disabled={mode === "Detail"} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Allow Combine Promotion Coupon"
              name="allow_combine_promotion_coupon"
              valuePropName="checked"
            >
              <Switch disabled={mode === "Detail"} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Spending Rate"
              name="spending_rate"
              rules={[
                { required: true, message: "Please input spending rate" },
              ]}
            >
              <InputNumber
                addonBefore={<>%</>}
                min={1}
                max={100}
                disabled={mode === "Detail"}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </ContentInner>
    </Form>
  );
};

export default StoreSettingDetail;
