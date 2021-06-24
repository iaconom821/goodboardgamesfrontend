import { Fragment } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  color: #344a53;
  display: block;
  text-decoration: none;
  margin-top: 2vh;
  margin-bottom: 2vh;
  &:hover {
    color: #79b7cf;
    background: #fcfcd4;
    border-radius: 10%;
    text-decoration: none;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
`;

const StyledP = styled.p`
  color: #344a53;
  width: fit-content;
  display: block;
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
  border-radius: 10%;
`;

const StyledGameImg = styled.img`
  border-radius: 50%;
  height: 25vh;
`;

const StyledButton = styled.button`
  color: #fcfcd4;
  border-radius: 5px;
  border: 1px solid black;
  background-color: #344a53;
  margin: 2vh;
  box-sizing: border-box;
`;

const StyledForm = styled.form`
  position: relative;
  margin: auto;
  text-align: center;
  justify-content: center;
  padding: 5px;
`;

function UserShow() {
  const [editProfile, setEditProfile] = useState(false);
  const [deleteProfileBool, setDeleteProfileBool] = useState(false);
  const user = useSelector((state) => state.userReducer.selectedUser);
  const loggedInUser = useSelector((state) => state.userReducer.user);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const boardgames = useSelector(state => state.boardGameReducer.boardGames)

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
    dispatch({ type: "setSelectedUserFromFetch", payload: loggedInUser });
  }

  if(boardgames){
    if(!boardgames[0]){
      fetch("http://localhost:3000/api/v1/boardgames")
        .then((res) => res.json())
        .then((boardGameList) => {
          dispatch({ type: "setBoardGames", payload: boardGameList });
        });
        return (
          <h2>Loading</h2>
        )
    }
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
        boardgame_id: boardgame_id,
      }),
    })
      .then((res) => res.json())
      .then((returnedUser) => {
        dispatch({ type: "setUserAndSelectedUserFromFetch", payload: returnedUser });
        history.push(`/users/${returnedUser.id}`)
      });
  }

  function editProfileInfo(e) {
    e.preventDefault();
    fetch(`http://localhost:3000/api/v1/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        name: name,
        username: username,
        email: email,
        profile_picture: profilePicture,
      }),
    })
      .then((res) => res.json())
      .then((returnedUser) => {
        dispatch({ type: "setSelectedUserFromFetch", payload: returnedUser });
        setEditProfile(false);
      });
  }

  function deleteProfile() {
    fetch(`http://localhost:3000/api/v1/users/${user.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => res.json())
      .then((userInfo) => {
        dispatch({ type: "logout", payload: null });
      });
      history.push("/signup");
  }


  let userBoardgamesLinks = [];
  if (!user.owned_games){
    return null
  }
  if (user.owned_games[0]) {
    userBoardgamesLinks = user.owned_games.map((game) => {
      return (
        <StyledInnerDiv key={game.id}>
          <StyledGameImg src={game.image} />
          <StyledLink
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
          </StyledLink>
          {user.id === loggedInUser.id ? (
            <StyledButton onClick={(e) => handleRemoveFromShelf(game.id)}>
              Remove From Shelf
            </StyledButton>
          ) : null}
        </StyledInnerDiv>
      );
    });
  }

  let uniqueGameLinks = [];

  let allSessionLinks = [];

  const timesGamePlayedObj = {};

  let gamesWon = 0;

  if(!user.sessions){
    return null
  }

  if (user.sessions[0]) {
    for (let i = 0; i < user.sessions.length; i++) {
      if (!timesGamePlayedObj[user.sessions[i].boardgame_id]) {
        timesGamePlayedObj[user.sessions[i].boardgame_id] = 0;
      }
      timesGamePlayedObj[user.sessions[i].boardgame_id] += 1;
      if (user.sessions[i].winner === user.id){
        gamesWon += 1
      }
    }

    const memo = {}

    let uniqueGames = user.sessions.filter((session) => {
      if(memo[session.boardgame_id]){
        return false
      } else{
        memo[session.boardgame_id] = true 
        return true 
      }
    });

    uniqueGameLinks = uniqueGames.map((session) => {
      return (
        <Fragment key={session.id}>
        <StyledLink key={session.id}
          to={(location) =>
            (location.pathname = `/boardgames/${session.boardgame_id}`)
          }
          onClick={() =>
            dispatch({
              type: "setSelectedBoardGameFromId",
              payload: session.boardgame_id,
            })
          }
        >
          {`${boardgames.find((el)=>el.id === session.boardgame_id).title}`}
        </StyledLink>
          <span key={session.id}> {`${timesGamePlayedObj[session.boardgame_id]} times`}</span>
        </Fragment>
      );
    });

    allSessionLinks = user.sessions.map((session) => {
      return (
        <StyledLink key={session.id} style={{fontSize: '.7rem'}}
          to={(location) =>
            (location.pathname = `/sessions/${session.id}`)
          }
          onClick={() =>
            dispatch({
              type: "setSelectedBoardGameFromIdOnly",
              payload: session.boardgame_id,
            })
          }
        >
          {`${session.date} - ${boardgames.find((el)=>el.id === session.boardgame_id).title}`}
        </StyledLink>
      )
    })
  }

  return (
    <div style={{ textAlign: "center" }}>
      <StyledDiv>
        <StyledInnerDiv>
          {editProfile ? (
            <StyledForm onSubmit={(e) => editProfileInfo(e)}>
              <StyledP as="label">Name: </StyledP>
              <StyledButton
                as="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br></br>
              <StyledP as="label">Username: </StyledP>
              <StyledButton
                as="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br></br>
              <StyledP as="label">Email: </StyledP>
              <StyledButton
                as="input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br></br>
              <StyledP as="label">Profile Image Link: </StyledP>
              <StyledButton
                as="input"
                type="text"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
              />
              <br></br>
              <StyledButton as="input" type="submit" value="Submit Info" />
            </StyledForm>
          ) : (
            <>
              <StyledP>Name: {user.name}</StyledP>
              <StyledP>Username: {user.username}</StyledP>
              {user.id === loggedInUser.id ? (
                <StyledP>Email: {user.email}</StyledP>
              ) : null}
            </>
          )}
          {user.id === loggedInUser.id ? (
            <>
              <StyledButton onClick={() => {
                setName(user.name)
                setEmail(user.email)
                setUsername(user.username)
                setProfilePicture(user.profile_picture)
                setEditProfile(!editProfile)}}>
                Edit Profile
              </StyledButton>
              <StyledButton
                onClick={() => setDeleteProfileBool(!deleteProfileBool)}
              >
                Delete Profile
              </StyledButton>
            </>
          ) : null}
          {deleteProfileBool ? (
            <>
              <br></br>
              <StyledButton onClick={() => deleteProfile()}>
                Confirm Delete
              </StyledButton>
            </>
          ) : null}
        </StyledInnerDiv>
        <StyledInnerDiv>
          <StyledImg
            src={user.profile_picture}
            alt="profile"
            style={{ maxHeight: "25vw", maxWidth: "25vw" }}
          />
        </StyledInnerDiv>
      </StyledDiv>
      <br></br>
      <div style={{display: 'flex'}}>
        <div style={{width: '100%'}}>
          <h3>Game Shelf</h3>
          {user.owned_games[0] ? userBoardgamesLinks : null}
        </div>
        <div style = {{width: '100%'}}>
          <h3>Played Games</h3>
          {user.sessions[0] ? uniqueGameLinks : null}
          <h4>Sessions Won</h4>
          <p>{gamesWon}</p>
          <h5>All Sessions</h5>
          {user.sessions[0] ? allSessionLinks : null }
        </div>
      </div>
    </div>
  );
}

export default UserShow;
