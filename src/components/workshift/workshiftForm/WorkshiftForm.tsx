import { Col, Form, Input, Row, Select, DatePicker, Button, Card } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import type { FormInstance } from "antd/es/form";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { fetchStaffListStart } from "../../../store/slices/staff/staffListSlice";
import type { StaffDataType } from "../../../type/staff/staff";
import dayjs from "dayjs";

import styles from "./WorkshiftForm.module.scss";

interface Props {
  mode?: "Create" | "Update" | "Detail";
  form: FormInstance;
  initData?: any;
}

const WorkshiftForm: React.FC<Props> = ({ mode = "Create", form, initData }) => {
  const dispatch = useAppDispatch();
  const isDetail = mode === "Detail";
  const isUpdate = mode === "Update";

  const { staff } = useAppSelector((state) => state.staffList);

  useEffect(() => {
    // Fetch staff list for dropdown
    dispatch(fetchStaffListStart({
      page: 1,
      page_size: 100,
      search_by: "",
      search_value: "",
      sort_by: "",
      sort_order: "",
      filters: {},
    }));
  }, []);

  useEffect(() => {
    if (initData && (isUpdate || isDetail)) {
      form.setFieldsValue({
        workDate: initData.workDate ? dayjs(initData.workDate) : undefined,
        shift: (initData.shift || []).map((shift: any) => ({
          staffId: shift.staffId,
          startTime: shift.startTime,
          endTime: shift.endTime,
        })),
      });
    }
  }, [initData, form, isUpdate, isDetail]);

  const staffOptions = staff.map((staffMember: StaffDataType) => ({
    label: `${staffMember.first_name} ${staffMember.last_name}`,
    value: staffMember.id,
  }));

  return (
    <ContentInner style={{ minHeight: "fit-content" }}>
      <Form form={form} layout="vertical" name="workshiftForm" colon={true} className={styles.workshiftForm}>
        <Row gutter={36}>
          <Col span={12}>
            <Form.Item
              label="Work Date"
              name="workDate"
              rules={[{ required: true, message: "Please select work date!" }]}
            >
              <DatePicker
                placeholder="Select work date"
                disabled={isDetail}
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                className={styles.datePicker}
              />
            </Form.Item>
          </Col>
        </Row>

        <Card title="Shifts" className="mb-4">
          <Form.List name="shift">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    title={`Shift ${name + 1}`}
                    extra={
                      !isDetail && (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ color: "#ff4d4f" }}
                        />
                      )
                    }
                    className={`${styles.shiftCard} mb-4`}
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                                                 <Form.Item
                           {...restField}
                           name={[name, "staffId"]}
                           label="Staff Name"
                           rules={[{ required: true, message: "Please select staff!" }]}
                         >
                          <Select
                            placeholder="Select staff"
                            options={staffOptions}
                            disabled={isDetail}
                            showSearch
                            filterOption={(input, option) =>
                              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                            className={styles.staffSelect}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "startTime"]}
                          label="Start Time"
                          rules={[{ required: true, message: "Please enter start time!" }]}
                        >
                          <Input
                            type="time"
                            placeholder="HH:MM"
                            disabled={isDetail}
                            className={styles.timeInput}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "endTime"]}
                          label="End Time"
                          rules={[{ required: true, message: "Please enter end time!" }]}
                        >
                          <Input
                            type="time"
                            placeholder="HH:MM"
                            disabled={isDetail}
                            className={styles.timeInput}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                {!isDetail && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      className={styles.addShiftButton}
                    >
                      Add Shift
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Card>
      </Form>
    </ContentInner>
  );
};

export default WorkshiftForm; 