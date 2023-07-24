import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";

const Reviews = ({ serviceId }) => {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${serviceId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
    },
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const desc = e.target[0].value;
      const star = e.target[1].value;
      mutation.mutate({ serviceId, userId: currentUser._id, desc, star }); // Include userId in the review object
    } catch (err) {
      setErrorMessage("Something went wrong!");
    }
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      setReviewSubmitted(true);
    }
  }, [mutation.isSuccess]);

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        data.map((review) => <Review key={review._id} review={review} />)
      )}
      <div className="add">
        <h3>Add a Review</h3>
        {!reviewSubmitted && data && !data.some((review) => review.userId === currentUser?._id) ? ( // Check if currentUser's userId exists in reviews
          <form action="" className="addForm" onSubmit={handleSubmit}>
            <input type="text" placeholder="write your opinion" />
            <select name="" id="">
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            <button>Send</button>
            {errorMessage && <p>{errorMessage}</p>}
          </form>
        ) : (
          <p2>You already wrote a review</p2>
        )}
      </div>
    </div>
  );
};

export default Reviews;
