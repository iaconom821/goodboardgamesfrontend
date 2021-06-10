import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react" 
import { Link } from "react-router-dom"

function BoardGameList() {
    // GET Field Logic
    const boardGames = useSelector(state => state.boardGameReducer.boardGames)

    const dispatch = useDispatch()

    useEffect(() => {
      fetch("http://localhost:3000/api/v1/boardgames")
        .then((res) => res.json())
        .then((boardGameList) => {
          dispatch({type: "setBoardGames", payload: boardGameList})
          });
    }, [dispatch]);

    if(!boardGames[0]){
        return <h2>Loading</h2>
    }

    const boardGameLinks = boardGames.map(boardGame => {
        return <Link to={location => {location.pathname = `/boardgames/${boardGame.id}`; dispatch({type: "setSelectedBoardGame", payload: boardGame.id})}} key={boardGame.id} >{boardGame.title} {boardGame.manufacturer} {boardGame.description}</Link>
    })

    return (
        <div>
            {boardGameLinks}
        </div>
    )

}

export default BoardGameList