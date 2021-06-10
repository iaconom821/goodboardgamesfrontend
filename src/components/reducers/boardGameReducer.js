let initialState = { boardGames: [], selectedBoardGame: null }

let boardGameReducer = (state = initialState, action) => {
    switch(action.type){
        case "setBoardGames":
            return {
                ...state, boardGames: action.payload
            }
        case "setSelectedBoardGame":
            const selectBoardGame = state.boardGames.find(boardGame => boardGame.id === action.payload)
            return {
                ...state, selectedBoardGame: selectBoardGame
            }
        case "setSelectedBoardGameFromFetch":
            return {
                ...state, selectedBoardGame: action.payload
            }
        default:
            return state
    }
}

export default boardGameReducer