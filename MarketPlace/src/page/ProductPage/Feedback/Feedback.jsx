import React, { useState, useEffect } from "react";
import HeaderFeedback from "./HeaderFeedback";
import RatingInfo from "./RatingInfo";
import Comment from "./Comment";
import { countRating,sortByNewest } from "../../../utils/utils";
import { reviewProduct } from "../../../services/reviewService";
function Feedback(props) {
  const [feedbacks, setFeedback] = useState([]);
  const [rateList, setRateList] = useState([]);
  const [sort,setSort]=useState(false);
  async function getReview(id) {
    try {
      const data = await reviewProduct(id);
      if (sort){
          setFeedback(sortByNewest(data.reviews));
      }
      else{
         setFeedback(data.reviews);
      }
      setRateList(countRating(data.reviews));
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    getReview(props.id);
    const interval = setInterval(() => {
      getReview(props.id);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="feedback-container">
      <HeaderFeedback onSort={setSort}/>
      <RatingInfo rateList={rateList} />
      {feedbacks.map((feedback, index) => {
        if (feedback.comment !== "") {
          return (
            <div key={index}>
              <Comment
                id={feedback.id}
                rating={feedback.rating}
                author={feedback.username}
                createAt={feedback.created_at}
                avatar={feedback.avatar_url || ""}
                content={feedback.comment}
                replies={false}
                numberReplies={feedback.replies.length}
              />
              {feedback.replies.map((reply, index) => {
                return (
                  <div style={{ marginLeft: "50px", width: "100%" }}>
                    <Comment
                      id={feedback.id}
                      rating={0}
                      author={reply.username}
                      createAt={reply.created_at}
                      avatar={reply.avatar_url || ""}
                      content={reply.comment}
                      replies={true}
                    />
                  </div>
                );
              })}

              <hr
                style={{ alignSelf: "center", width: "95%", color: "gray" }}
              />
            </div>
          );
        }
      })}
    </div>
  );
}
export default Feedback;
