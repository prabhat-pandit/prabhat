// make a youtube Tutorial on this soon, very soon. Fully Ready for Video Tutorial
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Tooltip } from "antd";
import { FaDownload } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import "./unsplash.css";

const API_KEY = "FSiW3Z5qRwTOj2Z6gE7Fi-jG1EZBYUiMj8o-StzyTOY";

const ImageApps = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("nature");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const perPage = 30; // Images per page

  const totalPages = Math.ceil(totalResults / perPage);

  const categories = ['nature', 'people', 'technology', 
                      'animals', 'food', 'computer', 'AI', 
                      'programming', "coding", 'home', 'rose',
                      'lions', 'fish', "political", 'shark', "data", 'bees', 'nail art', 'energy'
                    ];

  const categoryClick = (cat, index) => {
              setQuery(cat.toLowerCase());
              setCurrentIndex(index); // ← Add this line to update the index
              setSearchInput("");
              setPage(1); // reset to page 1 when click on Categories
          };


  const fetchImages = async (searchTerm, pageNum = 1) => {
    setLoading(true);
    setError(null);
    setImages([]);

    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${searchTerm}&page=${pageNum}&per_page=${perPage}&client_id=${API_KEY}`
      );
      console.log(response.data);
      setImages(response.data.results);
      setTotalResults(response.data.total); // for pagination
    } catch (error) {
      console.error("Error Fetching The Data: ", error);
      setError("Failed to load images.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      setPage(1); // reset to page 1
      setQuery(searchInput);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchImages(query, page);
  }, [query, page]);



  return (
    <div className="container-fluid py-5">

      <h2 className="text-center fw-bold display-5 text-danger mb-4">Unsplash Image Gallery & Search App in React.js + Unsplash API</h2>

      {/* Search Box */}
      <div className="mb-4 d-flex gap-0 input-group w-50 mx-auto">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search Awesome Images Here..."
          className="form-control input"
        />
        <button onClick={handleSearch} className="btn btn-warning">
          Search Now
        </button>
      </div>
       
      
      <div className="category-buttons d-flex justify-content-center text-center mt-4">
                    {categories.map((cat, index) => (
                         <Tooltip key={index} placement='top' color='red' arrow={true} title={cat}>
                          <button
                            className={`category-btn ${currentIndex === index ? "active" : " "}`}
                            onClick={() => categoryClick(cat, index)}
                            >
                            {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                          </button>
                        </Tooltip>
                    ))}
      </div>

        <div className="mt-1 mb-5">
        {!loading && images.length > 0 && (
          <div>
            <h2 className='text-center mt-3 display-4'>Showing Results for <strong className='text-danger'>{query.toUpperCase()}, {images.length}</strong></h2>
          </div>
        )}
        </div>

      {/* Loading & Error */}
      {loading && (
        <div className="my-5 text-center">
            <h2 className="text-center display-4 fw-bold">
              Loading Images from Unsplash API, Please Wait...
            </h2>
            <ClipLoader color="red" size={150} />
        </div>
      )}

      {error && <p className="text-danger text-center">{error}</p>}

      {/* Images Grid */}
      <div className="row justify-content-center">
            {images.map((img, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card h-100 shadow-sm">
                    <img
                    src={img.urls.regular}
                    alt={img.alt_description || "unsplash image"}
                    className="card-img-top"
                    style={{ height: "400px", objectFit: "cover" }}
                    />
                    <div className="card-body p-3">
                      <p className="card-title mb-1">
                          {img.alt_description || "Untitled"}
                      </p>
                    
                      <div className="d-flex align-items-center justify-content-between gap-2 mt-2">
                        <Tooltip key={index} placement='top' color='red' arrow={true} title="Photographer">
                        <div className="btn-sm">
                        <img
                          src={img.user.profile_image.small}
                          alt={img.user.name}
                          className="rounded-circle me-2 border"
                          width="36"
                          height="36"
                        />
                        <a
                          href={img.user.links.html}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none text-muted small"
                        >
                          {img.user.name}
                        </a>
                         </div>
                        </Tooltip>
                         {/* Likes */}
                         <Tooltip key={index} placement='top' color='red' arrow={true} title={img.likes + " Likes"}>
                         <p className="mb-0 mt-0 text-muted small">❤️ {img.likes} Likes</p>
                         </Tooltip>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="d-flex justify-content-between mt-3 mb-3">
                        <a
                          href={img.urls.full}
                          target="_blank"
                          rel="noopener nofollow"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Full Image
                        </a>
                        <a
                          href={`${img.links.download}?force=true`}
                          target="_blank"
                          download
                          rel="nofollow"
                          className="btn btn-sm btn-outline-success"
                        >
                          <FaDownload /> Download
                        </a>
                      </div>

                    </div>
                </div>
                </div>
            ))}
       </div>


      {/* Ant Design Pagination */}
      {images.length > 0 && (
        <>
          <div className="text-center mb-2 text-muted">
            Page {page} of {totalPages}
          </div>

          <div className="d-flex justify-content-center">
            <Pagination
              current={page}
              pageSize={perPage}
              total={totalResults}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}


    </div>
  );
};

export default ImageApps;

// Total page number display like: "Page 2 of 20"