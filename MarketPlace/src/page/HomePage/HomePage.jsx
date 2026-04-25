import React from "react";
import Header from "../../component/Header";
import FilterSection from "./FilterSection/FilterSection";
import Trending from "./Trending/Trending";
import RecommendSeller from "./RecommendSeller/RecommendSeller";
import CreateProductPost from "./CreateProduct/CreateProductPost";
import Notification from "../../component/Notification";
import AdvancedFilter from "./AdvancedFilter/AdvancedFilter";
import Post from "./Post/Post";
import ChangePage from "./Post/ChangePage";
import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { getProduct, getCategories } from "../../services/productService";
import { sortProductsByCriteria } from "../../utils/utils";
function HomePage() {
  const userId = JSON.parse(sessionStorage.getItem("userId"));
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { show } = location.state || false;
  const { message } = location.state || "";
  const { color } = location.state || "#ff9013";
  const [showNotifi, setShow] = useState(show);
  const closeNotifi = () => setShow(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    category: "Tất cả",
    sortBy: "Mới nhất",
  });
  const [advanFilter, setFilterAdvanced] = useState({
    rating_min: 0,
    price_min: 0,
    price_max: Infinity,
    keyword: [],
    sortByPrice: "Giá: Thấp đến cao",
  });
  function handleFilter(filtBy = {}) {
    setFilter((prev) => ({
      ...prev,
      ...filtBy,
    }));
  }
  function handleAdvFilter(filtBy = {}) {
    setFilterAdvanced((prev) => ({
      ...prev,
      ...filtBy,
    }));
  }
  const [listProduct, setList] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  async function getListProduct() {
    try {
      // console.log("category: ", filter.category === "Tất cả" ? "" : filter.category);
      const data = await getProduct({
        search:
          search +
          (advanFilter.keyword.length > 0
            ? ` ${advanFilter.keyword.join()}`
            : ""),
        category: filter.category === "Tất cả" ? "" : filter.category,
        rating_min: advanFilter.rating_min,
        price_min: advanFilter.price_min,
        price_max: advanFilter.price_max,
        page: page,
      });
      const list = sortProductsByCriteria(data, "Mới nhất");
      setList(list);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    setLoading(true);
    const fetchAndSortProducts = async () => {
      try {
        const data = await getProduct({
          search: search,
          category: filter.category === "Tất cả" ? "" : filter.category,
          rating_min: advanFilter.rating_min,
          price_min: advanFilter.price_min,
          price_max: advanFilter.price_max,
          page: page,
        });

        const filteredData = data.filter(product => {
          if (advanFilter.keyword.length === 0) return true;
          if (!product.hashtags) return false;
          const keywords = advanFilter.keyword;
          for (let keyword of keywords) {
            for (let tag of product.hashtags) {
              if (tag['tag'] == keyword) {
                return true
              }
            }
          }

          return false;
        });

        console.log(filteredData)
        const sortedList = sortProductsByCriteria(filteredData, "Mới nhất");
        setList(sortedList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        const categoryNames = Object.keys(categories);
        setListCategories(["Tất cả", ...categoryNames]);
      } catch (err) {
        console.error(err);
      }
    };
    Promise.all([fetchAndSortProducts(), fetchCategories()]);
  }, [filter.category, advanFilter, page, search,]);
  useEffect(() => {
    setList(sortProductsByCriteria(listProduct, filter.sortBy));
  }, [filter.sortBy]);
  if (loading) return <div>Loading..</div>;
  return (
    <div>
      <div className="container py-4 position-relative">
        {showNotifi && (
          <Notification message={message} color={color} onClose={closeNotifi} />
        )}
        <div className="row">
          <div className="col">
            <FilterSection
              filter={filter}
              onFilter={handleFilter}
              listCategories={listCategories}
            />
          </div>
          <div className="col-6">
            <CreateProductPost />
            {listProduct.map((product, index) => (
              <Post
                key={index}
                productInfo={product}
                showAddToCart={userId !== product.seller_id}
                showAction={false}
              />
            ))}
            <ChangePage page={page} onChange={setPage} />
          </div>
          <div className="col">
            <AdvancedFilter filter={advanFilter} onFilter={handleAdvFilter} />
            <RecommendSeller />
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
