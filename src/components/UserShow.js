import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  color: #344a53;
  display: block;
  text-decoration: none;
  margin: 2vh;
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
  border-radius: 25%;
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
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [profilePicture, setProfilePicture] = useState(user.profile_picture);
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

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
        console.log(returnedUser);
        dispatch({ type: "setSelectedUserFromFetch", payload: returnedUser });
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
        console.log(returnedUser);
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
      .then((returnedUser) => {
        console.log(returnedUser);
        dispatch({ type: "logout", payload: null });
        history.push("/signup");
      });
  }

  let userBoardgamesLinks = [];

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
              { user.id === loggedInUser.id ? <StyledP>Email: {user.email}</StyledP> : null }
            </>
          )}
          {user.id === loggedInUser.id ? (
            <>
              <StyledButton onClick={() => setEditProfile(!editProfile)}>
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
      <h3>Game Shelf</h3>
      {user.owned_games[0] ? userBoardgamesLinks : null}
    </div>
  );
}

export default UserShow;
