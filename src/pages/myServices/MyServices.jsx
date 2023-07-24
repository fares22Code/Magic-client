import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./MyServices.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function MyServices() {
  const currentUser = getCurrentUser();

  const queryClient = useQueryClient();
const navigate=useNavigate;
 

  const { isLoading, error, data } = useQuery({
    queryKey: ["myServices"],
    queryFn: () =>
      newRequest.get(`/services?userId=${currentUser._id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/services/${id}`);
      
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myServices"]);
      
    },
  });
  

 
  const handleUpdate = (service) => {
    const newStatus = service.status === "Available" ? "Not Available" : "Available";
  
    newRequest
      .put(`/services/${service._id}`, { status: newStatus })
      .then(() => {
        queryClient.invalidateQueries(["myServices"]);
       return toast.success("Your Service Status has been changed");
  
       
      })
      .catch((error) => {
        console.error(error);
        return toast.error("Failed to update status");
      });
  };

  const getStatusClass = (status) => {
    if (status === "Available") {
      return "status-available";
    } else if (status === "Not Available") {
      return "status-not-available";
    } else {
      return "";
    }
  };

  const handleDelete = (id) => {
    mutation.mutate(id);
    toast.success("Your Service has been deleted successfully");
  };

  const handleTitleClick = (id) => {
    navigate(`/service/${id}`);
  };
  const getTitleClass = () => {
    return "service-title";
  };
  const getChangeButtonClass = () => {
    return "change-button";
  };
  const reversedData = data ? data.slice().reverse() : [];
  return (
    <div className="myServices">
      <ToastContainer
       position="top-center"
       autoClose={2500}
       theme="light"
       hideProgressBar

       />
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/>
          <div className="title">
            <h1>Services</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New Service</button>
              </Link>
            )}
          </div>
          <table>
            <thead>
            <tr>

              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Delete</th>
              <th>Status</th>
              <th></th>
             
             
            </tr>
            </thead>
            <tbody>
            {reversedData.map((service) => (
              <tr key={service._id}>
                <td>
                  <img className="image" src={service.cover} alt="" />
                </td>
                <td>
                <Link
                      to={`/service/${service._id}`}
                      onClick={() => handleTitleClick(service._id)}
                      className={getTitleClass()}
                    >
                      {service.title}
                      </Link>
                </td>
                <td>{service.price}$</td>
                <td>{service.sales}</td>
                <td>
                  <img
                    className="delete"
                    src="./img/delete.png"
                    alt=""
                    onClick={() => handleDelete(service._id)}
                  />
                </td>
                <td className={getStatusClass(service.status)}>
                {service.status}
                 </td>

                <td>
                
    <img
    src="./img/change2.png"
    type="submit"   
    onClick={() => handleUpdate(service)}
    className={getChangeButtonClass()}
    />
 


    </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyServices;
