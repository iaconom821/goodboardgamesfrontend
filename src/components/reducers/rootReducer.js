import { combineReducers } from 'redux'
import userReducer from "./userReducer.js"
import boardGameReducer from './boardGameReducer.js'


const rootReducer = combineReducers( {userReducer, boardGameReducer} )

export default rootReducer