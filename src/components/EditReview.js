import { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

const StyledForm = styled.form`
  position: relative;
  margin: auto;
  text-align: center;
  justify-content: center;
  padding: 5px;
  width: fit-content;
`;

const StyledLabel = styled.label`
  color: #39ff14;
`;

const StyledInput = styled.input`
  display: block;
  color: magenta;
  border-radius: 5px;
  border: 1px solid black;
  text-align: center;
  margin: auto;
  text-align-last: center;
  width: 100%;
  box-sizing: border-box;
`;

function EditReview({ editId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [replayability, setReplayability] = useState(0);
  const [firstTimeDifficulty, setFirstTimeDifficulty] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user.id);
  const boardgame = useSelector(
    (state) => state.boardGameReducer.selectedBoardGame.id
  );

  function handleEditReview(e) {
    e.preventDefault();

    fetch(`http://localhost:3000/api/v1/reviews/${editId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        overall_rating: overallRating,
        replayability: replayability,
        first_time_difficulty: firstTimeDifficulty,
        user_id: user,
        boardgame_id: boardgame,
      }),
    })
      .then((res) => res.json())
      .then((updatedBoardGame) => {
        const validations = Object.keys(updatedBoardGame);
        if (
          Object.keys(updatedBoardGame).find(
            (elem) =>
              elem === "overall_rating" ||
              elem === "replayability" ||
              elem === "first_time_difficulty"
          )
        ) {
          const userMessage = validations
            .map(
              (validation) => `${validation} ${updatedBoardGame[validation]}`
            )
            .join(" ");
          alert(userMessage);
          return null;
        }
        dispatch({ type: "updateBoardGame", payload: updatedBoardGame });
      });
  }

  if (!localStorage.token) {
    return <h2>Please Log In or Sign Up</h2>;
  }

  return (
    <StyledForm onSubmit={handleEditReview}>
      <StyledLabel style={{ fontWeight: "bolder" }}>Edit Review</StyledLabel>
      <br />
      <br />
      <StyledLabel>Title</StyledLabel>
      <StyledInput
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <StyledLabel>Description</StyledLabel>
      <StyledInput
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <StyledLabel>Overall Rating</StyledLabel>
      <StyledInput
        type="number"
        value={overallRating}
        onChange={(e) => setOverallRating(e.target.value)}
      />
      <StyledLabel>Replayability</StyledLabel>
      <StyledInput
        type="number"
        value={replayability}
        onChange={(e) => setReplayability(e.target.value)}
      />
      <StyledLabel>First Time Difficulty</StyledLabel>
      <StyledInput
        type="number"
        value={firstTimeDifficulty}
        onChange={(e) => setFirstTimeDifficulty(e.target.value)}
      />
      <StyledInput as="button" type="submit">
        Submit Edited Review
      </StyledInput>
    </StyledForm>
  );
}

export default EditReview;
