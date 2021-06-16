import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
import NewReview from "./NewReview";
import EditReview from "./EditReview";
import styled from "styled-components";

const StyledP = styled.p`
  color: #344a53;
  width: fit-content;
  display: block;
  margin: 4vw;
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
  width: 40vw;
`;

const StyledInput = styled.input`
  color: #FCFCD4;
  border-radius: 5px;
  border: 1px solid #344A53;
  text-align: center;
  background-color: #344A53;
  margin: 4vh;
  `

function BoardGameShow() {
  // GET Field Logic
  const [newReviewForm, setNewReviewForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editId, setEditId] = useState(0);
  const boardGame = useSelector(
    (state) => state.boardGameReducer.selectedBoardGame
  );
  const user = useSelector((state) => state.userReducer.user);
  console.log(boardGame);
  const dispatch = useDispatch();
  const { id } = useParams();

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

  function handleEditReview(id) {
    setNewReviewForm(false);
    setEditForm(!editForm);
    setEditId(id);
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
      });
  }

  if (parseInt(boardGame.id) !== parseInt(id)) {
    dispatch({ type: "setSelectedBoardGameFromIdOnly", payload: id });
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
          <StyledImg src={boardGame.image} alt="game"/>
        </StyledInnerDiv>
      </StyledDiv>
      <ul>
        <StyledP as="h3">Reviews</StyledP>
        {boardGame.reviews
          ? boardGame.reviews.map((review) => (
              <li key={review.id}>
                <StyledPReview>Title: {review.title}</StyledPReview>
                <StyledPReview>Description: {review.description}</StyledPReview>
                <StyledPReview>Overall Rating: {review.overall_rating}</StyledPReview>
                <StyledPReview>Replayability Score: {review.replayability}</StyledPReview>
                <StyledPReview>
                  First Time Difficulty Rating: {review.first_time_difficulty}
                </StyledPReview>
                {parseInt(review.user_id) === parseInt(user.id) ? (
                  <StyledInput as="button" onClick={() => handleDeleteReview(review.id)}>
                    Delete Review
                  </StyledInput>
                ) : null}
                {parseInt(review.user_id) === parseInt(user.id) ? (
                  <StyledInput as="button" onClick={() => handleEditReview(review.id)}>
                    Edit Review
                  </StyledInput>
                ) : null}
              </li>
            ))
          : null}
      </ul>
      {newReviewForm ? <NewReview /> : null}
      {editForm ? <EditReview editId={editId} /> : null}
      {user.name ? (
        <>
          <StyledInput as="button" onClick={() => setNewReviewForm(!newReviewForm)}>
            Add A Review
          </StyledInput>
          <StyledInput as="button" onClick={() => handleAddToShelf()}>Add to Game Shelf</StyledInput>
        </>
      ) : null}

    </div>
  );
}

export default BoardGameShow;
