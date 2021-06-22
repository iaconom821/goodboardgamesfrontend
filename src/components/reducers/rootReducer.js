import { combineReducers } from 'redux'
import userReducer from "./userReducer.js"
import boardGameReducer from './boardGameReducer.js'
import sessionReducer from './sessionReducer.js'


const rootReducer = combineReducers( {userReducer, boardGameReducer, sessionReducer} )

export default rootReducer