export const TYPE = {
  FETCH_PROGRAMS: "FETCH_PROGRAMS",
  STORE_PROGRAMS: "STORE_PROGRAMS",

  SELECT_PERIOD: "SELECT_PERIOD",
  UPDATE_PERIOD: "UPDATE_PERIOD",
};

export const ACTION = {
  fetchPrograms: () => ({
    type: TYPE.FETCH_PROGRAMS,
  }),

  storePrograms: (programs) => ({
    type: TYPE.STORE_PROGRAMS,
    programs,
  }),

  selectPeriod: (period) => {
    return {
      type: TYPE.SELECT_PERIOD,
      period,
    };
  },

  updatePeriod: (period) => {
    return {
      type: TYPE.UPDATE_PERIOD,
      period,
    };
  },
};

export default (
  state = {
    programs: [],
    period: {},
    isPeriodSelected: false,
  },
  action
) => {
  switch (action.type) {
    case TYPE.API_ERROR:
      return {
        ...state,
        error: action.error,
      };

    case TYPE.FETCH_PROGRAMS:
      return {
        ...state,
      };
    case TYPE.STORE_PROGRAMS:
      return {
        ...state,
        programs: action.programs,
      };

    case TYPE.SELECT_PERIOD:
      return {
        ...state,
        period: action.period,
        isPeriodSelected: true,
      };

    case TYPE.UPDATE_PERIOD:
      return {
        ...state,
        period: action.period,
        isPeriodSelected: true,
      };

    default:
      return state;
  }
};
