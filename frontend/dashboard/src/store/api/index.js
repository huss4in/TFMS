export const TYPE = {
  FETCH_PROGRAMS: "FETCH_PROGRAMS",
  // // STORE_PROGRAMS: "STORE_PROGRAMS",

  FETCH_ESTIMATION: "FETCH_ESTIMATION",
  // // STORE_ESTIMATION: "STORE_ESTIMATION",

  FETCH_FEATURES: "FETCH_FEATURES",
  // // STORE_FEATURES: "STORE_FEATURES",

  FETCH_APPLICANTS: "FETCH_APPLICANTS",
  // // STORE_APPLICANTS: "STORE_APPLICANTS",

  FETCH_RUNS: "FETCH_RUNS",
  // // STORE_RUNS: "STORE_RUNS",

  FETCH_RUN_DETAILS: "FETCH_RUN_DETAILS",
  // // STORE_RUN_DETAILS: "STORE_RUN_DETAILS",

  STORE: "STORE",

  API_ERROR: "API_ERROR",
};

export const ACTION = {
  fetchPrograms: () => ({
    type: TYPE.FETCH_PROGRAMS,
  }),
  fetchEstimation: (program_id, period_name) => ({
    type: TYPE.FETCH_ESTIMATION,
    program_id,
    period_name,
  }),
  fetchFeatures: (program_id) => ({
    type: TYPE.FETCH_FEATURES,
    program_id,
  }),
  fetchApplicants: (program_id, period_name) => ({
    type: TYPE.FETCH_APPLICANTS,
    program_id,
    period_name,
  }),
  fetchRuns: () => ({
    type: TYPE.FETCH_RUNS,
  }),
  fetchRunDetails: (run_id) => ({
    type: TYPE.FETCH_RUN_DETAILS,
    run_id,
  }),
  store: (payload) => ({
    type: TYPE.STORE,
    payload,
  }),
};

export const REDUCER = (
  state = {
    programs: [],
    estimation: {},
    features: [],
    applicants: [],
    runs: [],
    runDetails: {},
    error: null,
  },
  action
) => {
  switch (action.type) {
    case TYPE.API_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case TYPE.STORE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
