export const TYPE = {
  FETCH_FEATURES: "FETCH_FEATURES",
  STORE_FEATURES: "STORE_FEATURES",

  UPDATE_FEATURES_WEIGHTS: "UPDATE_FEATURES_WEIGHTS",
  UPDATE_CATEGORIES_GRADES: "UPDATE_CATEGORIES_GRADES",
  UPDATE_WEIGHTS_GRADES: "UPDATE_WEIGHTS_GRADES",

  UPDATE_FEATURES: "UPDATE_FEATURES",
};

export const ACTION = {
  fetchFeatures: (program_id, period_name) => ({
    type: TYPE.FETCH_FEATURES,
    program_id,
    period_name,
  }),
  storeFeatures: (features) => ({
    type: TYPE.STORE_FEATURES,
    features,
  }),

  updateFeaturesWeights: (featuresWeights) => ({
    type: TYPE.UPDATE_FEATURES_WEIGHTS,
    featuresWeights,
  }),
  updateCategoriesGrades: (categoriesGrades) => ({
    type: TYPE.UPDATE_CATEGORIES_GRADES,
    categoriesGrades,
  }),
  updateWeightsGrades: (featuresWeights, categoriesGrades) => ({
    type: TYPE.UPDATE_WEIGHTS_GRADES,
    featuresWeights,
    categoriesGrades,
  }),

  updateFeatures: () => ({
    type: TYPE.UPDATE_FEATURES,
  }),
};

export default (
  state = {
    features: [],
    featuresWeights: {},
    categoriesGrades: {},
  },

  action
) => {
  switch (action.type) {
    case TYPE.API_ERROR:
      return {
        ...state,
        error: action.error,
      };

    case TYPE.FETCH_FEATURES:
      return {
        ...state,
      };
    case TYPE.STORE_FEATURES:
      return {
        ...state,
        features: action.features,
      };

    case TYPE.UPDATE_FEATURES_WEIGHTS:
      return {
        ...state,
        featuresWeights: action.featuresWeights,
      };

    case TYPE.UPDATE_CATEGORIES_GRADES:
      return {
        ...state,
        categoriesGrades: action.categoriesGrades,
      };

    case TYPE.UPDATE_WEIGHTS_GRADES:
      return {
        ...state,
        featuresWeights: action.featuresWeights,
        categoriesGrades: action.categoriesGrades,
      };

    case TYPE.UPDATE_FEATURES:
      return {
        ...state,
      };

    default:
      return state;
  }
};
