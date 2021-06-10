import { Link } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

const StyledLink = styled(Link)`
  padding: 4px;
  margin: 3px;
  border: 1px solid black;
  border-radius: 2px;
  background: whitesmoke;
  font-size: 0.9em;
  text-decoration: none;
  color: magenta;
  font: Arial;
`;

function Nav() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userReducer.user.id)

  return (
    <div>
      <StyledLink to="/signup">Sign Up</StyledLink>
      <StyledLink to="/login">Login</StyledLink>
      <StyledLink to="/boardgames">All Boardgames</StyledLink>
      <StyledLink to="/users">All Users</StyledLink>
      {/* <StyledLink
        to={(location) => {
          location = `/users/${user.id}`;
          dispatch({ type: "setSelectedUser", payload: localStorage.userId });
        }}
      >
        My Profile
      </StyledLink> */}
      <StyledLink
        to="/login"
        onClick={() => {
          localStorage.clear();
        }}
      >
        Log Out
      </StyledLink>
    </div>
  );
}

export default Nav;
