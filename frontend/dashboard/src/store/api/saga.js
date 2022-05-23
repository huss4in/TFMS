// Redux
import {
  call,
  put,
  all,
  select,
  delay,
  race,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

// Backend
import * as BACKEND from "../../helpers/backend";

// Actions
import * as API from ".";

function* fetchPrograms(action) {
  try {
    const programs = yield call(BACKEND.fetchPrograms);

    yield put(API.storePrograms(programs));
  } catch (error) {
    yield put(API.error({ action, error }));
  }
}

function* error(action) {
  yield console.warn("API error:", action.error);
  yield console.error(action.error.error);
}

export default function* () {}
