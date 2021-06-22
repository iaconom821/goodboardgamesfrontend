import './App.css';
import { Switch, Route, Redirect } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import Nav from './components/Nav';
import Login from "./components/Login.js"
import SignUp from './components/SignUp'
import BoardGameList from './components/BoardGameList.js'
import BoardGameShow from './components/BoardGameShow.js'
import UserList from './components/UserList.js'
import UserShow from './components/UserShow.js'
import NewBoardGame from './components/NewBoardGame.js';
import SessionShow from './components/SessionShow.js'




function App() {

  const user = useSelector(state => state.userReducer.user)

  if(!user){
    fetch(`http://localhost:3000/api/v1/users/${localStorage.userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((resp) => {
        if(!resp.id){
          dispatch({type: "setUser", payload: {id: 0}})
          return null
        }
        resp.token = localStorage.token 
        dispatch({type: "setUser", payload: resp })
        localStorage.userId = resp.id});
  }
  const token = useSelector(state => state.userReducer.token)
 
  const dispatch = useDispatch()

  return (
    <>
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
        {!token ? <Redirect to="/login" /> : <UserList />}
        </Route>
        <Route exact path="/">
          <BoardGameList />
        </Route>
        <Route exact path="/users/:id">
        {!token ? <Redirect to="/login" /> : <UserShow />}
        </Route>
        <Route exact path="/sessions/:id">
          <SessionShow />
        </Route>
      </Switch>
    </>
  );
}

export default App;
