import React from "react";
import myPicture from "../../../img/iphone.webp";
import myPicture2 from "../../../img/iphone2.webp";
import { API_BASE } from "../../../api/axiosClient";
function ImageProduct(props) {
  const images = props.images;
  return (
    <div id="carouselExample" className="carousel slide">
      <div className="carousel-inner image-container">
        <div className="carousel-item active">
          <img src={`${API_BASE}${images[0].image_url}`} />
        </div>
        {images.map((image, index) => {
          if (index > 0) {
            return (
              <div key={index} className="carousel-item">
                <img  src={`${API_BASE}${image.image_url}`} />
              </div>
            );
          }
        })}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
export default ImageProduct;
