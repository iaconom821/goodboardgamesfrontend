import { Link} from "react-router-dom";
import styled from 'styled-components'

const StyledLink = styled(Link)`
  padding: 4px;
  margin: 3px;
  border: 1px solid black;
  border-radius: 2px;
  background: whitesmoke;
  font-size: .9em;
  text-decoration: none;
  color: magenta;
  font: Arial;`

function Nav() {
  


  return (
    <div>
      <StyledLink to="/signup">Sign Up</StyledLink>
      <StyledLink to="/login">Login</StyledLink>
      <StyledLink to="/boardgames">All Boardgames</StyledLink>
      <StyledLink to="/users">All Users</StyledLink>
      <StyledLink to='/login'
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