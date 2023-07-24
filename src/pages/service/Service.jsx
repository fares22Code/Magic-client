import React from "react";
import "./Service.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../compenents/reviews/Reviews";
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Service() {
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["service"],
    queryFn: () =>
      newRequest.get(`/services/single/${id}`).then((res) => {
        return res.data;
      }),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isSeller = currentUser?.isSeller;

  const { isLoading: isLoadingOrder, error: errorOrder, data: dataOrder } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        return res.data;
      }),
  });

  const isServicePurchased = dataOrder?.some((order) => order.serviceId === id && order.isCompleted);

  return (
    <div className="service">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            <h4>{data.cat}</h4>
            <h1>{data.title}</h1>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <span>{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item, i) => (
                        <img src="/img/star.png" alt="" key={i} />
                      ))}
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                )}
              </div>
            )}
            <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              {data.images.map((img) => (
                <img key={img} src={img} alt="" />
              ))}
            </Slider>
            <h2>About This Service</h2>
            <p>{data.desc}</p>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={dataUser.img || "/img/noavatar.jpg"} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((item, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">
                        {moment(dataUser.createdAt).fromNow()}
                      </span>
                    </div>
                    <div className="item">
                      <span className="title">Email</span>
                      <span className="desc">{dataUser.email}</span>
                    </div>
                    <div className="item">
                      <span className="title">Phone</span>
                      <span className="desc">{dataUser.phone}</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}
            {!isSeller && <Reviews serviceId={id} />}
          </div>
          <div className="right">
            {!isSeller && !isServicePurchased && (
              <React.Fragment>
                <div className="price">
                  <h3>{data.shortTitle}</h3>
                  <h2>$ {data.price}</h2>
                </div>
                <p>{data.shortDesc}</p>
                <div className="details">
                  <div className="item">
                    <img src="/img/clock.png" alt="" />
                    <span>{data.deliveryTime} Days Delivery</span>
                  </div>
                  <div className="item">
                    <img src="/img/status.png" alt="" />
                    <div
                      className={`status ${
                        data.status === "Available"
                          ? "status-available"
                          : "status-not-available"
                      }`}
                    >
                      {data.status}
                    </div>
                  </div>
                </div>
                <div className="features">
                  {data.features.map((feature) => (
                    <div className="item" key={feature}>
                      <img src="/img/greencheck.png" alt="" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                {data.status === "Not Available" ? (
                  <p2>
                    This service is not Available,Please check the other
                    services.
                  </p2>
                ) : (
                  <Link to={`/pay/${id}`}>
                    <button>Purchase</button>
                  </Link>
                )}
              </React.Fragment>
            )}
            {isServicePurchased && (
              <p style={{ color: "orange", fontWeight: "bold" }}>
                You already purchased this service.
              </p>
            )}
            {isSeller && (
              <p>this section is hidden for freelancers.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Service;
