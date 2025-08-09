import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  type FormInstance,
  Typography,
  Card,
  Tag,
  Button,
  Select,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { WorkshiftDetailResponseActual } from "../../../type/workshift/workshift";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { fetchStaffListStart } from "../../../store/slices/staff/staffListSlice";
import type { StaffDataType } from "../../../type/staff/staff";


import styles from "./WorkshiftDetail.module.scss";

interface Props {
  form: FormInstance;
  workshiftDetail: WorkshiftDetailResponseActual | null;
  mode?: "View" | "Update";
}

const WorkshiftDetail: React.FC<Props> = ({ form, workshiftDetail, mode = "View" }) => {
  const dispatch = useAppDispatch();
  const isEditMode = mode === "Update";
  const { staff } = useAppSelector((state) => state.staffList);
  const [staffOptions, setStaffOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    dispatch(fetchStaffListStart({
      page: 1,
      page_size: 100,
      search_by: "",
      search_value: "",
      sort_by: "",
      sort_order: "",
      filters: {},
    }));
  }, [dispatch]);

  useEffect(() => {
    if (staff.length > 0) {
      const options = staff.map((staffMember: StaffDataType) => ({
        label: `${staffMember.first_name} ${staffMember.last_name}`,
        value: staffMember.id,
      }));
      setStaffOptions(options);
    }
  }, [staff]);

  useEffect(() => {
    if (workshiftDetail) {
      form.setFieldsValue({
        workDate: workshiftDetail.workDate ? dayjs(workshiftDetail.workDate) : undefined,
        shift: (workshiftDetail.shift || []).map((shift) => ({
          staffId: shift.staffId,
          staffName: shift.staffName,
          startTime: shift.startTime,
          endTime: shift.endTime,
        })),
      });
    }
  }, [workshiftDetail, form]);

  return (
    <Form form={form} layout="vertical" name="workshiftDetailForm" colon={true}>
      <Typography.Title level={4}>Workshift Information</Typography.Title>
      
      <Row gutter={24}>
        <Col span={12}>
                     <Form.Item 
             label="Work Date" 
             name="workDate"
             rules={[{ required: true, message: "Please select work date!" }]}
           >
                         <DatePicker
               placeholder="Select work date"
               disabled={!isEditMode}
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
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  title={`Shift ${name + 1}`}
                                     
                                     extra={
                      isEditMode && (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ color: "#ff4d4f" }}
                        />
                      )
                    }
                   className={`${styles.shiftItemCard} mb-4`}
                 >
                                    <Row gutter={16}>
                    <Col span={8}>
                                             <Form.Item
                         {...restField}
                         name={[name, "staffName"]}
                         label="Staff Name"
                         rules={[{ required: true, message: "Please select staff!" }]}
                       >
                                                 {isEditMode ? (
                           <Select
                             placeholder="Select staff"
                             options={staffOptions}
                             className={styles.staffSelect}
                             onChange={(value) => {
                               const staffOption = staffOptions.find(option => option.value === value);
                               form.setFieldValue(['shift', name, 'staffName'], staffOption?.label || '');
                             }}
                           />
                         ) : (
                           <Input
                             placeholder="Staff name"
                             disabled={true}
                             className={styles.staffInput}
                             value={form.getFieldValue(['shift', name, 'staffName']) || 'Loading...'}
                           />
                         )}
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
                                 disabled={!isEditMode}
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
                                 disabled={!isEditMode}
                                 className={styles.timeInput}
                               />
                             </Form.Item>
                     </Col>
                  </Row>
                </Card>
                             ))}
                              {isEditMode && (
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
  );
};

export default WorkshiftDetail; 