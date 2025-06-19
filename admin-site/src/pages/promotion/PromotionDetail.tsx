import { useForm } from "antd/es/form/Form";
import TitleLine from "../../components/common/Title/TitleLine";
// import PromotionDetail from "../../components/promotion/promotionDetail/PromotionDetail";
import PromotionForm from "../../components/promotion/promotionForm/PromotionForm";
import ContentInner from "../../layouts/MainLayout/ContentInner/ContentInner";

const PromotionDetailPage = () => {
  const [form] = useForm();
  return (
    <>
      <TitleLine
        title="huỳnh"
        status="active"
        hasMoreAction
        onAction={() => {}}
        onEdit={() => {}}
        isActive={false}
      />
      <ContentInner>
        <PromotionForm title="Create Promotion" form={form} />
      </ContentInner>
    </>
  );
};

export default PromotionDetailPage;
