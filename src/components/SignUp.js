import { useState } from "react";
import styled from 'styled-components'
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

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


function SignUp() {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const users = useSelector(state => state.userReducer.users)


  const dispatch = useDispatch()

  const history = useHistory()

  function signUp(e) {
    e.preventDefault();
    fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        profile_picture: profilePicture,
        username: userName,
        password: passWord,
      }),
    })
      .then((res) => res.json())
      .then((userInfo) => {
          if(!userInfo.token){
            alert("Invalid Information")
            return null
          }
          const formattedUserInfo = {...userInfo.user, owned_games: userInfo.owned_games, sessions: userInfo.sessions, usersessions: userInfo.usersessions}
          localStorage.token = userInfo.token;
          localStorage.userId = userInfo.user.id;
          formattedUserInfo.token = userInfo.token;
          dispatch({type: "setUser", payload: formattedUserInfo})
          if(users[0]){
            dispatch({type: "addUsertoUsers", payload: formattedUserInfo})
          }
          history.push("/boardgames");
    });
  }

  return (
    <StyledDiv>
      <StyledLabel as="h2">Sign Up</StyledLabel>
      <StyledForm onSubmit={(e) => signUp(e)}>
        <StyledLabel>Name</StyledLabel>
        <StyledInput
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <StyledLabel>Email Address</StyledLabel>
        <StyledInput
          name="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledLabel>Profile Picture</StyledLabel>
        <StyledInput
          name="profilePicture"
          type="text"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
        />
        <StyledLabel>Username</StyledLabel>
        <StyledInput
          name="username"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <StyledLabel>Password</StyledLabel>
        <StyledInput
          name="password"
          type="password"
          value={passWord}
          onChange={(e) => setPassWord(e.target.value)}
        />
        <StyledInput type="submit" style={{marginTop: "2vh"}} />
      </StyledForm>
    </StyledDiv>
  );
}

export default SignUp;