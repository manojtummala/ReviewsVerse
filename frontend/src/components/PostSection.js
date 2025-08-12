import React, { useState, useContext } from "react";
import ReactQuill from "react-quill";
import AuthContext from "../context/AuthContext";
import "react-quill/dist/quill.snow.css";
import { FaStar } from "react-icons/fa";
import axios from "../utils/api";
import DOMPurify from "dompurify";

function PostSection({ searchTerm, selectedAddOns, refreshContent }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const { user } = useContext(AuthContext);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handlePostReview = async () => {
    if (!user) {
      alert("You must be logged in to post a review.");
      return;
    }

    if (!reviewText.trim()) {
      alert("Review text cannot be empty.");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating before posting your review.");
      return;
    }

    try {
      const sanitizedReviewText = DOMPurify.sanitize(reviewText, {
        ALLOWED_TAGS: [],
      });

      const reviewData = {
        userId: user._id,
        userName: user.name,
        topicName: searchTerm,
        subTopics: selectedAddOns,
        reviewText: sanitizedReviewText,
        rating: rating,
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post("/reviews/topic", reviewData);
      console.log("Review submitted successfully:", response.data);

      setReviewText("");
      setRating(0);
      handleFocus();
      handleBlur();
      refreshContent();
    } catch (error) {
      console.error("Error posting or updating review:", error);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
    document.querySelector(".reviews-section").style.filter = "blur(5px)";
  };

  const handleBlur = () => {
    setIsExpanded(false);
    document.querySelector(".reviews-section").style.filter = "none";
  };

  return (
    <div className="post-section" style={{ marginTop: "40px" }}>
      {!isExpanded ? (
        <textarea
          placeholder="Write Something..."
          style={{
            height: "50px",
            padding: "12px",
            border: "none",
            resize: "none",
          }}
          onFocus={handleFocus}
        />
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            {[...Array(5)].map((star, index) => {
              const starValue = index + 1;
              return (
                <FaStar
                  key={index}
                  size={30}
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  onClick={() => handleRatingChange(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </div>
          <ReactQuill
            value={reviewText}
            onChange={setReviewText}
            placeholder="Type your Review..."
            onBlur={handleBlur}
            style={{
              height: "100%",
              borderRadius: "10px",
              marginBottom: "20px",
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              width: "100%",
              float: "left",
              border: "none",
            }}
            modules={{
              toolbar: {
                container: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                ],
              },
            }}
          />
        </div>
      )}
      <button
        style={{
          backgroundColor: "#5cb85c",
          color: "white",
          border: "none",
          marginLeft: "20px",
          padding: "10px 20px",
          borderRadius: "20px",
          cursor: "pointer",
          fontSize: "16px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
        onClick={handlePostReview}
      >
        Post
      </button>
    </div>
  );
}

export default PostSection;
