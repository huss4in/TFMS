// Redux
import { all, fork } from "redux-saga/effects";

// Auth
import AuthSaga from "./auth/login/saga";

// Layout
import LayoutSaga from "./layout/saga";

// TFMS
import TFMS from "./tfms/saga";

export default function* rootSaga() {
  yield all([fork(AuthSaga), fork(LayoutSaga), fork(TFMS)]);
}
