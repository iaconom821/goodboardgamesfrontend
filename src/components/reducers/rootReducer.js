import { combineReducers } from 'redux'
import userReducer from "./userReducer.js"
import boardGameReducer from './boardGameReducer.js'

let initialState = { count: 0 }

let countReducer = (state = initialState, action) => {
    switch(action.type){
        case "increment":
            return {
                ...state, count: state.count + action.payload
            }
        case "decrement":
            return {
                ...state, count: state.count - action.payload
            }
        default:
            return state
    }
}

const rootReducer = combineReducers( {countReducer, userReducer, boardGameReducer} )

export default rootReducer