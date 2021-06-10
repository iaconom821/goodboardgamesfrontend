let initialState = { user: {id: 0,
    name:"",
    username:"",
    email:"",
    password_digest:"",
    profile_picture:"",
    created_at:"",
    updated_at:""}, users: [], selectedUser: null };

let userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "setUser":
      return {
        ...state,
        user: action.payload,
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
    default:
      return state;
  }
};

export default userReducer;
