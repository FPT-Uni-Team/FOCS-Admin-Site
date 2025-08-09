import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const StoreIdHandler = () => {
  const { storeId } = useParams();
  console.log(storeId);
  useEffect(() => {
    if (storeId) {
      localStorage.setItem("storeId", storeId);
    }
  }, [storeId]);

  return null;
};
