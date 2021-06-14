import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";

function UserShow() {
  const user = useSelector((state) => state.userReducer.selectedUser);
  const loggedInUser = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  if (!user) {
    fetch(`http://localhost:3000/api/v1/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => res.json())
      .then((selectedUser) => {
        dispatch({ type: "setSelectedUserFromFetch", payload: selectedUser });
      });

    return <h2>Loading</h2>;
  }
  if (parseInt(user.id) !== parseInt(id)) {
    dispatch({ type: "setSelectedUser", payload: loggedInUser });
  }

  function handleRemoveFromShelf(boardgame_id) {
    fetch(`http://localhost:3000/api/v1/gameowners`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
        body: JSON.stringify({
            user_id: user.id,
            boardgame_id: boardgame_id
        })
    })
      .then((res) => res.json())
      .then((returnedUser) => {
        console.log(returnedUser);
        dispatch({type: "setSelectedUserFromFetch", payload: returnedUser})
      });
  }

  let userBoardgamesLinks = [];

  if (user.owned_games[0]) {
    userBoardgamesLinks = user.owned_games.map((game) => {
      return (
        <Fragment key={game.id}>
          <Link
            key={game.id}
            to={(location) => {
              location.pathname = `/boardgames/${game.id}`;
              dispatch({
                type: "setSelectedBoardGameFromUser",
                payload: game.id,
              });
            }}
          >
            {game.title}
          </Link>
          {user.id === loggedInUser.id ? <button onClick={(e) => handleRemoveFromShelf(game.id)}>
            Remove From Shelf
          </button> : null}
        </Fragment>
      );
    });
  }

  return (
    <div>
      <p>
        {user.name} {user.username} {user.email}
      </p>
      <img src={user.profile_picture} alt="profile picture" style={{maxHeight: "25vw", maxWidth: "25vw"}}/>
      <br></br>
      {user.owned_games[0] ? userBoardgamesLinks : null}
    </div>
  );
}

export default UserShow;
