import React, { useReducer, useState } from "react";
import "./Add.scss";
import { serviceReducer, INITIAL_STATE } from "../../reducers/serviceReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";


const Add = () => {
  
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState("");
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [firstButtonClicked, setFirstButtonClicked] = useState(false);


  const [state, dispatch] = useReducer(serviceReducer, INITIAL_STATE);

  
  const minLength = 50;
  const maxLength = 500;
  const maxLength3 = 55;
  const minLength2 = 10;
  const maxLength2 = 80;

  
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (service) => {
      return newRequest.post("/services", service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myServices"]);
    },
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name, value },
    });
  };

  
  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  
  const handleUpload = async () => {
    setUploading(true);
    setFirstButtonClicked(true);
    try {
      const cover = await upload(singleFile);
      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.error("Error uploading files:", err);
      
    }
  };

  const hasNoSpace = (inputValue) => {
    return !/\s/.test(inputValue);
  };
  const hasOnlyNumbers = (value) => {
    return /^\d+$/.test(value);
  };
  const hasRepeatedCharacter = (value) => {
    return /(.)\1{10,}/.test(value);
  };

  const containsOnlySymbols = (str) => {
    const pattern = /^[^A-Za-z0-9\s]+$/; 
    return pattern.test(str);
  };

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();


   
    if (!title.trim()) {
      return toast.error("Title is required");
    } else if (title.length < minLength2 || title.length > maxLength2) {
      return toast.error(`Title should be between ${minLength2} and ${maxLength2} characters long`);
    }

    if (!cat.trim()) {
      return toast.error("Category is required");
    }

    if (!desc.trim()) {
      return toast.error("Description is required");
    } else if (desc.length < minLength || desc.length > maxLength) {
      return toast.error(`Description should be between ${minLength} and ${maxLength} characters long`);
    }

    if (!shortTitle.trim()) {
      return toast.error("Short Title is required");
    } else if (shortTitle.length < minLength2 || shortTitle.length > maxLength3) {
      return toast.error(`Short Title should be between ${minLength2} and ${maxLength3} characters long`);
    }

    if (!shortDesc.trim()) {
      return toast.error("Short Description is required");
    } else if (shortDesc.length < minLength2 || shortDesc.length > maxLength2) {
      return toast.error(`Short Description should be between ${minLength2} and ${maxLength2} characters long`);
    }

    if (!deliveryTime.trim()) {
      return toast.error("Delivery Time is required");
    } else if (parseInt(deliveryTime) > 30 || parseInt(deliveryTime) === 0 || parseInt(deliveryTime) < 0) {
      return toast.error("Delivery Time should be between 1-30 Days");
    }

    if (!price.trim()) {
      return toast.error("Price is required");
    } else if (parseInt(price) > 200 || parseInt(price) < 1) {
      return toast.error("Price should be between 1-200 Dollars");
    }

    if (!singleFile) {
      return toast.error("Cover is required");
    }

    if (files.length === 0) {
      return toast.error("Images are required, select at least One");
    }

    if (!firstButtonClicked) {
      return toast.error("Please click the Upload button before creating your Service.");
    }


    if (
     
      hasNoSpace(title) ||
      hasNoSpace(desc) ||
      hasNoSpace(shortTitle) ||
      hasNoSpace(shortDesc) ||
      hasOnlyNumbers(title) ||
      hasOnlyNumbers(desc) ||
      hasOnlyNumbers(shortTitle) ||
      hasOnlyNumbers(shortDesc) ||
      hasRepeatedCharacter(title) ||
      hasRepeatedCharacter(desc) ||
      hasRepeatedCharacter(shortTitle) ||
      hasRepeatedCharacter(shortDesc) ||
      containsOnlySymbols(title) ||
      containsOnlySymbols(desc) ||
      containsOnlySymbols(shortTitle) ||
      containsOnlySymbols(shortDesc) 
     
    ) {
      return toast.error("Invalid input.has No Space,has Only Numbers,has Repeated Character,has Only Symbols");
    }



    
    try {
      await mutation.mutateAsync(state);
      toast.success("Your Service has been created Successfully");
      setTimeout(() => {
        navigate('/myServices');
      }, 2000);
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("An error occurred while creating the service. Please try again later.");
    }
  };

  return (
    <div className="add">
       <ToastContainer
       position="top-center"
       autoClose={3000}
       theme="light"
       hideProgressBar

       
       
       />
      <div className="container">
          <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/>
        <h1>Add New Service</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              value={title}
              maxlength={maxLength2}
              
              onChange={(e) => {
                handleChange(e);
                setTitle(e.target.value);
                
              }}
             
              
            />
            <label htmlFor="">Category</label>
            <select name="cat"
             id="cat"
             
              onChange={(e) => {
                handleChange(e);
                setCat(e.target.value);  
              }}
              
              >
                 <option value="">Please select one…</option>
              <option value="Graphics-Design">Graphics & Design</option>
              <option value="Digital-Marketing">Digital Marketing</option>
              <option value="Writing-Translation">Writing & Translation</option>
              <option value="Video-Animation">Video & Animation</option>
              <option value="Music-Audio">Music & Audio</option>
              <option value="Programming-Tech">Programming & Tech</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Data">Data</option>
              <option value="Photography">Photography</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
               
                  type="file"
                 
                 
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                
                  type="file"
                 
                  multiple

                  
                  onChange={(e) => setFiles(e.target.files)}
                  
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              value={desc}
              maxlength={maxLength}
              onChange={(e) => {
                handleChange(e);
                setDesc(e.target.value);
                
              }}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="">Short Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              value={shortTitle}
              maxlength={maxLength3}
              onChange={(e) => {
                handleChange(e);
                setShortTitle(e.target.value);
                
              }}
              
            />
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              value={shortDesc}
              maxlength={maxLength2}
              onChange={(e) => {
                handleChange(e);
                setShortDesc(e.target.value);
                
              }}



            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)</label> 
             <input
             
             type="number"
             min="1"
             max="30"
             
              name="deliveryTime" 
              value={deliveryTime}
              
              onChange={(e) => {
                handleChange(e);
                setDeliveryTime(e.target.value);
                
              }}
               
               />

            <label htmlFor="">Add Features (optional)</label>
            <form action="" 
            className="add"
             onSubmit={handleFeature}
             
             >
              <input type="text"  placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" 
           name="price"
           min="1"
           max="200"
           value={price}
              
              onChange={(e) => {
                handleChange(e);
                setPrice(e.target.value);
                
              }} 
             
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
