import React, { use, useState } from "react";
import { MapPin } from "lucide-react";
function OrderInfo(props) {
  const message=props.message;
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  function handleChange(target, e) {
    if (target === "phone") {
      setPhone(e.target.value);
      props.onEnter({
        phone: e.target.value,
      });
    } else if (target === "address") {
      setAddress(e.target.value);
      props.onEnter({
        address: e.target.value,
      });
    } else {
      setNote(e.target.value);
      props.onEnter({
        note: e.target.value,
      });
    }
  }
  return (
    <div className="order-info">
      <span style={{ fontWeight: "500" }}>
        <MapPin color="#ff6a00" style={{ marginRight: "5px" }} />
        Thông tin giao hàng
      </span>
      <span style={{ opacity: "0.5", marginLeft: "5px" }}>
        Nhập thông tin giao hàng của bạn
      </span>
      <form>
        <div className="row mt-3">
          <div className="col-6">
            <label htmlFor="InputPhone" className="form-label">
              Số điện thoại*
            </label>
            <input
              type="text"
              id="InputPhone"
              className="form-control"
              placeholder="Nhập số điện thoại của bạn"
              style={{ borderRadius: "0.5rem" }}
              onChange={(e) => handleChange("phone", e)}
            />
          </div>
           <span style={{ color: "red" }}>{message.phone}</span>
          <div className="col-12 mt-3">
            <label htmlFor="InputAddress" className="form-label">
              Địa chỉ*
            </label>
            <input
              type="text"
              id="InputAddress"
              className="form-control"
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              style={{ borderRadius: "0.5rem" }}
              onChange={(e) => handleChange("address", e)}
            />
          </div>
           <span style={{ color: "red" }}>{message.address}</span>
          <div className="col-12 mt-3 mb-3">
            <label htmlFor="InputNote" className="form-label">
              Ghi chú
            </label>
            <input
              type="text"
              id="InputNote"
              className="form-control"
              placeholder="Ghi chú thêm về địa chỉ (tùy chọn)"
              style={{ borderRadius: "0.5rem" }}
              onChange={(e) => handleChange("note", e)}
            />
          </div>
           <span style={{ color: "red" }}>{message.note}</span>
           <span style={{ color: "red" }}>{message.order}</span>
        </div>
      </form>
    </div>
  );
}
export default OrderInfo;
