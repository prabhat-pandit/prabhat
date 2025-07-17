import React, {useEffect, useState} from "react";
import axios from "axios";
import { Tooltip } from "antd";
import { FaSun, FaMoon, FaDownload, FaSearch, FaEye, FaHeart } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import "./pixabay.css";


const API_KEY = "51148564-fee2f76cad3854a631b089851";


const PixabayImg = () => {

    const [images, setImages] = useState([]);
    const [query, setQuery] = useState("nature");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [darkMode, setDarkMode] = useState(false);

    const modeClass = darkMode ? "bg-dark text-white" : "bg-light text-dark";
    const modeText = darkMode ? "Dark Mode is Applied" : "Light Mode is Applied";

    const categories = ['Nature', 'People', 'Technology', 
                      'Animals', 'Food', 'Computer', 'AI', 
                      'Programming', "Coding", 'Home', 'Rose',
                      'Lions', 'Fish', "Political", 'Shark', 'Potato'
                      ];


    const fetchImages = async () => {
         setLoading(true);
         setImages([]); // clear all the previous results to show the new results

         const encodedQuery = encodeURIComponent(query);
         const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodedQuery}&image_type=photo&per_page=100`;

         try{
             const res = await axios.get(url);
             console.log(res.data.hits);
             setImages(res.data.hits);
         }
         catch(err){
             console.log("Error Fetching The Data: ", err);
             setImages([]);
         } 
         finally{
            setLoading(false);
         }
    };

    useEffect(() => {
         fetchImages(); // calling the function when component mounts
    },[query]); // react will watch the change in "query" state variable and will execute the "function"

    const handleCategoryClikc = (cat, index) => {
        setCurrentIndex(index);
        setQuery(cat.toLowerCase());
        setSearchInput(""); // clear the input field again, it's optional
    };

    const handleEnter = (e) => {
          if(e.key === "Enter"){
            handleSearch(); // triggering the same "handleSearch" function when "Enter" button is pressed
          }
    };

    const handleSearch = () => {
       const trimmed = searchInput.trim();
       if(trimmed){
        setQuery(trimmed);
        setSearchInput(""); // clear the input field again, it's optional
       }
    };


    const Tags = ({tags = "", label, className="badge rounded-0 bg-info"}) => {

        if(!tags) return null;

        // jSX
        return(
            <div className="mb-2 mt-3">
                <strong className={`${modeClass}`}>{label}</strong> {" "}
                 {tags.split(", ").slice(0,7).map((tag, index) => (
                    <span key={index}
                     className={`${className} text-dark mb-2 me-2`}
                    >
                        {tag.trim()}
                    </span>
                 ))}
            </div>
        );
    }

    useEffect(() => {

        document.body.classList.remove("bg-dark", "bg-light", 'text-dark', 'text-white');

        document.body.classList.add(
            darkMode ? "bg-dark" : "bg-light",
            darkMode ? "text-white" : "text-dark"
        )

    },[darkMode]);

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode") === "true"; // "true" === "true" // true
              setDarkMode(savedMode);
    },[]);

     useEffect(() => {
            localStorage.setItem("darkMode", darkMode);
    },[darkMode]);

    return(
        <div className="container-fluid">

            <button onClick={() => setDarkMode(!darkMode)} className="btn btn-warning dark-mode">
                {darkMode ? <FaSun /> : <FaMoon />} {modeText}
            </button>
          
          <h2 className={`fw-bold text-center display-3 text-warning`}>
            Pixabay Images Search App in React + API
          </h2>

          <div className="input-group mt-4 mb-4">
            <input
             type="search"
             placeholder="Search Images Here..."
             className="form-control p-2"
             value={searchInput}
             onChange={(e) => setSearchInput(e.target.value)}
             onKeyDown={handleEnter}
            />
            <button onClick={handleSearch} className="btn btn-warning">
                 <FaSearch /> Search Now
            </button>
          </div>

          <div className="d-flex justify-content-center mt-4 mb-4">
            {categories.map((cat, index) => (
                <Tooltip key={index} placement="top" color="red" arrow={true}>
                    <button onClick={() => handleCategoryClikc(cat, index)} className={`category-btn ${currentIndex === index ? "active" : ""}`}>
                        {cat.trim()}
                    </button>
                </Tooltip>
            ))}
          </div>

          <div className="mt-4 mb-4">
            {loading && (
                <div className="text-center mt-3 mb-3">
                    <h2 className={`text-center fw-bold display-2 ${modeClass}`}>
                        Loading Images, Please wait a While...
                    </h2>
                    <ClipLoader color="red" size={150} />
                </div>
            )}
          </div>

          <div className="mt-4 mb-4 row">
            {images.map((img) => (
                <div key={img.tags} className="col-lg-3 mb-4 col-xs-12 colsm-12 col-md-6">

                    <div className={`cards p-2 ${modeClass}`}>

                        <img
                         src={img.webformatURL}
                         alt={img.tags}
                         className="img"
                        />

                        <div className="card-content">
                            <div className="tag-label-wrapper">
                                <Tags tags={img.tags} label="Tags" />
                            </div>
                        </div>

                        <div className="d-flex justify-content-between">
                            <span className="big">{img.likes} <FaHeart /> Likes</span>
                            <span className="big">{img.views} <FaEye /> Views</span>
                        </div>

                        <div className="d-flex justify-content-between mt-3 mb-3">
                            {img.userImageURL && (
                                <a
                                 className="btn btn-info btn-sm"
                                 href={`https://pixabay.com/users/${img.user}-${img.user_id}/`}
                                 rel="noopener noreferrer"
                                 target="_blank"
                                >
                                <img 
                                src={img.userImageURL} 
                                alt={img.uer}
                                style={{width:'30px', height:'30px', borderRadius:'50%'}}
                                />
                                 <span className="mx-2">{img.user}</span>
                                </a>
                            )}
                            <a
                             download={true}
                             href={img.largeImageURL}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="btn btn-warning btn-sm"
                            >
                               <FaDownload /> Download
                            </a>
                        </div>

                    </div>
                </div>
            ))}
          </div>

        </div>
    );
};
export default PixabayImg;
