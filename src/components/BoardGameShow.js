import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
 

function BoardGameShow() {
    // GET Field Logic
    const boardGame = useSelector(state => state.boardGameReducer.selectedBoardGame)
    console.log(boardGame)
    const dispatch = useDispatch()
    const {id} = useParams()

    if(!boardGame){
        fetch(`http://localhost:3000/api/v1/boardgames/${id}`)
        .then((res) => res.json())
        .then((selectedBoardGame) => {
            console.log(selectedBoardGame)
          dispatch({type: "setSelectedBoardGameFromFetch", payload: selectedBoardGame})
          });

        return <h2>Loading</h2>
    }

    

    console.log(boardGame)

    return (
        <div>
            <h4>
                {boardGame.title} 
                {boardGame.description} 
                {boardGame.manufacturer} 
                <ul>Reviews 
                    {boardGame.reviews.map(review => <li key={review.id}><p>Title: {review.title}</p><p>Description: {review.description}</p><p>Overall Rating: {review.overall_rating}</p><p>Replayability Score: {review.replayability}</p><p>First Time Difficulty Rating: {review.first_time_difficulty}</p></li>)}
                </ul>
            </h4>
        </div>
    )

}

export default BoardGameShow 