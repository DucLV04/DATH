import React,{useState,useEffect} from "react";
import Header from "../../component/Header";
import HeaderUpload from "./UploadForm/HeaderUpload";
import UploadForm from "./UploadForm/UploadForm";
import { useLocation } from "react-router-dom";
import { getProductById } from "../../services/productService";
function EditPage() {
 const { state } = useLocation();
   const id = state.id;
   const [product, setProduct] = useState({});
   const [loading, setLoading] = useState(true);
   async function getProduct(id) {
     try {
       const data = await getProductById(id);
       setProduct(data);
     } catch (err) {
       console.error(err);
     } finally {
       setLoading(false);
     }
   }
   useEffect(() => {
     getProduct(id);
   }, []);
  if (loading) return <div>Loading.....</div>
  return (
    <div>
      <div className="container-order">
        <div
          className="container px-5 py-3 d-flex flex-column gap-4"
          style={{ textAlign: "left", width: "1000px" }}
        >
          <HeaderUpload />
          <UploadForm id={id} product={product}/>
        </div>
      </div>
    </div>
  );
}
export default EditPage;
