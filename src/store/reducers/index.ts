import { combineReducers } from 'redux'
import tasksReducer from './tasks'
import { Store } from '../models'

const allReducers = combineReducers<Store>({
  tasks: tasksReducer,
})

export default allReducers
