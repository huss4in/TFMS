export const TYPE = {
  FETCH_RUNS: "FETCH_RUNS",
  STORE_RUNS: "STORE_RUNS",

  DELETE_RUN: "DELETE_RUN",
};

export const ACTION = {
  fetchRuns: () => ({
    type: TYPE.FETCH_RUNS,
  }),
  storeRuns: (runs) => ({
    type: TYPE.STORE_RUNS,
    runs,
  }),
  deleteRun: (run_id) => ({
    type: TYPE.DELETE_RUN,
    run_id,
  }),
};

export default (
  state = {
    runs: [],
  },
  action
) => {
  switch (action.type) {
    case TYPE.STORE_RUNS:
      return {
        ...state,
        runs: action.runs,
      };

    default:
      return state;
  }
};
