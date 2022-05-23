export const TYPE = {
  FETCH_ESTIMATION: "FETCH_FUND_ESTIMATION_STATUS",
  START_ESTIMATION: "START_FUND_ESTIMATION_STATUS",
  STORE_ESTIMATION: "STORE_FUND_ESTIMATION_STATUS",
};

export const ACTION = {
  fetchEstimation: (program_id, period_name) => ({
    type: TYPE.FETCH_ESTIMATION,
    program_id,
    period_name,
  }),

  startEstimation: () => ({
    type: TYPE.START_ESTIMATION,
  }),

  storeEstimation: (status = "", time = 0) => ({
    type: TYPE.STORE_ESTIMATION,
    status,
    time,
  }),
};

export default (
  state = {
    status: "",
    time: 0,
  },
  action
) => {
  switch (action.type) {
    case TYPE.API_ERROR:
      return {
        ...state,
        error: action.error,
      };

    case TYPE.FETCH_ESTIMATION:
      return {
        ...state,
      };
    case TYPE.START_ESTIMATION:
      return {
        ...state,
      };

    case TYPE.STORE_ESTIMATION:
      return {
        ...state,
        status: action.status,
        time: action.time,
      };

    default:
      return state;
  }
};
