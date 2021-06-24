let initialState = { session: null }

let sessionReducer = (state = initialState, action) => {
    switch(action.type){
        case "setSession":
            return {
                ...state, session: action.payload
            }
        case "logout":
            return {
                ...state, ...initialState
            }
        default:
            return state
        }
    }

export default sessionReducer