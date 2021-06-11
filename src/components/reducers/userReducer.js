let initialState = { user: null, users: [], selectedUser: null, token: null};

let userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "setUser":
        console.log(action.payload)
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
    case "addToOwnedGames":
        return {
            ...state,
            user: action.payload.user,
            users: state.users.map(user => {
                if(user.id === action.payload.user.id){
                    return action.payload.user
                } else {
                    return user 
                }
            }),
            selectedUser: action.payload.user 
        }
    case "logout":
      return {
        ...state, ...initialState
      };
    default:
      return state;
  }
};

export default userReducer;
