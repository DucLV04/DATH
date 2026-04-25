import React from "react";
import myPicture1 from "../../../img/marketplace-hero-1.jpg";
import myPicture2 from "../../../img/marketplace-hero-2.jpg";
import myPicture3 from "../../../img/marketplace-hero-3.jpg";
import ContentItem from "./ContentItem";
function ContentHero() {
  return (
    <div>
      <div id="carouselHero" className="carousel slide hero-carousle">
        <div className="carousel-inner ">
          <div className="carousel-item active">
            <ContentItem
              srcImg={myPicture1}
              title="Discover Amazing Products"
              litleTitle="SPRING 2025"
              content="Connect with thousands of sellers and find exactly what you're looking for."
            />
          </div>
          <div className="carousel-item">
            <ContentItem
              srcImg={myPicture2}
              title="SHOP FROM TOP SELLERS"
              litleTitle="NEW ARRIVALS"
              content="Browse millions of products from trusted sellers worldwide."
            />
          </div>
            <div className="carousel-item">
            <ContentItem
              srcImg={myPicture3}
              title="SAVE MORE EVERY DAY"
              litleTitle="BEST DEALS"
              content="Get the best prices on everything you need, all in one place."
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselHero"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselHero"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
export default ContentHero;
