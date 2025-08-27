import { useForm } from "antd/es/form/Form";
import StoreSettingDetail from "../../components/setting/StoreSettingDetail";
import TitleLine from "../../components/common/Title/TitleLine";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import orderService from "../../services/storeService";
import type { StoreConfig } from "../../services/storeService";
import { useAppDispatch } from "../../hooks/redux";
import {
  hideLoading,
  showLoading,
} from "../../store/slices/loading/loadingSlice";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const StoreSettingPage = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [storeData, setStoreData] = useState<StoreConfig | null>(null);

  useEffect(() => {
    const fetchStoreSetting = async () => {
      try {
        dispatch(showLoading());
        const res = await orderService.getDetailStoreSetting();
        setStoreData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchStoreSetting();
  }, [dispatch, form]);

  useEffect(() => {
    dispatch(setBreadcrumb([]));
  }, [dispatch]);

  return (
    <>
      <TitleLine
        title="Store Setting"
        onEdit={() =>
          navigate(`/${sessionStorage.getItem("storeId")}/setting/update`)
        }
      />
      {storeData && (
        <StoreSettingDetail form={form} initData={storeData} mode="Detail" />
      )}
    </>
  );
};

export default StoreSettingPage;
