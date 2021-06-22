import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Fragment } from "react";
import { useHistory } from "react-router-dom"
function NewSessionForm() {
  const allUsers = useSelector((state) => state.userReducer.users);
  const playedBoardGame = useSelector(
    (state) => state.boardGameReducer.selectedBoardGame
  );
  const loggedInUser = useSelector(state => state.userReducer.user)
  const [datePlayed, setDatePlayed] = useState(null);
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(`${loggedInUser.id}`)
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
            <label for={user.username}>{`${user.username} `}</label>
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
      if(!players.includes(winner)){
          return alert("Must Select Winning Player")  
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
          console.log(sessionInfo);
          dispatch({type: "setSession", paylod: sessionInfo});
          fetch("http://localhost:3000/api/v1/boardgames")
          .then((res) => res.json())
          .then((boardGameList) => {
              dispatch({ type: "setBoardGames", payload: boardGameList });
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
          <label>Date Game Played: </label>
          <input type="date" value={datePlayed} onChange={(e) => setDatePlayed(e.target.value) }/>
          <br/>
          <label>Select Players: </label>
          <br/>
          {allUsersCheckBoxes}
          <label>Select Winner</label>
          <br/>
          <select onChange={(e) => setWinner(e.target.value)}>
            {winnerDropDownOptions}
          </select>
          <br/>
          <input type="submit" value="Log Session"/>
      </form>
  );
}

export default NewSessionForm;
