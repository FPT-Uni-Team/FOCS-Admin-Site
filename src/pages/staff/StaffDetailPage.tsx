import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "antd";

import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

import { fetchStaffDetailStart } from "../../store/slices/staff/staffDetailSlice";
import StaffForm from "../../components/staff/staffForm/StaffForm";
import { showNotification } from "../../components/common/Notification/ToastCustom";
import {
  deleteStaffStart,
  clearDeleteStaffState,
} from "../../store/slices/staff/staffDeleteSlice";
import { setBreadcrumb } from "../../store/slices/breadcumb/breadcrumbSlice";

const StaffDetailPage = () => {
  const [form] = useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { staffId } = useParams();
  const { staff } = useAppSelector((state) => state.staffDetail);
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useAppSelector((state) => state.staffDelete);

  const handleDeleteStaff = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (staffId) {
      dispatch(fetchStaffDetailStart(staffId));
    }
  }, [dispatch, staffId]);

  useEffect(() => {
    if (deleteSuccess) {
      showNotification("success", "Delete staff success!");
      navigate(`/${sessionStorage.getItem("storeId")}/staffs`);
      dispatch(clearDeleteStaffState());
    }
  }, [deleteSuccess, navigate, dispatch]);

  useEffect(() => {
    if (deleteError) {
      showNotification("error", deleteError);
      dispatch(clearDeleteStaffState());
    }
  }, [deleteError, dispatch]);

  useEffect(() => {
    dispatch(
      setBreadcrumb([
        {
          name: "Staffs",
          link: `/${sessionStorage.getItem("storeId")}/staffs`,
        },
        { name: `${staffId}` },
      ])
    );
  }, [staffId, dispatch]);

  return (
    <>
      <TitleLine
        title={`${staff.first_name} ${staff.last_name}`}
        onEdit={() =>
          navigate(
            `/${sessionStorage.getItem("storeId")}/staffs/update/${staffId}`
          )
        }
        onDelete={handleDeleteStaff}
        hasMoreAction
        deleteLoading={deleteLoading}
      />
      <StaffForm form={form} mode="Detail" initData={staff} />

      <Modal
        title="Delete Staff"
        open={isDeleteModalOpen}
        onOk={() => {
          setIsDeleteModalOpen(false);
          dispatch(deleteStaffStart({ staffId: staffId || "" }));
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this staff member? This action cannot
          be undone.
        </p>
      </Modal>
    </>
  );
};

export default StaffDetailPage;
