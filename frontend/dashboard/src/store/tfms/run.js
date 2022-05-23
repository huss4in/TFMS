export const TYPE = {
  POST_RUN: "POST_RUN",

  FETCH_RUN: "FETCH_RUN",
  STORE_RUN: "STORE_RUN",

  UPDATE_BUDGET: "UPDATE_BUDGET",
  STORE_BUDGET: "STORE_BUDGET",
};

export const ACTION = {
  postRun: () => ({
    type: TYPE.POST_RUN,
  }),

  fetchRun: (run_id) => ({
    type: TYPE.FETCH_RUN,
    run_id,
  }),
  storeRun: ({ id, date, program_id, period_name, budget }) => ({
    type: TYPE.STORE_RUN,
    id,
    date,
    program_id,
    period_name,
    budget,
  }),

  updateBudget: (budget) => ({
    type: TYPE.UPDATE_BUDGET,
    budget,
  }),
  storeBudget: (budget) => ({
    type: TYPE.STORE_BUDGET,
    budget,
  }),
};

export default (
  state = {
    id: null,
    date: 0,
    program_id: null,
    period_name: null,
    budget: 0,
  },
  action
) => {
  switch (action.type) {
    case TYPE.STORE_BUDGET:
      return {
        ...state,
        budget: action.budget,
      };

    case TYPE.STORE_RUN:
      return {
        ...state,
        id: action.id,
        date: action.date,
        program_id: action.program_id,
        period_name: action.period_name,
        budget: action.budget,
      };

    default:
      return state;
  }
};
