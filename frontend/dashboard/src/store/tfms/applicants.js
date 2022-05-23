export const TYPE = {
  FETCH_APPLICANTS: "FETCH_APPLICANTS",
  STORE_APPLICANTS: "STORE_APPLICANTS",

  UPDATE_APPLICANTS: "UPDATE_APPLICANTS",
  STORE_UPDATED_APPLICANTS: "STORE_UPDATED_APPLICANTS",
};

export const ACTION = {
  fetchApplicants: (features, program_id, period_name) => ({
    type: TYPE.FETCH_APPLICANTS,
    features,
    program_id,
    period_name,
  }),
  storeApplicants: (applicants, featuresMinMax) => ({
    type: TYPE.STORE_APPLICANTS,
    applicants,
    featuresMinMax,
  }),

  updateApplicants: () => ({
    type: TYPE.UPDATE_APPLICANTS,
  }),
  storeUpdatedApplicants: (
    applicants,
    lastApplicantWithinBudgetIndex,
    budget,
    budgetSpent,
    budgetRemaining
  ) => ({
    type: TYPE.STORE_UPDATED_APPLICANTS,
    applicants,
    lastApplicantWithinBudgetIndex,
    budget,
    budgetSpent,
    budgetRemaining,
  }),
};

export default (
  state = {
    applicants: [],
    featuresMinMax: [],
    lastApplicantWithinBudgetIndex: 0,
    budget: 0,
    budgetSpent: 0,
    budgetRemaining: 0,
  },
  action
) => {
  switch (action.type) {
    case TYPE.API_ERROR:
      return {
        ...state,
        error: action.error,
      };

    case TYPE.FETCH_APPLICANTS:
      return {
        ...state,
      };
    case TYPE.STORE_APPLICANTS:
      return {
        ...state,
        applicants: action.applicants,
        featuresMinMax: action.featuresMinMax,
      };

    case TYPE.UPDATE_APPLICANTS:
      return {
        ...state,
      };
    case TYPE.STORE_UPDATED_APPLICANTS:
      return {
        ...state,
        applicants: action.applicants,
        lastApplicantWithinBudgetIndex: action.lastApplicantWithinBudgetIndex,
        budget: action.budget,
        budgetSpent: action.budgetSpent,
        budgetRemaining: action.budgetRemaining,
      };

    default:
      return state;
  }
};
