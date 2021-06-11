import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
import NewReview from "./NewReview";
import EditReview from "./EditReview";

function BoardGameShow() {
  // GET Field Logic
  const [newReviewForm, setNewReviewForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editId, setEditId] = useState(0);
  const boardGame = useSelector(
    (state) => state.boardGameReducer.selectedBoardGame
  );
  const user = useSelector((state) => state.userReducer.user);
    console.log(boardGame)
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
      setNewReviewForm(false)
    setEditForm(!editForm);
    setEditId(id);
  }

  function handleAddToShelf() {
    fetch(`http://localhost:3000/api/v1/gameowners`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({
        user_id: localStorage.userId,
        boardgame_id: boardGame.id,
      }),
    })
      .then((res) => res.json())
      .then((gameOwnerInfo) => {
          if(gameOwnerInfo.message){
              alert(`${gameOwnerInfo.message}`)
              return null 
          }
        dispatch({type: "addToOwnedGames", payload: gameOwnerInfo})
      });
  }

  return (
    <div>
      <h4>
        {boardGame.title}
        {boardGame.description}
        {boardGame.manufacturer}
        <ul>
          Reviews
          {boardGame.reviews ? boardGame.reviews.map((review) => (
            <li key={review.id}>
              <p>Title: {review.title}</p>
              <p>Description: {review.description}</p>
              <p>Overall Rating: {review.overall_rating}</p>
              <p>Replayability Score: {review.replayability}</p>
              <p>
                First Time Difficulty Rating: {review.first_time_difficulty}
              </p>
              {parseInt(review.user_id) === parseInt(user.id) ? (
                <button onClick={() => handleDeleteReview(review.id)}>
                  Delete Review
                </button>
              ) : null}
              {parseInt(review.user_id) === parseInt(user.id) ? (
                <button onClick={() => handleEditReview(review.id)}>
                  Edit Review
                </button>
              ) : null}
            </li>
          )) : null}
        </ul>
      </h4>
      <button onClick={() => setNewReviewForm(!newReviewForm)}>
        Add A Review
      </button>
      <button onClick={() => handleAddToShelf()}>
        Add to Shelf
      </button>
      {newReviewForm ? <NewReview /> : null}
      {editForm ? <EditReview editId={editId} /> : null}
    </div>
  );
}

export default BoardGameShow;
