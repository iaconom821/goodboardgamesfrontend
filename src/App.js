import './App.css';
import { Switch, Route } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import Nav from './components/Nav';
import Login from "./components/Login.js"
import SignUp from './components/SignUp'
import BoardGameList from './components/BoardGameList.js'
import BoardGameShow from './components/BoardGameShow.js'
import UserList from './components/UserList.js'
import UserShow from './components/UserShow.js'
import NewBoardGame from './components/NewBoardGame';




function App() {

  const count = useSelector(state => state.countReducer.count)
  
  const dispatch = useDispatch()

  return (
    <>
      <h3>Current Count = {count}</h3>
      <button onClick={() => dispatch({type: "increment", payload: 3})}>Increment Count by 3</button>
      <button onClick={() => dispatch({type: "decrement", payload: 1})}>Decrememnt by 1</button>
      <Nav />
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/boardgames">
          <BoardGameList />
        </Route>
        <Route exact path="/boardgames/new">
          <NewBoardGame />
        </Route>
        <Route exact path="/boardgames/:id">
          <BoardGameShow />
        </Route>
        <Route exact path="/users">
          <UserList />
        </Route>
        <Route exact path="/users/:id">
          <UserShow />
        </Route>
      </Switch>
    </>
  );
}

export default App;
