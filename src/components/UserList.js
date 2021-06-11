import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

function UserList() {
  // GET Field Logic
  const users = useSelector((state) => state.userReducer.users);
  const user = useSelector((state) => state.userReducer.user)

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
    console.log(users);
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
      >
        {user.name}
      </Link>
    );
  });

  return <div>{userLinks}</div>;
}

export default UserList;
