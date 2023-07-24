import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isSeller = currentUser && currentUser.isSeller;
 
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const [serviceUrl, setServiceUrl] = useState(""); 
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredMessage = e.target[0].value;
    const messageWithClickableLinks = convertUrlsToLinks(
      enteredMessage + " " + serviceUrl
    ); 
 
    const urlRegex = /^(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]$/i;
  
    if (serviceUrl.trim() !== "" && !urlRegex.test(serviceUrl)) {
      
      toast.error("Invalid link");
      return; 
    }
  
    if (serviceUrl.trim() !== "") {
      
      toast.success("Link sent successfully! 🚀");
    }
  
    mutation.mutate({
      conversationId: id,
      desc: messageWithClickableLinks,
    });
    e.target[0].value = "";
    setServiceUrl(""); 
  };
  
  
  const convertUrlsToLinks = (message) => {
   
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return message.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  };

 
  return (
    <div className="message">
        <ToastContainer
       position="top-center"
       autoClose={3000}
       theme="light"
       hideProgressBar

       
       
       />

      <div className="container">
        <link
          rel="stylesheet"
          type="text/css"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        />
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link>
        </span>
        {isLoading ? (
          "loading"
        ) : error ? (
          "error"
        ) : (
          <div className="messages">
            {data.map((m) => (
              <div
                className={
                  m.userId === currentUser._id ? "owner item" : "item"
                }
                key={m._id}
              >
                <img
                  src={
                    m.userId === currentUser._id
                      ? currentUser.img
                      : "https://www.freeiconspng.com/thumbs/message-icon-png/message-icon-png-12.png"
                  }
                  alt=""
                />
                
                <p dangerouslySetInnerHTML={{ __html: m.desc }} />
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
    
          <textarea
            type="text"
            placeholder="Write a message"
            style={{
              border: "2px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
              width: "100%",
            }}
          />
          
   
        
          {isSeller ? (
            <input
              type="text"
              placeholder="Send URL(Github,OneDrive ...)"
              value={serviceUrl}
              onChange={(e) => setServiceUrl(e.target.value)}
              style={{
                marginTop: "8px",
                border: "2px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
                width: "100%",
              }}
            />
          ) : null}
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
