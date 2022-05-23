// Axios
import axios from "axios";

// API Methods
import { get, post, put, del } from "./api";

export const fetchPrograms = () => get(`/programs`);

export const fetchEstimation = (program_id, period_name) =>
  get(`/programs/${program_id}/period/${period_name}/estimation/status`);

export const startEstimation = (program_id, period_name) =>
  get(`programs/${program_id}/period/${period_name}/estimation/start`);

export const fetchFeatures = (program_id) =>
  get(`/programs/${program_id}/features`);

export const fetchApplicants = (program_id, period_name) =>
  get(`/programs/${program_id}/period/${period_name}/applicants`);

export const postRun = (run) => post(`/runs`, run);

export const fetchRun = (run_id) => get(`/runs/${run_id}`);

export const deleteRun = (run_id) => del(`/runs?run_id=${run_id}`);

export const fetchRuns = () => get(`/runs`);
