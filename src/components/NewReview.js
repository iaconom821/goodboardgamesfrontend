import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

const StyledDiv = styled.div`
  margin: auto;
  margin-top: 10vh;
  background-color: #FCFCD4;
  width: fit-content;
  border-radius: 6px;
  border: 2px solid #344A53;`

const StyledForm = styled.form`
  position: relative;
  margin: auto;
  text-align: center;
  justify-content: center;
  padding: 5px;
`

const StyledLabel = styled.label`
  color: #79B7CF;
  text-align: center;
  margin: 10px;
  font-weight: bold;
  `

const StyledInput = styled.input`
  display: block;
  color: #FCFCD4;
  border-radius: 5px;
  border: 1px solid black;
  text-align: center;
  background-color: #344A53;
  margin: auto;
  box-sizing: border-box;
  `

function NewReview({closeNewReviewAfterSubmission}) {
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

  function handleNewReview(e) {
    e.preventDefault();

    fetch("http://localhost:3000/api/v1/reviews", {
      method: "POST",
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
              elem === "first_time_difficulty" ||
              elem === "user_id" 
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
        closeNewReviewAfterSubmission();
      });
  }

  if (!localStorage.token) {
    return <h2>Please Log In or Sign Up</h2>;
  }

  return (
    <StyledDiv>
      <StyledLabel as="h2" style={{ fontWeight: "bolder" }}>New Review</StyledLabel>
    <StyledForm onSubmit={handleNewReview}>
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
      <StyledInput as="button" type="submit" style={{marginTop: "2vh"}}>
        Submit New Review
      </StyledInput>
    </StyledForm>
    </StyledDiv>
  );
}

export default NewReview;
