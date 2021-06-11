import { useSelector, useDispatch } from "react-redux"
import { useParams, Link } from "react-router-dom"
 

function UserShow() {
    const user = useSelector(state => state.userReducer.selectedUser)
    const loggedInUser = useSelector(state => state.userReducer.user)
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
    if(parseInt(user.id) !== parseInt(id)){
        dispatch({type: "setSelectedUser", payload: loggedInUser})
    }

    let userBoardgamesLinks = []

    if(user.owned_games[0]){
        userBoardgamesLinks = user.owned_games.map(game => {
            return <Link key={game.id} to={location => {location.pathname = `/boardgames/${game.id}`; dispatch({type: "setSelectedBoardGame", payload: game})}}>{game.title}</Link>
        })
    }

    
    return (
        <div>
            <p>{user.name} {user.username} {user.email}</p>
            { user.owned_games[0] ? userBoardgamesLinks : null }
        </div>
    )

}

export default UserShow 