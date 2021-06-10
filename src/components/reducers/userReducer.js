let initialState = { user: parseInt(localStorage.userId), users: [], selectedUser: parseInt(localStorage.userId) }

let userReducer = (state = initialState, action) => {
    switch(action.type){
        case "setUser":
            return {
                ...state, user: parseInt(action.payload)
            }
        case "setUsers":
            return {
                ...state, users: action.payload
            }
        case "setSelectedUser":
            const selectUser = state.users.find(user => user.id === action.payload)
            return {
                ...state, selectedUser: selectUser
            }
        case "setSelectedUserFromFetch":
            return {
                ...state, selectedUser: selectUser
            }
        default:
            return state
    }
}

export default userReducer