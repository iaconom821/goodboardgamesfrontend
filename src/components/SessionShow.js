import React, { useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

const StyledP = styled(Link)`
  color: #344a53;
  width: fit-content;
  display: block;
  margin: 2vw;
  &:hover {
    color: #79b7cf;
    background: #fcfcd4;
    border-radius: 10%;
    text-decoration: none;
  }
`;

const StyledTitles = styled.p`
  color: #344a53;
  display: block;
  margin: 4vw;
  margin-top: 2vh;
  margin-bottom: 2vh;
`;

const StyledDiv = styled.div`
  margin: auto;
  display: flex;
  width: fit-content;
  justify-content: center;
`;

const StyledInnerDiv = styled.div`
  text-align: center;
  width: 100%;
  margin: 4vh;
  border: 1px solid #c5a4c7;
`;
const StyledImg = styled.img`

  border-radius: 10%;
  width: 40vh;
`;

const StyledInput = styled.input`
  color: #fcfcd4;
  border-radius: 5px;
  border: 1px solid #344a53;
  text-align: center;
  background-color: #344a53;
  margin: 4vh;
`;

const StyledOuterDiv = styled.div`
    text-align: center;
    margin: auto;`

function SessionShow() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/sessions/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => res.json())
      .then((session) => {
        dispatch({ type: "setSession", payload: session });
      });
  }, [id, dispatch]);

  const session = useSelector((state) => state.sessionReducer.session);
  const users = useSelector((state) => state.userReducer.users);
  const boardgame = useSelector(
    (state) => state.boardGameReducer.selectedBoardGame
  );

  if (!session) {
    return null;
  }
  if (users) {
    if (!users[0]) {
      fetch("http://localhost:3000/api/v1/users", {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      })
        .then((res) => res.json())
        .then((userList) => {
          dispatch({ type: "setUsers", payload: userList });
        });
    }
  }
  if (!boardgame) {
    return null;
  }

  const playerArray = session.players.map((player) => {
    return (
      <StyledP
        to={(location) => (location.pathname = `/users/${player.id}`)}
        onClick={() => dispatch({ type: "setSelectedUserFromIdOnly", payload: player.id })}
        key={player.id}
      >
        {player.username}
      </StyledP>
    );
  });

  return (
    <StyledOuterDiv>
        <StyledOuterDiv>
      <StyledTitles as="h3">
        {boardgame.title} Session on {session.session.date}
      </StyledTitles>
      <StyledImg src={boardgame.image} alt="boardgame cover" />
      <br/>
      <StyledInput
        as="button"
        onClick={() => history.push(`/boardgames/${boardgame.id}`)}
      >
        Back To Game
      </StyledInput>
      </StyledOuterDiv>
      <StyledDiv>
        <StyledInnerDiv>
          <StyledTitles as="h4">Players</StyledTitles>
          {playerArray}
        </StyledInnerDiv>
        <StyledInnerDiv>
          <StyledTitles>Winner: {session.winning_user.name}</StyledTitles>
          <StyledImg src={session.winning_user.profile_picture} alt="profile" />
        </StyledInnerDiv>
      </StyledDiv>
    </StyledOuterDiv>
  );
}

export default SessionShow;
