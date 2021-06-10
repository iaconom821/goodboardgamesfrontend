import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
 

function UserShow() {
    // GET Field Logic
    const user = useSelector(state => state.userReducer.selectedUser)
    const dispatch = useDispatch()
    const {id} = useParams()

    if(!user){
        fetch(`http://localhost:3000/api/v1/users/${id}`, {
            headers:{
                Authorization: `Bearer ${localStorage.token}`
            }
        })
        .then((res) => res.json())
        .then((selectedUser) => {
          dispatch({type: "setSelectedUserFromFetch", payload: selectedUser})
          });

        return <h2>Loading</h2>
    }

    
    return (
        <div>
            <p>{user.name} {user.username} {user.email}</p>
        </div>
    )

}

export default UserShow 