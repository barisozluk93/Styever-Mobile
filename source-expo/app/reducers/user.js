const initialState = {
  user: null,
  unreadCount: null,
  loading: false,
  error: null,
};


export default function userReducer(state = initialState, action) {
  switch (action.type) {

    case 'USER_GET_REQUEST':
      return { ...state, loading: true, error: null };


    case 'USER_GET_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case 'USER_GET_FAIL':
      return { ...state, loading: false, error: action.payload };
    
    case 'USER_SET_UNREADED_NOT_COUNT':
      return {
        ...state,
        unreadCount: action.payload,
      };

    case 'USER_INIT':
      return initialState;

    default:
      return state;
  }
}