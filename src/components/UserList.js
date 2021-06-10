import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react" 
import { Link } from "react-router-dom"

function UserList() {
    // GET Field Logic
    const users = useSelector(state => state.userReducer.users)
    console.log(users)

    const dispatch = useDispatch()

    useEffect(() => {
      fetch("http://localhost:3000/api/v1/users",{
          headers: { Authorization: `Bearer ${localStorage.token}`} 
      })
        .then((res) => res.json())
        .then((userList) => {
          dispatch({type: "setUsers", payload: userList})
          });
    }, [dispatch]);

    if(!users[0]){
        console.log(users)
        if(typeof(users) === "object"){
            return <h2>{users.message}</h2>
        }
        return <h2>Loading</h2>
    }

    const userLinks = users.map(user => {
        return <Link to={location => {location.pathname = `/users/${user.id}`; dispatch({type: "setSelectedUser", payload: user.id})}} key={user.id}>{user.name}</Link>
    })

    return (
        <div>
            {userLinks}
        </div>
    )

}

export default UserList 