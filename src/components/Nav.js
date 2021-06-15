import { Link } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "react-bootstrap/Navbar"


const StyledLink = styled(Link)`
  padding: 4px;
  margin: 3px;
  font-size: 0.9rem;
  text-decoration: none;
  color: #79B7CF;
  vertical-align: center;
  font: Arial;
  font-weight: bolder;
  float: right;
  &:hover {
      color: #C5A4C7;
  }
  &:active {
    color: #344A53;
  }
`;


function Nav() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);

  if (!user) {
    return null;
  }


  return (
    <Navbar style={{background: '#FCFCD4'}}>
        <img style={{backgroundColor: "#FCFCD4", width: "62vh", height: "18vh"}} src="https://i.ibb.co/Z2fBDBY/goodboardgames.png" alt="goodboardgames" />
      <StyledLink to="/signup">Sign Up</StyledLink>
      <StyledLink to="/login">Login</StyledLink>
      <StyledLink to="/boardgames">All Boardgames</StyledLink>
      <StyledLink to="/users">All Users</StyledLink>
      <StyledLink to={`/users/${user.id}`}>My Profile</StyledLink>
      <StyledLink
        to="/login"
        onClick={() => {
          localStorage.clear()
          dispatch({type: "logout"});
        }}
      >
        Log Out
      </StyledLink>
    </Navbar>
  );
}

export default Nav;
