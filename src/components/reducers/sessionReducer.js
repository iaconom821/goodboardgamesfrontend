let initialState = { session: null }

let sessionReducer = (state = initialState, action) => {
    switch(action.type){
        case "setSession":
            return {
                ...state, session: action.payload
            }
        default:
            return state
        }
    }

export default sessionReducer