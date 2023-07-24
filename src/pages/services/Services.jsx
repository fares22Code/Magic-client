import React, { useEffect, useRef, useState } from "react";
import "./Services.scss";
import ServiceCard from "../../compenents/serviceCard/ServiceCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Services() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["services"],
    queryFn: () =>
      newRequest
        .get(
          `/services${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          let sortedData = res.data;

          if (sort === "reviews") {
            sortedData = sortedData.sort((a, b) => b.reviewsNumber - a.reviewsNumber);
          } else if (sort === "createdAt") {
            sortedData = sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          } else if (sort === "sales") {
            sortedData = sortedData.sort((a, b) => b.totalSales - a.totalSales);
          }

          return sortedData;
        }),
  });

  console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="services">
      <div className="container">
       
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "reviews"
                ? "Most Reviewed"
                : sort === "createdAt"
                ? "Newest"
                : "Best Selling"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                <span onClick={() => reSort("createdAt")}>Newest</span>
                <span onClick={() => reSort("sales")}>Best Selling</span>
                <span onClick={() => reSort("reviews")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : data.map((service) => <ServiceCard key={service._id} item={service} />)}
        </div>
      </div>
    </div>
  );
}

export default Services;
