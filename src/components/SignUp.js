import { useState } from "react";
import styled from 'styled-components'
import { useDispatch } from "react-redux"

const StyledForm = styled.form`
  position: relative;
  margin: auto;
  text-align: center;
  justify-content: center;
  padding: 5px;
`

const StyledLabel = styled.label`
  color: #39FF14;
  `

const StyledInput = styled.input`
  display: block;
  color: magenta;
  border-radius: 5px;
  border: 1px solid black;
  text-align: center;
  margin: auto;
  box-sizing: border-box;
  `

function SignUp() {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  let jwt_token = localStorage.getItem("token");

  const dispatch = useDispatch()

  function signUp(e) {
    e.preventDefault();
    fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        Authorization: `bearer ${jwt_token}`,
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
      .then((resp) => {
        if(!resp.token){
          alert("Invalid Field")
          return null 
        }
        dispatch({type: "setUser", payload: resp.user.id })
        localStorage.userId = resp.user.id
        localStorage.token = resp.token});
  }

  return (
    <div>
      <h2 style={{color: '#39FF14', margin: '0px', marginTop: '10px'}}>Sign Up</h2>
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
        <StyledInput type="submit" />
      </StyledForm>
    </div>
  );
}

export default SignUp;