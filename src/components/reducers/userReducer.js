let initialState = { user: null, users: [], selectedUser: null, token: null};

let userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "setUser":
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        selectedUser: action.payload
      };
    case "setUsers":
      return {
        ...state,
        users: action.payload,
      };
    case "addUsertoUsers":
      const addedUser = [...state.users, action.payload]
      return {
        ...state,
        users: addedUser
      };
    case "setSelectedUser":
      const selectUser = state.users.find(
        (user) => user.id === action.payload.id
      );
      
      return {
        ...state,
        selectedUser: selectUser,
      };
    case "setSelectedUserFromFetch":
      return {
        ...state,
        selectedUser: action.payload,
      };
    case "setUserAndSelectedUserFromFetch":
    const changedUser = state.users.map(user => {
      if(parseInt(user.id) === parseInt(action.payload.id)){
        return action.payload
      } else {
        return user
      }
    })  
    return {
        ...state,
        user: action.payload,
        users: changedUser,
        selectedUser: action.payload
      }
    case "setSelectedUserFromIdOnly":
      const selUser = state.users.find(user => parseInt(user.id) === parseInt(action.payload))
      return {
        ...state,
        selectedUser: selUser
      }
    case "addToOwnedGames":
        return {
            ...state,
            user: action.payload,
            users: state.users.map(user => {
                if(user.id === action.payload.id){
                    return action.payload
                } else {
                    return user 
                }
            }),
            selectedUser: action.payload
        }
    case "logout":
      localStorage.clear() 
      return {
        ...state, ...initialState
      };
    default:
      return state;
  }
};

export default userReducer;
