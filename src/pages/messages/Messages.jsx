import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/conversations`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const [usernames, setUsernames] = useState({});

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  const fetchUsername = async (userId) => {
    try {
      const response = await newRequest.get(`/users/${userId}`);
      return response.data.username;
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      const usernamesData = {};
      for (const conversation of data) {
        const sellerId = conversation.sellerId;
        const buyerId = conversation.buyerId;
        if (!usernamesData[sellerId]) {
          const sellerUsername = await fetchUsername(sellerId);
          usernamesData[sellerId] = sellerUsername;
        }
        if (!usernamesData[buyerId]) {
          const buyerUsername = await fetchUsername(buyerId);
          usernamesData[buyerId] = buyerUsername;
        }
      }
      setUsernames(usernamesData);
    };

    if (data) {
      fetchUsernames();
    }
  }, [data]);

  return (
    <div className="messages">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <link
            rel="stylesheet"
            type="text/css"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          />
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <tr>
              <th>{currentUser.isSeller ? "Buyer" : "Seller"} Name</th>
              <th>Last Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
            {data.map((c) => (
              <tr
                className={
                  ((currentUser.isSeller && !c.readBySeller) ||
                    (!currentUser.isSeller && !c.readByBuyer)) &&
                  "active"
                }
                key={c.id}
              >
                <td>
                  {currentUser.isSeller
                    ? usernames[c.buyerId]
                    : usernames[c.sellerId]}
                </td>
                <td>
                  <Link to={`/message/${c.id}`} className="link">
                    {c?.lastMessage?.substring(0, 50)}...
                  </Link>
                </td>
                <td>{moment(c.updatedAt).fromNow()}</td>
                <td>
                  {((currentUser.isSeller && !c.readBySeller) ||
                    (!currentUser.isSeller && !c.readByBuyer)) && (
                    <button onClick={() => handleRead(c.id)}>
                      Mark as Read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;
