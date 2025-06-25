import { Tabs } from "antd";
import type { PromotionPayload } from "../../../type/promotion/promotion";
import GeneralTab from "../../common/TabGeneral/General";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { useForm } from "antd/es/form/Form";
import ConditionApplication from "../../common/TabConditionApplication/ConditionApplication";

interface Props {
  promotionDetail: PromotionPayload;
}

const PromotionDetail: React.FC<Props> = ({ promotionDetail }) => {
  const [form] = useForm();
  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          label: "General Information",
          key: "1",
          children: (
            <ContentInner>
              <GeneralTab dataGeneral={promotionDetail} form={form} />
            </ContentInner>
          ),
        },
        {
          label: "Condition & Application",
          key: "2",
          children: (
            <ContentInner>
              <ConditionApplication dataGeneral={promotionDetail} form={form} />
            </ContentInner>
          ),
        },
      ]}
    />
  );
};

export default PromotionDetail;
