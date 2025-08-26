import { useForm } from "antd/es/form/Form";
import VariantGroupCreateModal from "../../components/variant/VariantGroupCreateModal";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  createVariantGroupStart,
  resetVariantGroupCreate,
} from "../../store/slices/variant/variantGroupCreateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { useNavigate, useParams } from "react-router-dom";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const VariantGroupCreatePage = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { success, error, loading } = useAppSelector(
    (state) => state.variantGroupCreate
  );
  const [modalVisible, setModalVisible] = useState(true);

  const handleCreateVariantGroup = useCallback(() => {
    const allFormValues = form.getFieldsValue();
    const dataPayload = {
      name: allFormValues.name,
    };
    dispatch(createVariantGroupStart(dataPayload));
  }, [dispatch, form]);

  const handleCancel = () => {
    setModalVisible(false);
    navigate(`/${storeId}/variant-groups`);
  };

  useEffect(() => {
    if (success) {
      showNotification("success", "Create variant group success!");
      dispatch(resetVariantGroupCreate());
      setModalVisible(false);
      navigate(`/${storeId}/variant-groups`);
    }
  }, [dispatch, navigate, success, storeId]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetVariantGroupCreate());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Variant Groups",
          link: `/${localStorage.getItem("storeId")}/variant-groups`,
        },
        { name: "New Variant Group" },
      ])
    );
  }, [dispatch]);

  return (
    <VariantGroupCreateModal
      visible={modalVisible}
      onCancel={handleCancel}
      onOk={handleCreateVariantGroup}
      form={form}
      loading={loading}
    />
  );
};

export default VariantGroupCreatePage;
