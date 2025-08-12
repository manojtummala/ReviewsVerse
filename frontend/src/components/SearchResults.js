import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/api";
import { FormControl, Container, Navbar, ListGroup } from "react-bootstrap";
import {
  StarFill,
  ChatDots,
  ArrowUp,
  ArrowDown,
  Share,
  FlagFill,
  Flag,
  Mic,
  Person,
} from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import PostSection from "./PostSection";
import { timeAgo } from "../utils/functions";
import { debounce } from "lodash";
import LoginModal from "./LoginModal";
import AccountModal from "./AccountModal";
import AuthContext from "../context/AuthContext";

function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("q");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [addOnSearchTerm, setAddOnSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const { user } = useContext(AuthContext);

  const handleAddOnClick = (addOn) => {
    setSelectedAddOns((prevSelectedAddOns) => {
      if (prevSelectedAddOns.includes(addOn)) {
        return prevSelectedAddOns.filter((item) => item !== addOn);
      } else {
        return [...prevSelectedAddOns, addOn];
      }
    });
  };

  const filteredAddOns = subTopics.filter((addOn) =>
    addOn.toLowerCase().includes(addOnSearchTerm.toLowerCase())
  );

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/reviews/topic", {
        params: { query: searchTerm, topicID: selectedAddOns.join(",") },
      });
      let reviews = response.data;
      if (selectedAddOns.length > 0) {
        reviews = reviews.filter((review) =>
          selectedAddOns.every((addOn) =>
            review.subTopics.some(
              (subTopic) => subTopic.toLowerCase() === addOn.toLowerCase()
            )
          )
        );
      }
      setReviews(reviews);
    } catch (error) {
      console.error("Error fetching search results", error);
      setReviews([]);
    }
  };

  const fetchSubTopics = async () => {
    try {
      const response = await axios.get("/subtopics/search", {
        params: { query: searchTerm },
      });

      // Flatten the subTopics array from the API response
      const flattenedSubTopics = response.data.reduce(
        (acc, topic) => [...acc, ...topic.subTopics],
        []
      );

      setSubTopics(flattenedSubTopics);
    } catch (error) {
      console.error("Error fetching subtopics", error);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get("/topics/search", {
        params: { query: query },
      });

      const suggestions = response.data.map((topic) => topic.name);

      const filteredSuggestions = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions", error);
    }
  };

  const debouncedFetchSuggestions = debounce((query) => {
    fetchSuggestions(query);
  }, 300);

  useEffect(() => {
    fetchReviews();
    fetchSubTopics();
  }, [searchTerm, selectedAddOns]);

  const refreshContent = () => {
    fetchReviews();
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedFetchSuggestions(value);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate(`?q=${searchTerm}`);
      fetchReviews();
      fetchSubTopics();
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    navigate(`?q=${suggestion}`);
    fetchReviews();
    fetchSubTopics();
    setSuggestions([]);
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  const toggleAccountModal = () => {
    setShowAccountModal(!showAccountModal);
  };

  const handleVote = async (reviewId, type) => {
    if (!user) {
      toggleLoginModal();
      return;
    }

    try {
      const response = await axios.post(`/reviews/vote`, {
        reviewId,
        type,
      });
      if (response.data.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error(`Error ${type}ing review:`, error);
    }
  };

  return (
    <Container className="search-results-page" fluid>
      <Navbar
        className="d-flex justify-content-between"
        style={{ padding: "20px 30px" }}
      >
        <span style={{ fontWeight: "500", fontSize: "2em" }}>Review Verse</span>
        <div className="search-container">
          <FormControl
            type="text"
            placeholder="Search Something"
            className="search-input"
            style={{ boxShadow: "none", width: "100%" }}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
          />
          {suggestions.length > 0 && (
            <ListGroup
              style={{
                position: "absolute",
                width: "29%",
                top: 65,
                zIndex: 1000,
                backgroundColor: "white",
              }}
            >
              {suggestions.map((suggestion, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <div className="vertical-line mx-3"></div>
          <Mic style={{ cursor: "pointer" }} />
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "10px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => {
            if (user) {
              toggleAccountModal();
            } else {
              toggleLoginModal();
            }
          }}
        >
          <Person size={24} />
        </div>
      </Navbar>

      <Container className="mt-4" fluid>
        <div style={{ display: "flex" }} className="header-container">
          <div className="header-section" style={{ flexBasis: "55%" }}>
            <div className="search-term-display">
              <h2 style={{ marginBottom: "10px" }}>
                {searchTerm} <StarFill color="gold" />
              </h2>
            </div>
            <div>
              {selectedAddOns.map((addOn, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: "#8DB3EB",
                    display: "inline-block",
                    borderRadius: "20px",
                    padding: "5px 15px",
                    margin: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() => handleAddOnClick(addOn)}
                >
                  {addOn}
                </span>
              ))}
            </div>
          </div>

          <div className="add-ons-section" style={{ flexBasis: "45%" }}>
            <div className="search-more">
              <FormControl
                type="text"
                placeholder="Search more"
                className="search-more-input"
                style={{ boxShadow: "none", marginBottom: "10px" }}
                value={addOnSearchTerm}
                onChange={(e) => setAddOnSearchTerm(e.target.value)}
              />
            </div>
            <div className="add-ons">
              {filteredAddOns.map((addOn, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    backgroundColor: selectedAddOns.includes(addOn)
                      ? "#8DB3EB"
                      : "#8DB3EB",
                    borderRadius: "20px",
                    padding: "5px 15px",
                    margin: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() => handleAddOnClick(addOn)}
                >
                  {addOn}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="reviews-section mt-4">
          <div className="review-cards-container">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="review-card"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1.0)")
                  }
                  style={{
                    transition: "transform 0.2s",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p className="review-user">
                      <span className="review-time">
                        {timeAgo(review.timestamp)}
                        {" by "}
                      </span>
                      {review.userName}
                    </p>
                    <div className="review-rating">
                      {Array.from({ length: review.rating }, (_, index) => (
                        <StarFill key={index} color="gold" />
                      ))}
                    </div>
                  </div>
                  <p>{review.reviewText}</p>
                  <div
                    className="review-footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="review-votes"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <ArrowUp
                        onClick={() => handleVote(review.id, "upvote")}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ margin: "0 10px" }}>{review.upVotes}</span>
                      <ArrowDown
                        onClick={() => handleVote(review.id, "downvote")}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ marginLeft: "10px" }}>
                        {review.downVotes}
                      </span>
                    </div>
                    <div
                      className="review-actions"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <ChatDots
                        style={{ cursor: "pointer", marginRight: "10px" }}
                      />
                      <Share
                        onClick={() => handleVote(review.id, "share")}
                        style={{ cursor: "pointer", marginRight: "15px" }}
                      />
                      <span>{review.shares}</span>
                      {review.report ? (
                        <FlagFill
                          color="red"
                          onClick={() => handleVote(review.id, "report")}
                          style={{ cursor: "pointer", marginLeft: "15px" }}
                        />
                      ) : (
                        <Flag
                          onClick={() => handleVote(review.id, "report")}
                          style={{ cursor: "pointer", marginLeft: "15px" }}
                        />
                      )}
                      {/* <span>{review.reportCount}</span> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews found for "{searchTerm}".</p>
            )}
          </div>
        </div>
        <PostSection
          searchTerm={searchTerm}
          selectedAddOns={selectedAddOns}
          refreshContent={refreshContent}
        />
      </Container>
      {/* Login Modal */}
      <LoginModal show={showLoginModal} handleClose={toggleLoginModal} />

      {/* Account Modal */}
      <AccountModal show={showAccountModal} handleClose={toggleAccountModal} />
    </Container>
  );
}

export default SearchResultsPage;
