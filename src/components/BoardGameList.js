import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import styled from "styled-components";

const StyledInput = styled.input`
  color: #FCFCD4;
  border-radius: 5px;
  border: 1px solid black;
  background-color: #344A53;
  margin: auto;
  box-sizing: border-box;
  `

function BoardGameList() {
  const [searchTerm, setSearchTerm] = useState("");
  const boardGames = useSelector((state) => state.boardGameReducer.boardGames);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!boardGames[0]) {
      fetch("http://localhost:3000/api/v1/boardgames")
        .then((res) => res.json())
        .then((boardGameList) => {
          dispatch({ type: "setBoardGames", payload: boardGameList });
        });
    }
  }, [dispatch, boardGames]);

  if (!boardGames[0]) {
    return <h2>Loading</h2>;
  }

  const searchBoardGames = boardGames.filter((boardGame) => {
    return (
      boardGame.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boardGame.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boardGame.upc_code.includes(searchTerm)
    );
  });

  const boardGameLinks = searchBoardGames.map((boardGame) => {
    return (
      <Link
        to={(location) => {
          location.pathname = `/boardgames/${boardGame.id}`;
        }}
        onClick={() => dispatch({ type: "setSelectedBoardGame", payload: boardGame })}
        key={boardGame.id}
      >
        <Card  style={{ width: "15vw", margin: "8px" }}>
          <div style={{ width: "15vw", height: "20vw" }}>
            <Card.Img
              style={{ maxWidth: "100%", maxHeight: "90%", borderRadius: "25%" }}
              src={`${boardGame.image}`}
            />
          </div>
          <Card.Body>
            <div style={{ height: "7vw" }}>
              <Card.Title style={{ fontSize: ".8rem", color: "#344A53" }}>
                {boardGame.title}
              </Card.Title>
            </div>
          </Card.Body>
        </Card>
      </Link>
    );
  });

  return (
    <div>
      <div style={{margin: "4vh"}} >
      <form style={{display: "inline", margin: "4vh"}}>
        <label style={{color: "#344A53", fontWeight: "bolder", margin: "4vh"}}>Search Boardgames:</label>
        <StyledInput
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </form>
      <Link to={(location) => (location.pathname = "/boardgames/new")} style={{display: "inline", float: "right", marginRight: "4vh", color: "#344A53", fontWeight: "bolder"}}>
        Can't Find It?
      </Link>
      </div>
      <br />
      <CardDeck
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", textAlign: "center" }}
      >
        {boardGameLinks}
      </CardDeck>
    </div>
  );
}

export default BoardGameList;
