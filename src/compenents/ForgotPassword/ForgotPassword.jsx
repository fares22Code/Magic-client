import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.scss";

function ForgotPassword() {

  const navigate = useNavigate();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
 

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const accountType = form["Account-Type"].value;
    const usernameOrEmail = form["Username or Email"].value;

    if (!accountType || !usernameOrEmail) {
      toast.error("Please fill in all the required fields.");
      return;
    }
    if (isFormSubmitted) {
      toast.error("You have already sent a recovery password request.");
      return;
    }

    setIsFormSubmitted(true);

   
    toast.success("Your password will be emailed to you within 48 hours.");

    
    setTimeout(() => {
      navigate("/");
    }, 5000);
  };






 
  return (
    <div className="forgot-password">
      <ToastContainer position="top-center" autoClose={2500} theme="light" hideProgressBar />

      <form action="https://formsubmit.co/feres100100@gmail.com" onSubmit={handleSubmit} method="POST">
        <h1>Forgot Password!</h1>
       
        <label>Account Type</label>
         <select 
         name="Account-Type"
         class="form-select"
         id="Account-Type" 
         
       
        >
 <option value="">Please select one…</option>
     <option value="Male">User</option>    
    <option value="Female">Freelancer</option>
    
    </select>

        <label>Username or Email</label>
        <input
          id="Username or Email"
          name="Username or Email"
          placeholder="Enter your Username or Email"
   
          
         
        />
<input type="hidden" name="_subject" value="Password Recovery"/>
<input type="hidden" name="_captcha" value="false"/>
        <button disabled={isFormSubmitted} type="submit" value="Send">Send</button>

        <Link to="/login">Cancel</Link>
      </form>
    </div>
  );
}

export default ForgotPassword;
