import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import styled from 'styled-components';

const StyledInput = styled.input`
  color: #fcfcd4;
  border-radius: 5px;
  border: 1px solid #344a53;
  text-align: center;
  background-color: #344a53;
  margin: 4vh;
`;

const StyledP = styled.label`
  color: #344a53;
  width: fit-content;
  margin: 2vw;
`;

function NewSessionForm() {
  const allUsers = useSelector((state) => state.userReducer.users);
  const playedBoardGame = useSelector(
    (state) => state.boardGameReducer.selectedBoardGame
  );
  const loggedInUser = useSelector(state => state.userReducer.user)
  const [datePlayed, setDatePlayed] = useState(null);
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null)
  const history = useHistory()
  const dispatch = useDispatch()

  function checkPlayer(id) {
    if (players.includes(id)) {
      setPlayers(() =>
        players.filter((player) => parseInt(player) !== parseInt(id))
      );
    } else {
      setPlayers([...players, id]);
    }
  }

  let allUsersCheckBoxes = [];

  let winnerDropDownOptions = []

  if (allUsers) {
    if (allUsers[0]) {
      allUsersCheckBoxes = allUsers.map((user) => {
        return (
          <Fragment key={user.id}>
            <StyledP for={user.username}>{`${user.username} `}</StyledP>
            <input
              type="checkbox"
              value={user.id}
              id={user.username}
              onChange={(e) => checkPlayer(e.target.value)}
            />
            <br></br>
          </Fragment>
        );
      });

      winnerDropDownOptions = allUsers.map(user => {
          return (
              <option key={user.id} value={user.id}>{user.username}</option>
          )
      })
    } else {
        fetch("http://localhost:3000/api/v1/users", {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      })
        .then((res) => res.json())
        .then((userList) => {
          dispatch({ type: "setUsers", payload: userList });
        });
    }
  }

  function handleSubmit(e) {
      e.preventDefault()
      if(!datePlayed){
          alert("Must Select Date")
          return null
      }
      if(!winner){
          alert("Must Select Winner")
          return null
      }
      if(!players.includes(winner)){
          return alert("Must Include Winning Player")  
      }
      fetch("http://localhost:3000/api/v1/sessions", {
          method: "POST",
          headers: {
              'content-type': "application/json",
              Authorization: `Bearer ${localStorage.token}`
          },
          body: JSON.stringify({
              date: datePlayed,
              boardgame_id: playedBoardGame.id,
              winner: winner,
              players: players 
          })
      })
        .then((res) => res.json())
        .then((sessionInfo) => {
          dispatch({type: "setSession", paylod: sessionInfo});
          fetch("http://localhost:3000/api/v1/boardgames")
          .then((res) => res.json())
          .then((boardGameList) => {
              dispatch({ type: "setBoardGames", payload: boardGameList });
            });

            fetch(`http://localhost:3000/api/v1/boardgames/${playedBoardGame.id}`)
          .then((res) => res.json())
          .then((boardGameList) => {
              dispatch({ type: "setSelectedBoardGame", payload: boardGameList });
            });
            
            fetch("http://localhost:3000/api/v1/users", {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`
                }
            })
            .then((res) => res.json())
            .then((userList => {
                dispatch({ type: "setUsers", payload: userList });
            })); 
            
            fetch(`http://localhost:3000/api/v1/users/${loggedInUser.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`
                }
            })
            .then((res) => res.json())
            .then((user => {
                user.token = localStorage.token 
                dispatch({ type: "setUser", payload: user });
                history.push(`/sessions/${sessionInfo.id}`)
            })); 
        });
            
  }

  return (
      <form onSubmit={(e) => handleSubmit(e)}>
          <StyledP>Date Game Played: </StyledP>
          <StyledInput type="date" value={datePlayed} onChange={(e) => setDatePlayed(e.target.value) }/>
          <br/>
          <StyledP>Select Players: </StyledP>
          <br/>
          {allUsersCheckBoxes}
          <br/>
          <StyledP>Select Winner: </StyledP>
          <br/>
          <StyledInput as="select" onChange={(e) => setWinner(e.target.value)}>
            {winnerDropDownOptions}
          </StyledInput>
          <br/>
          <StyledInput type="submit" value="Log Session"/>
      </form>
  );
}

export default NewSessionForm;
