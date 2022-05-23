import { TYPE } from "./actions";

export default (
  state = {
    error: null,
  },
  action
) => {
  // console.log(action);
  switch (action.type) {
    case TYPE.ERROR:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};
