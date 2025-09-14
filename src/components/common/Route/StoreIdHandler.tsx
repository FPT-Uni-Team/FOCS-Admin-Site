import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const StoreIdHandler = () => {
  const { storeId } = useParams();
  console.log("StoreIdHandler storeId:", storeId);
  useEffect(() => {
    if (storeId) {
      sessionStorage.setItem("storeId", storeId);
    }
  }, [storeId]);
  return null;
};
