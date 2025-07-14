import { useNavigate } from "react-router-dom";
import TitleLine from "../../components/common/Title/TitleLine";
import { useAppDispatch } from "../../hooks/redux";
import type { ListPageParams } from "../../type/common/common";
import { fetchCategoriesStart } from "../../store/slices/category/categoryListSlice";
import CategoryList from "../../components/category/categoryList/CategoryList";

const CategoryPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchData = async (params: ListPageParams) => {
    dispatch(fetchCategoriesStart(params));
  };
  return (
    <>
      <TitleLine
        title="Category List"
        onCreate={() => {
          navigate("/categories/create");
        }}
      />
      <CategoryList fetchData={fetchData} />
      <>Cuong</>
    </>
  );
};

export default CategoryPage;
