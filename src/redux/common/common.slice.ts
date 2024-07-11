import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CommonState} from '../../types/common.types';

const initialState: CommonState = {
  userData: '',
  userRole: 'TC',
  myPhotos: [],
  tripPhotos: [],
  albumTemp: [],
  itinerary: '',
};

const common = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUser: (state: CommonState, {payload}: PayloadAction<any>) => {
      state.userData = payload;
    },
    setRole: (state: CommonState, {payload}: PayloadAction<any>) => {
      state.userRole = payload;
    },
    setMyPhotos: (state: CommonState, {payload}: PayloadAction<any>) => {
      state.myPhotos = payload;
    },
    setTripPhotos: (state: CommonState, {payload}: PayloadAction<any>) => {
      state.tripPhotos = payload;
    },
    setItinerary: (state: CommonState, {payload}: PayloadAction<any>) => {
      state.itinerary = payload;
    },
    setAlbumTemp: (state: CommonState, {payload}: PayloadAction<[]>) => {
      state.albumTemp = [...state.albumTemp, ...payload];
    },
    setRemoveAlbumPhoto: (state: CommonState, {payload}: PayloadAction<[]>) => {
      state.albumTemp = payload;
    },
  },
});

export const {
  setUser,
  setRole,
  setMyPhotos,
  setTripPhotos,
  setItinerary,
  setAlbumTemp,
  setRemoveAlbumPhoto,
} = common.actions;

export default common.reducer;
