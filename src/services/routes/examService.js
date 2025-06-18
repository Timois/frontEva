// services/ExamService.js

import { getApi } from "../axiosServices/ApiService"

export const fetchAllExamns = async () => {
  return await getApi("evaluations/list")
}

export const fetchExamnById = async (id) => {
  return await getApi(`evaluations/find/${id}`)
}

export const fetchPeriodById = async (periodId) => {
  return await getApi(`evaluations/findPeriod/${periodId}`)
}

export const fetchExamnsByCareer = async (careerId) => {
  return await getApi(`evaluations/findEvaluationsBYCareer/${careerId}`)
}
