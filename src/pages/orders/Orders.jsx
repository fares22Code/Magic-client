import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isSeller = currentUser?.isSeller || false;

  const [ratingsMap, setRatingsMap] = useState({});
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState({});
  const [services, setServices] = useState({});
  const [rating, setRating] = useState("");
  const [isRatingSent, setIsRatingSent] = useState(false);
  const [isRatingSentMap, setIsRatingSentMap] = useState({});

  useEffect(() => {
    const fetchUsernames = async () => {
      const orders = await newRequest.get("/orders");
      const userIds = new Set(
        orders.data.flatMap((order) => [order.buyerId, order.sellerId])
      );

      const usernamesData = await Promise.all(
        Array.from(userIds).map(async (userId) => {
          const response = await newRequest.get(`/users/${userId}`);
          return { userId, username: response.data.username };
        })
      );

      const usernamesMap = {};
      for (const { userId, username } of usernamesData) {
        usernamesMap[userId] = username;
      }

      setUsernames(usernamesMap);
    };

    const fetchServices = async () => {
      const servicesData = await newRequest.get("/services");
      const servicesMap = {};
      for (const service of servicesData.data) {
        servicesMap[service._id] = service;
      }

      setServices(servicesMap);
    };

    fetchUsernames();
    fetchServices();
  }, []);

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        return res.data;
      }),
  });

  const calculateLastDeliveryTime = (createdAt, deliveryTime) => {
    const createdAtDate = new Date(createdAt);
    if (isNaN(createdAtDate.getTime()) || typeof deliveryTime !== "number") {
      return "";
    }

    const lastDeliveryDate = new Date(
      createdAtDate.getTime() + deliveryTime * 24 * 60 * 60 * 1000
    );

    const day = lastDeliveryDate.getDate().toString().padStart(2, "0");
    const month = (lastDeliveryDate.getMonth() + 1).toString().padStart(2, "0");
    const year = lastDeliveryDate.getFullYear().toString();

    return `${day}-${month}-${year}`;
  };

  const queryClient = useQueryClient();
  const updateOrderStatusMutation = useMutation(
    (order) =>
      newRequest.put(`/orders/${order._id}`, {
        status: order.status === "pending" ? "in progress" : "done",
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("orders");
      },
    }
  );


  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: isSeller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const handleStatusChange = async (order) => {
    try {
      if (order.status === "pending") {
        updateOrderStatusMutation.mutate(order);
        if (isSeller) {
          window.alert("New Service Start");
        }
      } else if (order.status === "in progress") {
        const shouldChangeToDone = window.confirm(
          "Have you completed that service?"
        );
        if (shouldChangeToDone) {
          updateOrderStatusMutation.mutate(order);
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleApprove = async (orderId) => {
    const service = data.find((order) => order._id === orderId);
    const shouldApprove = window.confirm(
      "Are you sure you want to approve this service?"
    );

    if (shouldApprove) {
      try {
        const updatedOrder = { ...service, status: "approved" };
        await newRequest.put(`/orders/${service._id}`, {
          status: "approved",
        });

        queryClient.invalidateQueries("orders");
      } catch (error) {
        console.error("Error approving order:", error);
      }
    }
  };

  const handleRatingChange = (orderId, event) => {
    const ratingValue = event.target.value;
    setRatingsMap((prevRatingsMap) => ({
      ...prevRatingsMap,
      [orderId]: ratingValue,
    }));
  };

  const handleSendRating = async (order) => {
    try {
      const orderId = order._id;
      const ratingValue = ratingsMap[orderId];

      await newRequest.put(`/orders/${orderId}`, {
        status: "closed",
        rating: ratingValue,
      });

      queryClient.invalidateQueries("orders");

      window.alert("Your rating has been sent successfully");

      setRatingsMap((prevRatingsMap) => ({
        ...prevRatingsMap,
        [orderId]: undefined,
      }));
    } catch (error) {
      console.error("Error sending rating:", error);
    }
  };

  const getActionsContent = (order) => {
    const commonStyles = {
      background: "white",
      color: "gray",
      fontWeight: "bold",
      border: "2px solid orange",
      borderRadius: "12px",
      padding: "8px 16px",
      cursor: "pointer",
    };

    if (isSeller) {
      if (order.status === "pending") {
        return (
          <button
            style={{ ...commonStyles, background: "#007bff", color: "#fff" }}
            onClick={() => handleStatusChange(order)}
          >
            {isSeller ? "Start" : "Done"}
          </button>
        );
      } else if (order.status === "in progress") {
        return (
          <button
            style={{ ...commonStyles, background: "#28a745", color: "#fff" }}
            onClick={() => handleStatusChange(order)}
          >
            Done
          </button>
        );
      } else if (order.status === "closed") {
        const ratingValue = order.rating;
        let ratingImageSrc = "";

        switch (ratingValue) {
          case "Very Bad":
            ratingImageSrc = "./img/very-bad.png";
            break;
          case "Bad":
            ratingImageSrc = "./img/bad.png";
            break;
          case "Average":
            ratingImageSrc = "./img/average.png";
            break;
          case "Good":
            ratingImageSrc = "./img/good.png";
            break;
          case "Excellent":
            ratingImageSrc = "./img/excellent.png";
            break;
          default:
            ratingImageSrc = "";
        }

        return (
          <div>
            {ratingImageSrc && (
              <img src={ratingImageSrc} alt={ratingValue} width="35" height="35" />
            )}
          </div>
        );
      } else {
        return null;
      }
    } else {
      if (order.status === "approved") {
        const isRatingSentForOrder = isRatingSentMap[order._id];

        if (isRatingSentForOrder) {
          return (
            <div>
              <span style={{ fontWeight: "bold", color: "green" }}>
                Your rating has been sent successfully
              </span>
            </div>
          );
        } else {
          return (
            <div>
              <select
                value={ratingsMap[order._id] || ""}
                onChange={(event) => handleRatingChange(order._id, event)}
                style={{ marginRight: "8px" }}
              >
                <option value="">Select Rating</option>
                <option value="Very Bad">Very Bad</option>
                <option value="Bad">Bad</option>
                <option value="Average">Average</option>
                <option value="Good">Good</option>
                <option value="Excellent">Excellent</option>
              </select>
              <button
                style={{ ...commonStyles, background: "#ffc107", color: "#000" }}
                onClick={() => handleSendRating(order)}
                disabled={!ratingsMap[order._id]} //
              >
                Send Rating
              </button>
            </div>
          );
        }
      } else if (order.status === "done") {
        return (
          <button
            style={{ ...commonStyles, background: "#ffc107", color: "#000" }}
            onClick={() => handleApprove(order._id)}
          >
            Approved
          </button>
        );
      } else {
        return null;
      }
    }
  };

  const getNotesContent = (status, isSeller, ratingValue) => {
    if (status === "closed") {
      if (isSeller) {
        return (
          <span style={{ fontWeight: "bold", color: "orange" }}>
            Service has been closed, and rated: {ratingValue}
          </span>
        );
      } else {
        return (
          <span style={{ fontWeight: "bold", color: "orange" }}>
            Service has been rated and closed
          </span>
        );
      }
    } else if (status === "pending") {
      const message = isSeller
        ? "Start the service"
        : "Waiting for the service to start";
      return (
        <span style={{ fontWeight: "bold", color: "orange" }}>{message}</span>
      );
    } else if (status === "in progress") {
      return (
        <span style={{ fontWeight: "bold", color: "orange" }}>
          Service in progress
        </span>
      );
    } else if (status === "done") {
      return (
        <span style={{ fontWeight: "bold", color: "orange" }}>
          {isSeller ? "Service approval is pending" : "Service is done."}
        </span>
      );
    } else if (status === "approved") {
      return (
        <span style={{ fontWeight: "bold", color: "orange" }}>
          {isSeller
            ? "Service has been approved and is currently waiting for rating"
            : "Service has been approved, please send a rating"}
        </span>
      );
    } else {
      return null;
    }
  };

  // Reverse the data array to display the most recently added row first
  const reversedData = data?.slice().reverse() || []; // Ensure data is an array before reversing

  return (
    <div className="orders">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <table>
            <thead>
              <tr>
                <th>Service Cover</th>
                <th>Status</th>
                <th>Contact</th>
                <th>Last Date</th>
                <th>Action</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {reversedData.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img
                      className="image"
                      src={services[order.serviceId]?.cover}
                      alt=""
                    />
                  </td>
                  <td>{order.status}</td>

                  {order.status !== "pending" &&
                  order.status !== "approved" &&
                  order.status !== "closed" ? (
                    <td>
                      <img
                        className="message"
                        src="./img/message.png"
                        alt=""
                        onClick={() => handleContact(order)}
                      />
                    </td>
                  ) : (
                    <td>
                      <span>not available</span>
                    </td>
                  )}
                  <td>
                    {calculateLastDeliveryTime(
                      services[order.serviceId]?.createdAt,
                      services[order.serviceId]?.deliveryTime
                    )}
                  </td>
                  <td>{getActionsContent(order)}</td>
                  <td>
                    {getNotesContent(order.status, isSeller, order.rating)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
