// Redux
import {
  call,
  put,
  all,
  select,
  delay,
  race,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

// Backend
import * as BACKEND from "../../helpers/backend";

// Actions
import * as TFMS from "./actions";
import * as PROGRAMS from "./programs";
import * as ESTIMATION from "./estimation";
import * as FEATURES from "./features";
import * as APPLICANTS from "./applicants";
import * as RUNS from "./runs";
import * as RUN from "./run";

function* fetchPrograms(action) {
  try {
    const programs = yield call(BACKEND.fetchPrograms);

    yield put(PROGRAMS.ACTION.storePrograms(programs));
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* selectPeriod(action) {
  try {
    const { program_id, period_name } = action.period.value;

    const [estimation, features, applicants] = yield all([
      call(BACKEND.fetchEstimation, program_id, period_name),
      call(BACKEND.fetchFeatures, program_id),
      call(BACKEND.fetchApplicants, program_id, period_name),
      put(ESTIMATION.ACTION.storeEstimation()),
      put(
        RUN.ACTION.storeRun({
          id: null,
          date: 0,
          program_id: null,
          period_name: null,
          budget: 0,
        })
      ),
    ]);

    let estimationStatus = estimation.fund_estimated_status;

    while (estimationStatus.toLowerCase() === "in progress") {
      const [estimation] = yield all([
        call(BACKEND.fetchEstimation, program_id, period_name),
      ]);

      estimationStatus = estimation.fund_estimated_status;

      yield all([
        put(
          ESTIMATION.ACTION.storeEstimation(
            estimation.fund_estimated_status,
            estimation.fund_estimation_date
          )
        ),
      ]);

      yield delay(1000);
    }

    const newFeatures = [
      ...features.sort((a, b) => a.importance - b.importance),
      {
        id: 0,
        column_name: "estimated_fund",
        visible_name: "Estimated Fund",
        type: "num",
        description: "Estimated fund",
        importance: Number.MAX_SAFE_INTEGER,
      },
    ];

    let featuresMinMax = Object.assign(
      {},
      ...newFeatures.map((feature) => ({
        [feature.id]: {
          min: Number.MAX_SAFE_INTEGER,
          max: -Number.MAX_SAFE_INTEGER,
        },
      }))
    );

    yield all([
      put(PROGRAMS.ACTION.updatePeriod(action.period)),
      put(
        ESTIMATION.ACTION.storeEstimation(
          estimation.fund_estimated_status,
          estimation.fund_estimation_date
        )
      ),
      put(
        FEATURES.ACTION.storeFeatures(
          newFeatures.map((feature) => ({
            ...feature,
            ...(feature.type === "cat" && {
              categories: Object.assign(
                {},
                ...feature.categories.map((category) => ({
                  [category]: 0,
                }))
              ),
            }),
          }))
        )
      ),
      put(
        APPLICANTS.ACTION.storeApplicants(
          applicants.map((applicant) => {
            newFeatures.forEach((feature) => {
              if (feature.type === "num") {
                if (
                  applicant[feature.column_name] <
                  featuresMinMax[feature.id].min
                )
                  featuresMinMax[feature.id].min =
                    applicant[feature.column_name];
                if (
                  applicant[feature.column_name] >
                  featuresMinMax[feature.id].max
                )
                  featuresMinMax[feature.id].max =
                    applicant[feature.column_name];
              }
            });

            return {
              ...applicant,
              score: 0,
            };
          }),
          featuresMinMax
        )
      ),
    ]);

    yield call(updateFeatures);
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* updateBudget(action) {
  try {
    yield delay(200);
    yield put(RUN.ACTION.storeBudget(Number(action.budget)));
    yield call(updateFeatures);
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* startEstimation(action) {
  try {
    const { program_id, period_name } = yield select(
      (state) => state.Programs.period.value
    );

    yield all([
      put(ESTIMATION.ACTION.storeEstimation("in progress")),
      put(
        RUN.ACTION.storeRun({
          id: null,
          date: 0,
          program_id: null,
          period_name: null,
          budget: 0,
        })
      ),
      race({
        estimation: call(BACKEND.startEstimation, program_id, period_name),
        timeout: delay(2000),
      }),
    ]);

    for (let i = 0; i < 60; i++) {
      const { program_id, period_name } = yield select(
        (state) => state.Programs.period.value
      );

      const [estimation] = yield all([
        call(BACKEND.fetchEstimation, program_id, period_name),
      ]);

      yield all([
        put(
          ESTIMATION.ACTION.storeEstimation(
            estimation.fund_estimated_status,
            estimation.fund_estimation_date
          )
        ),
      ]);

      if (estimation.fund_estimated_status.toLowerCase() === "completed") break;

      yield delay(1000);
    }

    const [applicants, features] = yield all([
      call(BACKEND.fetchApplicants, program_id, period_name),
      select((state) => state.Features.features),
    ]);

    let featuresMinMax = Object.assign(
      {},
      ...features.map((feature) => ({
        [feature.id]: {
          min: Number.MAX_SAFE_INTEGER,
          max: -Number.MAX_SAFE_INTEGER,
        },
      }))
    );

    yield put(
      APPLICANTS.ACTION.storeApplicants(
        applicants.map((applicant) => {
          features.forEach((feature) => {
            if (feature.type === "num") {
              if (
                applicant[feature.column_name] < featuresMinMax[feature.id].min
              )
                featuresMinMax[feature.id].min = applicant[feature.column_name];
              if (
                applicant[feature.column_name] > featuresMinMax[feature.id].max
              )
                featuresMinMax[feature.id].max = applicant[feature.column_name];
            }
          });

          return {
            ...applicant,
            score: 0,
          };
        }),
        featuresMinMax
      )
    );

    yield call(updateFeatures);
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* updateFeatures(action) {
  try {
    const [features, featuresWeights, categoriesGrades] = yield select(
      (state) => [
        state.Features.features,
        state.Features.featuresWeights,
        state.Features.categoriesGrades,
      ]
    );

    yield put(
      FEATURES.ACTION.storeFeatures(
        features.map((feature) =>
          feature.type !== "cat"
            ? {
                ...feature,
                weight: featuresWeights[feature.id] || 0,
              }
            : {
                ...feature,
                weight: featuresWeights[feature.id] || 0,
                categories: {
                  ...feature.categories,
                  ...categoriesGrades[feature.id],
                },
              }
        )
      )
    );

    yield call(updateApplicants);
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* updateApplicants(action) {
  try {
    const [features, applicants, featuresMinMax, budget] = yield select(
      (state) => [
        state.Features.features,
        state.Applicants.applicants,
        state.Applicants.featuresMinMax,
        state.Run.budget,
      ]
    );

    features
      .filter((feature) => feature.type === "cat")
      .forEach((features) => {
        const categoriesGrades = Object.entries(features.categories).map(
          ([_, value]) => value
        );
        featuresMinMax[features.id].min = Math.min(...categoriesGrades);
        featuresMinMax[features.id].max = Math.max(...categoriesGrades);
      });

    const getApplicantScore = (applicant) => {
      return features
        .map(
          (feature) =>
            feature.weight *
            NORMALIZE(
              feature.type === "num"
                ? applicant[feature.column_name]
                : feature.categories[applicant[feature.column_name]],
              featuresMinMax[feature.id].min,
              featuresMinMax[feature.id].max,
              0,
              100
            )
        )
        .reduce((acc, curr) => acc + curr, 0);
    };

    const scores = {
      min: Number.MAX_SAFE_INTEGER,
      max: -Number.MAX_SAFE_INTEGER,
    };

    const updatedApplicants = applicants
      .map((applicant) => {
        const score = getApplicantScore(applicant);

        if (score < scores.min) scores.min = score;
        if (score > scores.max) scores.max = score;

        return {
          ...applicant,
          score,
        };
      })
      .map((applicant) => {
        return {
          ...applicant,
          score:
            Math.round(
              NORMALIZE(applicant.score, scores.min, scores.max, 0, 100) * 1000
            ) / 1000,
        };
      })
      .sort((a, b) => b.score - a.score);

    let remainingBudget = budget;
    let separator = 0;

    for (let i = 0; i < updatedApplicants.length; i++) {
      if (applicants[i].estimated_fund <= remainingBudget)
        remainingBudget -= applicants[i].estimated_fund;
      else {
        separator = i;
        break;
      }
      separator = updatedApplicants.length;
    }

    yield put(
      APPLICANTS.ACTION.storeUpdatedApplicants(
        updatedApplicants,
        separator,
        budget,
        budget - remainingBudget,
        remainingBudget
      )
    );
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* fetchRuns(action) {
  try {
    yield put(RUNS.ACTION.storeRuns(null));
    const runs = yield call(BACKEND.fetchRuns);
    yield put(RUNS.ACTION.storeRuns(runs));
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* deleteRun(action) {
  try {
    yield call(BACKEND.deleteRun, action.run_id);
    yield put(RUNS.ACTION.fetchRuns());
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* postRun(action) {
  try {
    const [{ program_id, period_name }, budget, features, applicants] =
      yield select((state) => [
        state.Programs.period.value,
        state.Run.budget,
        state.Features.features,
        state.Applicants.applicants,
      ]);

    const run = {
      program_id,
      period_name,
      budget: budget,
      config: features.map((feature) => ({
        id: feature.id,
        weight: feature.weight,
        ...(feature.type === "cat" && { categories: feature.categories }),
      })),
      applicants: applicants.map(({ id, estimated_fund }) => ({
        id,
        estimated_fund,
      })),
    };

    yield call(BACKEND.postRun, run);

    yield put(RUNS.ACTION.fetchRuns());
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* fetchRun(action) {
  try {
    yield all([
      put(ESTIMATION.ACTION.storeEstimation("in progress")),
      put(
        PROGRAMS.ACTION.updatePeriod({
          label: "Loading",
          value: {
            program_id: 0,
            program_name: "Loading",
            period_name: "Please wait...",
          },
        })
      ),
      put(
        RUN.ACTION.storeRun({
          id: action.run_id,
          date: new Date().getTime() / 1000,
          program_id: null,
          period_name: null,
          budget: 0,
        })
      ),
    ]);

    const response = yield call(BACKEND.fetchRun, action.run_id);
    const run = response.run[0];

    const features = response.Features;
    const applicants = response.Applicants;
    const config = run.config;

    const program_id = run.program_id;
    const period_name = run.period_name;
    const program_name = yield select(
      (state) =>
        state.Programs.programs.find((program) => program.id === run.program_id)
          .program_name
    );

    console.log("updatePeriod");

    const time = run.date;

    const newFeatures = [
      ...features.sort((a, b) => a.importance - b.importance),
      {
        id: 0,
        column_name: "estimated_fund",
        visible_name: "Estimated Fund",
        type: "num",
        description: "Estimated fund",
        importance: Number.MAX_SAFE_INTEGER,
      },
    ];

    let featuresMinMax = Object.assign(
      {},
      ...newFeatures.map((feature) => ({
        [feature.id]: {
          min: Number.MAX_SAFE_INTEGER,
          max: -Number.MAX_SAFE_INTEGER,
        },
      }))
    );

    yield all([
      yield put(RUN.ACTION.storeRun(run)),
      put(
        PROGRAMS.ACTION.updatePeriod({
          label: `${program_name} - ${period_name}`,
          value: {
            program_name,
            program_id,
            period_name,
          },
        })
      ),
      put(
        FEATURES.ACTION.updateWeightsGrades(
          Object.assign(
            {},
            ...config.map((feature) => ({
              [feature.id]: feature.weight,
            }))
          ),
          Object.assign(
            {},
            ...config
              .filter((feature) => "categories" in feature)
              .map((feature) => ({
                [feature.id]: feature.categories,
              }))
          )
        )
      ),
      put(
        FEATURES.ACTION.storeFeatures(
          newFeatures.map((feature) => ({
            ...feature,
            ...(feature.type === "cat" && {
              categories: Object.assign(
                {},
                ...feature.categories.map((category) => ({
                  [category]: 0,
                }))
              ),
            }),
          }))
        )
      ),
      put(
        APPLICANTS.ACTION.storeApplicants(
          applicants.map((applicant) => {
            newFeatures.forEach((feature) => {
              if (feature.type === "num") {
                if (
                  applicant[feature.column_name] <
                  featuresMinMax[feature.id].min
                )
                  featuresMinMax[feature.id].min =
                    applicant[feature.column_name];
                if (
                  applicant[feature.column_name] >
                  featuresMinMax[feature.id].max
                )
                  featuresMinMax[feature.id].max =
                    applicant[feature.column_name];
              }
            });

            return {
              ...applicant,
              score: 0,
            };
          }),
          featuresMinMax
        )
      ),
    ]);

    yield call(updateFeatures);
    yield put(ESTIMATION.ACTION.storeEstimation("completed", time));
  } catch (error) {
    yield put(TFMS.error({ action, error }));
  }
}

function* error(action) {
  yield console.warn(action.error);
  yield console.error(action.error.error);
}

const NORMALIZE = (value, min1, max1, min2, max2) => {
  if (value < min1) return min2;
  if (value > max1) return max2;
  if (min1 === max1) return min2;

  return ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;
};

export default function* () {
  yield takeLatest(PROGRAMS.TYPE.FETCH_PROGRAMS, fetchPrograms);

  yield takeLatest(PROGRAMS.TYPE.SELECT_PERIOD, selectPeriod);

  yield takeLatest(RUN.TYPE.UPDATE_BUDGET, updateBudget);

  yield takeLatest(ESTIMATION.TYPE.START_ESTIMATION, startEstimation);

  yield takeLatest(FEATURES.TYPE.UPDATE_FEATURES_WEIGHTS, updateFeatures);
  yield takeLatest(FEATURES.TYPE.UPDATE_CATEGORIES_GRADES, updateFeatures);

  yield takeLatest(RUNS.TYPE.FETCH_RUNS, fetchRuns);

  yield takeEvery(RUNS.TYPE.DELETE_RUN, deleteRun);

  yield takeLatest(RUN.TYPE.POST_RUN, postRun);

  yield takeLatest(RUN.TYPE.FETCH_RUN, fetchRun);

  yield takeEvery(TFMS.TYPE.ERROR, error);
}
