import {combineReducers} from '@reduxjs/toolkit';
import {RootReduxState} from '../types/store.types';
import common from './common/common.slice';
const rootReducer = combineReducers<RootReduxState>({
  common,
});
export default rootReducer;
