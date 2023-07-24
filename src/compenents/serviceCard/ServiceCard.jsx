import React from "react";
import "./ServiceCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const ServiceCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });

  const truncatedDesc =
    item.desc.length > 100 ? `${item.desc.slice(0, 100)}...` : item.desc;

  const hasMoreThanThreeReviews = item["reviewsNumber"] > 3;

  return (
    <Link to={`/service/${item._id}`} className="link">
      <div className="serviceCard">
        <img src={item.cover} alt="" />
        <div className="info">
          {isLoading ? (
            "loading"
          ) : error ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img src={data.img || "/img/noavatar.jpg"} alt="" />
              <span>{data.username}</span>
            </div>
          )}
          <p>{truncatedDesc}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>
              {!isNaN(item.totalStars / item.starNumber) &&
                Math.round(item.totalStars / item.starNumber)}
            </span>
          </div>
        </div>
        <hr />
        <div className="detail">
          {hasMoreThanThreeReviews && (
            <div className="left-content"> 
              <img src="./img/heart.png" alt="" className="red-heart" />
            </div>
          )}
          <div className="right-content"> 
            <div className="price">
              <h2>$ {item.price}</h2>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
