import {createSelector} from '@reduxjs/toolkit';
import {RootReduxState} from '../../types/store.types';

const selectCommonState = (state: RootReduxState) => state.common;

export const selectCommon = createSelector(
  [selectCommonState],
  common => common,
);
export const selectUser = createSelector(
  [selectCommonState],
  common => common.userData,
);
export const selectRole = createSelector(
  [selectCommonState],
  common => common.userRole,
);
export const selectMyPhotos = createSelector(
  [selectCommonState],
  common => common.myPhotos,
);
export const selecMytripPhoto = createSelector(
  [selectCommonState],
  common => common.tripPhotos,
);
export const selectItinerary = createSelector(
  [selectCommonState],
  common => common.itinerary,
);
export const selectAlbumTemp = createSelector(
  [selectCommonState],
  common => common.albumTemp,
);
