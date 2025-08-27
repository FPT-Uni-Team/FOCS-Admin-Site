import { useNavigate, useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchVariantGroupsStart } from "../../store/slices/variant/variantGroupSlice";
import VariantGroupList from "../../components/variant/variantGroupList/VariantGroupList";
import { defaultParams, type ListPageParams } from "../../type/common/common";
import { useCallback, useEffect, useState } from "react";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";
import { useForm } from "antd/es/form/Form";
import {
  createVariantGroupStart,
  resetVariantGroupCreate,
} from "../../store/slices/variant/variantGroupCreateSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import VariantGroupCreateModal from "../../components/variant/VariantGroupCreateModal";

const VariantGroupListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = useCallback(
    async (params: ListPageParams) => {
      dispatch(fetchVariantGroupsStart(params));
    },
    [dispatch]
  );

  const [form] = useForm();
  const { success, error, loading } = useAppSelector(
    (state) => state.variantGroupCreate
  );

  const handleCreateVariantGroup = useCallback(() => {
    const allFormValues = form.getFieldsValue();
    const dataPayload = {
      name: allFormValues.name,
    };
    dispatch(createVariantGroupStart(dataPayload));
    setModalVisible(false);
  }, [dispatch, form]);

  const handleCancel = () => {
    setModalVisible(false);
    navigate(`/${storeId}/variant-groups`);
  };

  useEffect(() => {
    if (success) {
      showNotification("success", "Create variant group success!");
      dispatch(resetVariantGroupCreate());
      fetchData(defaultParams(10));
    }
  }, [dispatch, navigate, success, storeId]);

  useEffect(() => {
    if (error) {
      showNotification("error", error);
      dispatch(resetVariantGroupCreate());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);

  return (
    <>
      <TitleLine
        title="Variant Groups List"
        onCreate={() => {
          setModalVisible(true);
        }}
      />
      <VariantGroupList fetchData={fetchData} />
      <VariantGroupCreateModal
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={handleCreateVariantGroup}
        form={form}
        loading={loading}
      />
    </>
  );
};

export default VariantGroupListPage;
