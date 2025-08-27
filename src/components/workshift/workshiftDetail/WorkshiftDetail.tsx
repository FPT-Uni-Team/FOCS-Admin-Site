import React, { useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  type FormInstance,
  Card,
  Tag,
} from "antd";
import dayjs from "dayjs";

import styles from "./WorkshiftDetail.module.scss";

interface Props {
  form: FormInstance;
  workshiftDetail: any | null;
}

const WorkshiftDetail: React.FC<Props> = ({ form, workshiftDetail }) => {
  useEffect(() => {
    if (workshiftDetail) {
      form.setFieldsValue({
        workDate: workshiftDetail.workDate
          ? dayjs(workshiftDetail.workDate)
          : undefined,
        shift: (workshiftDetail.shift || []).map((shift: any) => ({
          staffs: shift.staffs?.map((staff: any) => staff.staffId) || [],
          startTime: shift.startTime,
          endTime: shift.endTime,
          _staffsData: shift.staffs || [],
        })),
      });
    }
  }, [workshiftDetail, form]);

  return (
    <Form form={form} layout="vertical" name="workshiftDetailForm" colon={true}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="Work Date" name="workDate">
            <DatePicker
              placeholder="Select work date"
              disabled
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Total Shifts">
            <Tag color="blue" className={styles.timeTag}>
              {workshiftDetail?.shift?.length || 0} shifts
            </Tag>
          </Form.Item>
        </Col>
      </Row>

      <Card title="Shift Details" className={styles.shiftCard}>
        <Form.List name="shift">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const shiftData = workshiftDetail?.shift?.[name];
                const staffsData = shiftData?.staffs || [];

                return (
                  <Card
                    key={key}
                    size="small"
                    title={`Shift ${name + 1}`}
                    className={styles.shiftItemCard}
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="Staff(s)">
                          {/* Input với các Tags bên trong */}
                          <div
                            style={{
                              border: "1px solid #d9d9d9",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              minHeight: "32px",
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "4px",
                              backgroundColor: "#fff",
                            }}
                          >
                            {staffsData.length > 0 ? (
                              staffsData.map((staff: any) => (
                                <Tag
                                  key={staff.staffId}
                                  color="blue"
                                  style={{ margin: 0 }}
                                >
                                  {staff.name}
                                </Tag>
                              ))
                            ) : (
                              <span style={{ color: "#999", fontSize: "14px" }}>
                                No staff assigned
                              </span>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "startTime"]}
                          label="Start Time"
                        >
                          <Input
                            type="time"
                            disabled
                            className={styles.timeInput}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "endTime"]}
                          label="End Time"
                        >
                          <Input
                            type="time"
                            disabled
                            className={styles.timeInput}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </>
          )}
        </Form.List>
      </Card>
    </Form>
  );
};

export default WorkshiftDetail;
