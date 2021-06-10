import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect, Fragment } from "react" 
import { Link } from "react-router-dom"

function BoardGameList() {
    // GET Field Logic
    const [searchTerm, setSearchTerm] = useState('')
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
    
    const searchBoardGames = boardGames.filter(boardGame => {
        return boardGame.title.toLowerCase().includes(searchTerm.toLowerCase()) || boardGame.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) || boardGame.upc_code.includes(searchTerm)
    })

    const boardGameLinks = searchBoardGames.map(boardGame => {
        return (
        <Fragment key={boardGame.id}>
            <Link to={location => {location.pathname = `/boardgames/${boardGame.id}`; dispatch({type: "setSelectedBoardGame", payload: boardGame.id})}}>{boardGame.title} {boardGame.manufacturer} {boardGame.description}</Link><br/>
        </Fragment>
        )
    })


    return (
        <div>
            <form>
                <input type="text" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}/>
            </form>
            <Link to={location => location.pathname = "/boardgames/new"}>Add A Boardgame</Link><br/>
            {boardGameLinks}
        </div>
    )

}

export default BoardGameList