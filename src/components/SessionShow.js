import React, { useEffect }from 'react'
import {useParams, Link} from 'react-router-dom'
import {useSelector, useDispatch } from 'react-redux'


function SessionShow() {
    const { id } = useParams()
    const dispatch = useDispatch() 
    

    useEffect( () => {
        fetch(`http://localhost:3000/api/v1/sessions/${id}`,
        {headers: {
            Authorization: `Bearer ${localStorage.token}`
        }})
        .then((res) => res.json())
        .then((session) => {
          dispatch({ type: "setSession", payload: session });
        });
     }, [id, dispatch])


     const session = useSelector(state => state.sessionReducer.session)
     const users = useSelector(state => state.userReducer.users)
     const boardgame = useSelector(state => state.boardGameReducer.selectedBoardGame)
     console.log(session)
     if (!session){
         return null
     }
     if(users){
         if(!users[0]){
            fetch("http://localhost:3000/api/v1/users", {
                headers: { Authorization: `Bearer ${localStorage.token}` },
              })
                .then((res) => res.json())
                .then((userList) => {
                    console.log(userList)
                  dispatch({ type: "setUsers", payload: userList });
                });
         }
     }
     if(!boardgame){
         return null
     }

     const playerArray = session.players.map(player => {
         return (
             <Link to={location => location.pathname = `/users/${player.id}`} onClick={() => dispatch({type: "setSelectedUser", payload: player})} key={player.id}>{player.username}</Link>
         )
     })
    return (
        <div>
            {playerArray}
            <p>{session.winning_user.name}</p>
            <p>{session.session.date}</p>
            <img src={boardgame.image} alt="boardgame cover"/>
        </div>
    ) 

}

export default SessionShow 