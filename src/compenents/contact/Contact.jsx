import React from 'react'
import "./Contact.scss"

function Contact() {
  return (
    <div  className='contact'>



  <div class="container">
    <div class="content">

      
      <div class="right-side">
        <div class="topic-text">Contact Us</div>
       
      <form action="https://formsubmit.co/feres100100@gmail.com" method="POST">
        <div class="input-box">
          <input type="text" placeholder="Enter your name" name="name" required/>
        </div>
        <div class="input-box">
          <input type="email" placeholder="Enter your email" name="email" required/>
        </div>
        <div class="input-box message-box">
          
        <input type="text" placeholder="Enter your message" name="msg" required/>
          
        <input type="hidden" name="_subject" value="Contact US"/>
<input type="hidden" name="_captcha" value="false"/>
        </div>
        
          <input class="button" type="submit" value="Send Now" />
      
      </form>
    </div>
    </div>
  </div>








    </div>
  )
}

export default Contact