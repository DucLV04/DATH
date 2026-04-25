import React from "react";
import Post from "../../HomePage/Post/Post";
import { getMyProduct } from "../../../services/productService";
import { useEffect, useState } from "react";
import ChangePage from "../../HomePage/Post/ChangePage";
import Notification from "../../../component/Notification";
function MyProduct(props) {
  const [showNotifi, setShow] = useState(false);
  const openNotifi = () => setShow(true);
  const closeNotifi = () => setShow(false);
  const [listProduct, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  async function getListProduct(e) {
    try {
      const data = await getMyProduct(page);
      setList(data);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    getListProduct();
    const interval = setInterval(() => {
      getListProduct();
    }, 500);
    return () => clearInterval(interval);
  }, [page]);
  return (
    <div
      className="d-flex flex-column gap-2 align-items-start"
      style={{ marginTop: "20px" }}
    >
      <span style={{ fontWeight: "500", fontSize: "17px" }}>
        Sản phẩm của tôi
      </span>
      {listProduct.map((product, index) => (
        <Post
          key={index}
          productInfo={product}
          showAddToCart={false}
          showAction={true}
           openNotifi={openNotifi}
        />
      ))}
      <ChangePage page={page} onChange={setPage} />
      {showNotifi && (
        <Notification
          show={true}
          message={"Sản phẩm của bạn đã xóa thành công"}
          color={"#BF092F"}
          onClose={closeNotifi}
        />
      )}
    </div>
  );
}
export default MyProduct;
