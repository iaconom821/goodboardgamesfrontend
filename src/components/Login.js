import { useState } from "react";
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

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

function Login() {
  // Login Logic
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const dispatch = useDispatch()

  function handleLogin(e) {
    e.preventDefault();
    fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((userInfo) => {
        if(!userInfo.token){
          alert("Invalid Username or Password")
          return null
        }
        localStorage.token = userInfo.token;
        localStorage.userId = userInfo.user.id;
        userInfo.user.token = userInfo.token;
        dispatch({type: "setUser", payload: userInfo.user})
        history.push("/boardgames");
      });
  }

  return (
    <StyledDiv>
      {/* Login Form  */}
      <StyledLabel as="h2">Login</StyledLabel>
      <StyledForm onSubmit={handleLogin}>
        <StyledLabel>Username</StyledLabel>
        <StyledInput
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <StyledLabel>Password</StyledLabel>
        <StyledInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <StyledInput as="button" style={{marginTop: '4px'}} type="submit">Login</StyledInput >
      </StyledForm>
    </StyledDiv>
  );
}

export default Login;
