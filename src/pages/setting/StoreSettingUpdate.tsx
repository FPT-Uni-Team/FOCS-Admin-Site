import { useForm } from "antd/es/form/Form";
import StoreSettingDetail from "../../components/setting/StoreSettingDetail";
import TitleLine from "../../components/common/Title/TitleLine";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import orderService, { type StoreConfig } from "../../services/storeService";
import { useAppDispatch } from "../../hooks/redux";
import {
  hideLoading,
  showLoading,
} from "../../store/slices/loading/loadingSlice";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const StoreSettingUpdate = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [storeData, setStoreData] = useState<StoreConfig | null>(null);

  const handleUpdatePromotion = async () => {
    try {
      const values = await form.validateFields();
      dispatch(showLoading());
      const payload = { ...storeData!, ...values };

      ["open_time", "close_time"].forEach((key) => {
        const timeObj = payload[key];
        if (
          timeObj &&
          typeof timeObj === "object" &&
          timeObj.$H !== undefined
        ) {
          const hh = String(timeObj.$H).padStart(2, "0");
          const mm = String(timeObj.$m).padStart(2, "0");
          const ss = String(timeObj.$s || 0).padStart(2, "0");
          payload[key] = `${hh}:${mm}:${ss}`;
        }
      });

      await orderService.updateStoreSetting(payload);
      showNotification("success", "Update store setting success!");
      navigate(`/${localStorage.getItem("storeId")}/setting`);
    } catch (error) {
      console.error(error);
      showNotification("error", "Update store setting failed!");
    } finally {
      dispatch(hideLoading());
    }
  };

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
        createButtonText="Update"
        onCreate={handleUpdatePromotion}
      />
      {storeData && (
        <StoreSettingDetail form={form} initData={storeData} mode="Update" />
      )}
    </>
  );
};

export default StoreSettingUpdate;
