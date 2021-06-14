import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import styled from "styled-components"

function BoardGameList() {
  // GET Field Logic
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
      <Card key={boardGame.id} style={{ width: "15vw", margin: "8px" }}>
          <div style={{width: "15vw", height: "20vw"}}>
                <Card.Img style={{maxWidth: "100%", maxHeight: "90%"}} src={`${boardGame.image}`} />
          </div>
        <Card.Body>
            <div style={{height: "7vw"}}>
                <Card.Title style={{fontSize: "1rem"}}>{boardGame.title}</Card.Title>
            </div>
          <Link
            to={(location) => {
              location.pathname = `/boardgames/${boardGame.id}`;
              dispatch({ type: "setSelectedBoardGame", payload: boardGame });
            }}
          >
            <button>More Info</button>
          </Link>
        </Card.Body>
      </Card>
    );
  });

  return (
    <div>
      <form>
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </form>
      <Link to={(location) => (location.pathname = "/boardgames/new")}>
        Add A Boardgame
      </Link>
      <br />
      <CardDeck style={{display: "flex", flexWrap: "wrap"}}>{boardGameLinks}</CardDeck>
    </div>
  );
}

export default BoardGameList;
