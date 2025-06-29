import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
import MenuItemForm from "../../components/menuItem/menuItemForm/MenuItemForm";

const MenuItemCreatePage = () => {
  const [form] = useForm();
  return (
    <>
      <TitleLine title="New Menu Item" onCreate={() => {}} />
      <MenuItemForm form={form} />
    </>
  );
};

export default MenuItemCreatePage;
