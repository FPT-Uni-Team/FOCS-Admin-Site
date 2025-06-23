import { Form, Input, Select, Button, DatePicker, Row, Col } from "antd";
import React, { useState } from "react";
import type {
  FilterReuseProps,
  SelectConfig,
} from "../../../type/common/common";
import styles from "./FilterReuse.module.scss";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

const FilterReuse: React.FC<FilterReuseProps> = ({
  onFilter,
  selectConfigs = [],
  onSearch,
  isShowFilter = false,
}) => {
  const [showForm, setShowForm] = useState(isShowFilter);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");
  const { RangePicker } = DatePicker;
  const handleFinish = (values: Record<string, unknown>) => {
    onFilter(values);
  };
  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  const renderField = (config: SelectConfig) => {
    const commonProps = {
      placeholder: config.placeholder,
      className: styles.input,
    };

    switch (config.type) {
      case "input":
        return <Input {...commonProps} allowClear />;

      case "select":
        return (
          <Select
            {...commonProps}
            showSearch={config.searchable}
            mode={config.mode}
            options={config.options}
            optionLabelProp="label"
          />
        );

      case "date":
        return <DatePicker {...commonProps} format="DD/MM/YYYY" />;
      case "rangePicker":
        return (
          <RangePicker format="DD/MM/YYYY" className={styles.customSearch} />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.filterContainer}>
      <Row>
        <Col span={8} className={styles.wrapper}>
          <Input
            allowClear
            className={styles.customSearch}
            placeholder="Tìm kiếm theo tên"
            suffix={<SearchOutlined onClick={() => onSearch(searchValue)} />}
            onChange={(e) => setSearchValue(e.target.value.trim())}
            onPressEnter={() => onSearch(searchValue)}
            onClear={() => {
              setSearchValue("");
              onSearch("");
            }}
          />
          {!isShowFilter && (
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowForm((prev) => !prev)}
            >
              Lọc
            </Button>
          )}
        </Col>
      </Row>

      <Collapse
        activeKey={showForm ? "1" : undefined}
        ghost
        className={styles.noHeaderCollapse}
        items={[
          {
            key: "1",
            label: null,
            showArrow: false,
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className={
                  !isShowFilter ? styles.filterForm : styles.filterFormShow
                }
              >
                <Row gutter={[16, 16]}>
                  {selectConfigs.map((select) => (
                    <Col span={24 / selectConfigs.length} key={select.name}>
                      <Form.Item
                        name={select.name}
                        label={select.label}
                        colon={false}
                        className={styles.customSearch}
                      >
                        {renderField(select)}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
                <div className={styles.buttonGroup}>
                  <Form.Item className={styles.formItem}>
                    <Button onClick={handleReset}>Clear</Button>
                  </Form.Item>
                  <Form.Item className={styles.formItem}>
                    <Button type="primary" htmlType="submit">
                      Filter
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            ),
          },
        ]}
      />
    </div>
  );
};

export default FilterReuse;
