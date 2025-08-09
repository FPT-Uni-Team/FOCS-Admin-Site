import { useNavigate, useParams } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import { fetchVariantGroupsStart } from "../../store/slices/variant/variantGroupSlice";
import VariantGroupList from "../../components/variant/variantGroupList/VariantGroupList";
import type { ListPageParams } from "../../type/common/common";
import { useCallback } from "react";

const VariantGroupListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams();
  
  const fetchData = useCallback(
    async (params: ListPageParams) => {
      dispatch(fetchVariantGroupsStart(params));
    },
    [dispatch]
  );
  
  return (
    <>
      <TitleLine
        title="Variant Groups List"
        onCreate={() => {
          navigate(`/${storeId}/variant-groups/create`);
        }}
      />
      <VariantGroupList fetchData={fetchData} />
    </>
  );
};

export default VariantGroupListPage;