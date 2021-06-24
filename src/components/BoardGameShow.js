import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { useState } from "react";
import NewReview from "./NewReview";
import EditReview from "./EditReview";
import NewSessionForm from "./NewSessionForm.js"
import styled from "styled-components";


const StyledP = styled.p`
  color: #344a53;
  width: fit-content;
  display: block;
  margin: 2vw;
`;

const StyledPReview = styled.p`
  color: #344a53;
  width: fit-content;
  display: block;
  margin: 4vw;
  margin-top: 2px;
  margin-bottom: 2px;
`;

const StyledDiv = styled.div`
  margin: auto;
  display: flex;
  width: fit-content;
  justify-content: center;
`;

const StyledInnerDiv = styled.div`
  margin: 4vh;
  border: 1px solid #c5a4c7;
`;
const StyledImg = styled.img`
  border-radius: 25%;
  width: 50vh;
`;

const StyledInput = styled.input`
  color: #fcfcd4;
  border-radius: 5px;
  border: 1px solid #344a53;
  text-align: center;
  background-color: #344a53;
  margin: 4vh;
`;

const StyledReviewDiv = styled.li`
  background: #FCFCD4;
  border-radius: 4px;
  margin: 1vh;
  padding: 1vh;
`;

function BoardGameShow() {
  // GET Field Logic
  const [newReviewForm, setNewReviewForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editInfo, setEditInfo] = useState(null);
  const [newSessionForm, setNewSessionForm] = useState(false);
  const boardGame = useSelector(
    (state) => state.boardGameReducer.selectedBoardGame
  );
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  if (!boardGame) {
    fetch(`http://localhost:3000/api/v1/boardgames/${id}`)
      .then((res) => res.json())
      .then((selectedBoardGame) => {
        dispatch({
          type: "setSelectedBoardGameFromFetch",
          payload: selectedBoardGame,
        });
      });

    return <h2>Loading</h2>;
  }

  function handleDeleteReview(id) {
    fetch(`http://localhost:3000/api/v1/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => res.json())
      .then((updatedBoardGame) => {
        setEditForm(false);
        dispatch({ type: "updateBoardGame", payload: updatedBoardGame });
      });
  }

  function handleEditReview(reviewData) {
    setNewReviewForm(false);
    setEditForm(!editForm);
    setEditInfo(reviewData);
  }

  function closeNewReviewAfterSubmission() {
    setNewReviewForm(false)
  }

  function closeEditReviewAfterSubmission(){
    setEditForm(false)
  }

  function handleAddToShelf() {
    fetch(`http://localhost:3000/api/v1/gameowners`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        user_id: localStorage.userId,
        boardgame_id: boardGame.id,
      }),
    })
      .then((res) => res.json())
      .then((gameOwnerInfo) => {
        if (gameOwnerInfo.message) {
          alert(`${gameOwnerInfo.message}`);
          return null;
        }
        dispatch({ type: "addToOwnedGames", payload: gameOwnerInfo });
        history.push(`/users/${user.id}`)
      });
  }

  if (parseInt(boardGame.id) !== parseInt(id)) {
    dispatch({ type: "setSelectedBoardGameFromIdOnly", payload: id });
  }

  if(!boardGame.reviews){
    if(!boardGame.reviews[0]){
      return null 
    }
    return null 
  }

  if(!user){
    return null 
  }
  
  if(!localStorage.token) {
    return (
      <h2>Please Log In or Sign Up</h2>
    )
  }

  return (
    <div>
      <StyledDiv>
        <StyledInnerDiv>
          <StyledP as="h3">Title: {boardGame.title}</StyledP>
          <StyledP as="h4">Description: {boardGame.description}</StyledP>
          <StyledP as="h4">Brand: {boardGame.manufacturer}</StyledP>
        </StyledInnerDiv>
        <StyledInnerDiv>
          <StyledImg src={boardGame.image} alt="game" />
        </StyledInnerDiv>
      </StyledDiv>
      <div style={{display: "flex"}}>
        <div style={{width: "100%"}}>
          <StyledP as="h3">Reviews</StyledP>
          <ul
            style={{ listStyle: "none", width: "fit-content", padding: "1vw" }}
          >
            {boardGame.reviews
              ? boardGame.reviews.map((review) => (
                  <StyledReviewDiv
                    key={review.id}
                  >
                    <StyledPReview>Title: {review.title}</StyledPReview>
                    <StyledPReview>
                      Description: {review.description}
                    </StyledPReview>
                    <StyledPReview>
                      Overall Rating: {review.overall_rating}
                    </StyledPReview>
                    <StyledPReview>
                      Replayability Score: {review.replayability}
                    </StyledPReview>
                    <StyledPReview>
                      First Time Difficulty Rating: 
                      {review.first_time_difficulty}
                    </StyledPReview>
                    {parseInt(review.user_id) === parseInt(user.id) ? (
                      <StyledInput
                        as="button"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete Review
                      </StyledInput>
                    ) : null}
                    {parseInt(review.user_id) === parseInt(user.id) ? (
                      <StyledInput
                        as="button"
                        onClick={() => handleEditReview(review)}
                      >
                        Edit Review
                      </StyledInput>
                    ) : null}
                  </StyledReviewDiv>
                ))
              : null}
          </ul>
          {newReviewForm ? <NewReview closeNewReviewAfterSubmission={closeNewReviewAfterSubmission}/> : null}
          {editForm ? <EditReview editInfo={editInfo} closeEditReviewAfterSubmission={closeEditReviewAfterSubmission} /> : null}
          {user.name ? (
            <>
              <StyledInput
                as="button"
                onClick={() => setNewReviewForm(!newReviewForm)}
              >
                Add A Review
              </StyledInput>
              <StyledInput as="button" onClick={() => handleAddToShelf()}>
                Add to Game Shelf
              </StyledInput>
            </>
          ) : null}
        </div>
        <div style={{width: "100%"}}>
          <h3>Sessions</h3>
            {boardGame.sessions ? boardGame.sessions.map(session => {
              return (
              <Link to={location => location.pathname = `/sessions/${session.id}`} key={session.id}>
                <StyledPReview>
                  {session.date}
                </StyledPReview>
              </Link>)
            }) : null}
          <StyledInput as="button" onClick={()=>setNewSessionForm(!newSessionForm)}>Add a Session</StyledInput>
          {newSessionForm ? <NewSessionForm /> : null}
        </div>
      </div>
    </div>
  );
}

export default BoardGameShow;
