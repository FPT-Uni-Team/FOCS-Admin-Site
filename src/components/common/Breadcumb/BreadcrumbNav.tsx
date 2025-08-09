import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux";

export const BreadcrumbNav = () => {
  const items = useAppSelector((state) => state.breadcrumb.items);
  const navigate = useNavigate();

  return (
    <Breadcrumb>
      {items.map((item, idx) => (
        <Breadcrumb.Item key={idx}>
          {item.link ? (
            <span
              style={{ cursor: "pointer", color: "#1677ff" }}
              onClick={() => navigate(item.link!)}
            >
              {item.name}
            </span>
          ) : (
            item.name
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
