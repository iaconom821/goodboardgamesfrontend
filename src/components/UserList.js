import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledImg = styled.img`
  border-radius: 25%;
  height: 30vh;
  display: block;
  margin: 1vw;`

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  margin: 5vh;`


function UserList() {
 
  const users = useSelector((state) => state.userReducer.users);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (!users[0]) {
      fetch("http://localhost:3000/api/v1/users", {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      })
        .then((res) => res.json())
        .then((userList) => {
            console.log(userList)
          dispatch({ type: "setUsers", payload: userList });
        });
    }
  });

  if (!users[0]) {
    if (typeof users === "object") {
      return <h2>{users.message}</h2>;
    }
    return <h2>Loading</h2>;
  }

  const userLinks = users.map((user) => {
    return (
      <Link
        to={(location) => {
          location.pathname = `/users/${user.id}`;
          dispatch({ type: "setSelectedUser", payload: user });
        }}
        key={user.id}
        style={{color: "#344A53"}}
      >
        <StyledImg src={user.profile_picture} alt='profile'/>
        {user.name}
      </Link>
    );
  });

  return <StyledDiv>{userLinks}</StyledDiv>;
}

export default UserList;
