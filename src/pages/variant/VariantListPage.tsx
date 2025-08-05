import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import { fetchVariantsStart } from "../../store/slices/variant/variantListSlice";
import VariantList from "../../components/variant/variantList/VariantList";
import type { ListPageParams } from "../../type/common/common";
import { useCallback } from "react";

const VariantListPage = () => {
  const dispatch = useAppDispatch();
  
  const fetchData = useCallback(
    async (params: ListPageParams) => {
      dispatch(fetchVariantsStart(params));
    },
    [dispatch]
  );
  
  return (
    <>
                <TitleLine
            title="Variants List"
          />
      <VariantList fetchData={fetchData} />
    </>
  );
};

export default VariantListPage;