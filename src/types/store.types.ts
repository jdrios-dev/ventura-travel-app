import {Action, ThunkAction, ThunkDispatch} from '@reduxjs/toolkit';
import {CommonState} from './common.types';
export interface RootReduxState {
  common: CommonState;
}

export type AppDispatch = ThunkDispatch<
  RootReduxState,
  unknown,
  Action<string>
>;

export type AppThunk<T = Promise<void> | void> = ThunkAction<
  T,
  RootReduxState,
  unknown,
  Action<string>
>;
