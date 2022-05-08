import { combineReducers } from "redux";

const initialState = {
  articles: []
};

function articleReducer(state = initialState, action) {
  if (action.type === 'ADD_ARTICLE') {
    return Object.assign({}, state, {
      articles: state.articles.concat(action.payload)
    });
  }
  return state;
}

const rootReducer = combineReducers({
  articles_store: articleReducer,
});

export default rootReducer;