import React, { useEffect, useState } from 'react';
import "./Profile.scss";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const minLength = 5;
const maxLength = 15;
const minLength3 = 15;
const maxLength3 = 100;
const minLength4 = 10;

const countryOptions = [
  "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla",
  "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize",
  "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina",
  "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria",
  "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands",
  "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands",
  "Colombia", "Comoros", "Congo", "Congo, Democratic Republic of the Congo", "Cook Islands", "Costa Rica",
  "Cote D'Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea",
  "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France",
  "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala",
  "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and Mcdonald Islands",
  "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia",
  "Iran, Islamic Republic of", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan",
  "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of",
  "Korea, Republic of", "Kosovo", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Macao", "Macedonia, the Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico",
  "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro",
  "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue",
  "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau",
  "Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation",
  "Rwanda", "Saint Barthelemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin",
  "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Serbia and Montenegro", "Seychelles",
  "Sierra Leone", "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland",
  "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of",
  "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan",
  "Vanuatu", "Venezuela", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.s.", "Wallis and Futuna",
  "Western Sahara", "Yemen", "Zambia", "Zimbabwe",
];


function Profile() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    gender: "",
    country: "",
    phone: "",
    desc: "",
  });

  const [_id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    const currentUser = JSON.parse(userData);

    const {
      username,
      email,
      gender,
      country,
      phone,
      desc,
      img,
      _id,
    } = currentUser;

    setUsername(username);
    setEmail(email);
    setGender(gender);
    setCountry(country);
    setPhone(phone);
    setDesc(desc);
    setImg(img);
    setId(_id);
  }, []);


  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;

        const userData = JSON.parse(localStorage.getItem('currentUser'));
        userData.img = url;
        localStorage.setItem('currentUser', JSON.stringify(userData));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.trim() === "") {
      return toast.error("Username is required");
    } else if (username.length < minLength || username.length > maxLength) {
      return toast.error(`Username should be between ${minLength} and ${maxLength} characters long`);
    }

    if (email.trim() === "") {
      return toast.error("Email is required");
    }

    if (gender.trim() === "") {
      return toast.error("Gender is required");
    }

    if (country.trim() === "") {
      return toast.error("Country is required");
    }

    if (phone.length > 0) {
      if (phone.length < minLength4) {
        return toast.error(`Phone should be at least ${minLength4} Numbers`);
      } else if (!/^\d+([\+\-]\d+)?$/.test(phone)) {
        return toast.error("Phone must contain only numbers and symbols (+, -)");
      }
    }

    if (desc.length > 0 && (desc.length < minLength3 || desc.length > maxLength3)) {
      return toast.error(`Description should be between ${minLength3} and ${maxLength3} characters long`);
    }

    try {
      const url = file ? await upload(file) : img;

      await newRequest.put(`/users/${_id}`, {
        username,
        email,
        gender,
        country,
        phone,
        desc,
        img: url,
      });

      toast.success('Successfully Updated', {
        position: toast.POSITION.TOP_CENTER
      });

      const userData = JSON.parse(localStorage.getItem('currentUser'));
      userData.username = username;
      userData.email = email;
      userData.gender = gender;
      userData.country = country;
      userData.phone = phone;
      userData.desc = desc;
      userData.img = url;
      localStorage.setItem('currentUser', JSON.stringify(userData));

      //window.location.reload(false);
    } catch (err) {
      setError(err.response.data);
      console.log(err);
    }
  };

  return (
    <div className='profile'>
      <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
      <ToastContainer position="top-center" autoClose={2500} theme="light" hideProgressBar />

      <form onSubmit={handleSubmit}>
        <div className="container light-style flex-grow-1 container-p-y">
          <h4 className="font-weight-bold py-3 mb-4">Account settings</h4>
          <div className="card overflow-hidden">
            <div className="row no-gutters row-bordered row-border-light">
              <div className="col-md-3 pt-0">
                <div className="list-group list-group-flush account-settings-links">
                  <a className="list-group-item list-group-item-action active" data-toggle="list" href="#account-general">My Profile</a>
                </div>
              </div>
              <div className="col-md-9">
                <div className="tab-content">
                  <div className="tab-pane fade active show" id="account-general">
                    <div className="card-body media align-items-center">
                      {file ? (
                        <img src={URL.createObjectURL(file)} alt="" className="d-block ui-w-80"  />
                      ) : (
                        <img src={img || "/img/noavatar.jpg"} alt="" className="d-block ui-w-80"  />
                      )}

                      <div className="media-body ml-4">
                        <input type="file" onChange={handleChange} />
                      </div>
                    </div>
                    <hr className="border-light m-0" />
                    <div className="card-body">
                      <div className="form-group">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control mb-1" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">E-mail</label>
                        <input type="text" className="form-control mb-1" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select className="form-control mb-1" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <select className="form-control mb-1" name="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                          {countryOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input type="tel" className="form-control mb-1" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-control mb-1" name="desc" rows="3" value={desc} onChange={(e) => setDesc(e.target.value)} />
                      </div>
                      <button type="submit" className="btn btn-primary mt-2">Save Changes</button>
                      {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;
