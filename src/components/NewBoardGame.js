import { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from 'styled-components'

const StyledForm = styled.form`
  position: relative;
  margin: auto;
  text-align: center;
  justify-content: center;
  padding: 5px;
  width: fit-content;
`

const StyledLabel = styled.label`
  color: #39FF14;
  `

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
  `

function NewBoardGame() {
  const [title, setTitle] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState("");
  const [upcCode, setUpcCode] = useState('')

  const history = useHistory()

  

  function handleNewBoardGame(e) {
    e.preventDefault();

    fetch("http://localhost:3000/api/v1/boardgames", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        title: title,
        manufacturer: manufacturer,
        description: description
      }),
    })
      .then((res) => res.json())
      .then((text) => {
        //console.log(text)
        history.push(`/boardgames/${text.boardgame.id}`)
      });
  }

  if(!localStorage.token){
    return <h2>Please Log In or Sign Up</h2>
  }

  return (
    <StyledForm onSubmit={handleNewBoardGame}>
      <StyledLabel style={{fontWeight: "bolder"}}>New Boardgame</StyledLabel><br/>
      <br/>
      <StyledLabel>Title</StyledLabel>
      <StyledInput
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <StyledLabel>Manufacturer</StyledLabel>
      <StyledInput
        type="text"
        name="manufacturer"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
      />
      <StyledLabel>Description</StyledLabel>
      <StyledInput
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <StyledInput as='button' type="submit">Submit New Game</StyledInput>
    </StyledForm>
  );
}

export default NewBoardGame;