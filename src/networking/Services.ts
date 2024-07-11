import {Method, callApi} from './NetworkManager';
import {api} from './Environment';
import {handleResponse} from './ResponseHandler';
import makePaxFlightsList from '../mappers/makePaxFlightsList';
import {
  TABLE_CONFIG_NAME,
  TABLE_OFFLINE_NAME,
  getDBConnection,
  saveDbValue,
} from './DBConection';
import {DayIndex, DbKeys} from '../constants/screens/dbKeys';

export const editProfile = async ({
  email,
  fullName,
  phoneNumber,
  profilePicture,
}) => {
  const data = {email, fullName, phoneNumber, profilePicture};
  const response = await callApi(
    api.editProfile,
    Method.PATCH,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};

export const getProfile = async () => {
  const data = null;
  const response = await callApi(
    api.profiledetails,
    Method.GET,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const createProfile = async ({
  fullName,
  phoneNumber,
  profilePicture,
}) => {
  const data = {fullName, phoneNumber, profilePicture};
  const response = await callApi(
    api.createProfile,
    Method.POST,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const requestPassword = async ({email}) => {
  const data = {email};
  const response = await callApi(
    api.requestPassword,
    Method.PATCH,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const resetPassword = async ({email, resetHashCode, password}) => {
  const data = {email, resetHashCode, password};
  const response = await callApi(
    api.resetPassword,
    Method.PATCH,
    data,
    false,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const changePassword = async ({oldPassword, newPassword}) => {
  const data = {oldPassword, newPassword};
  const response = await callApi(
    api.changepassword,
    Method.PATCH,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const getNotes = async () => {
  const data = null;
  const response = await callApi(
    api.getNotes,
    Method.GET,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const editNote = async (params: any, id: any) => {
  const response = await callApi(
    api.editNotes,
    Method.PATCH,
    params,
    true,
    false,
    id,
  );
  const result = await handleResponse(response);
  return result;
};
export const deleteNote = async (id: any) => {
  const data = null;
  const response = await callApi(
    api.deleteNotes,
    Method.DELETE,
    data,
    true,
    true,
    id,
  );

  const result = await handleResponse(response);
  return result;
};
export const addNote = async (params: any) => {
  const response = await callApi(
    api.addNotes,
    Method.POST,
    params,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};

export const getPassengerList = async () => {
  const db = await getDBConnection();
  const data = null;
  const response = await callApi(
    api.passengersList,
    Method.GET,
    data,
    true,
    true,
    null,
  );
  const result = await handleResponse(response);
  if (result?.length > 0) {
    await saveDbValue(db, DbKeys.travelersList, result, TABLE_OFFLINE_NAME);
  }
  return result;
};
export const getPassengerListBirthday = async () => {
  const db = await getDBConnection();
  const data = null;
  const response = await callApi(
    api.passengersListBirthday,
    Method.GET,
    data,
    true,
    true,
    null,
  );
  const result = await handleResponse(response);
  if (result?.length > 0) {
    await saveDbValue(db, DbKeys.paxBirthday, result, TABLE_OFFLINE_NAME);
  }
  return result;
};

export const getSinglePassenger = async (id: any) => {
  const data = null;
  const response = await callApi(
    api.singlePax,
    Method.GET,
    data,
    true,
    true,
    id,
  );
  const result = await handleResponse(response);
  return result;
};

export const getFAQ = async () => {
  const data = null;
  const response = await callApi(api.faq, Method.GET, data, true, false, null);
  const result = await handleResponse(response);
  return result;
};

export const getRooms = async () => {
  const data = null;
  const response = await callApi(
    api.roomList,
    Method.GET,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};

export const getDays = async () => {
  const db = await getDBConnection();
  const data = null;
  const response = await callApi(
    api.guidePlan,
    Method.GET,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  if (result?.length > 0) {
    await saveDbValue(db, DbKeys.itineraryTc, result, TABLE_OFFLINE_NAME);
  }
  return result;
};

export const getSingleDay = async (id: any, dayNumber: number) => {
  const db = await getDBConnection();
  const data = null;
  const response = await callApi(
    api.guidePlan,
    Method.GET,
    data,
    true,
    true,
    id,
  );
  const result = await handleResponse(response);

  if (result) {
    await saveDbValue(
      db,
      `day${dayNumber}` as DayIndex,
      result,
      TABLE_OFFLINE_NAME,
    );
  }
  return result;
};

export const getTripSummary = async () => {
  const db = await getDBConnection();
  const response = await callApi(
    api.getTripSummary,
    Method.GET,
    null,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  if (result) {
    await saveDbValue(db, DbKeys.moreInformation, result, TABLE_OFFLINE_NAME);
  }
  return result;
};

export const getMoreInformation = async () => {
  const response = await callApi(
    api.moreInformation,
    Method.GET,
    null,
    true,
    true,
    null,
  );

  const result = await handleResponse(response);
  return result;
};

export const getFlightReachability = async () => {
  const db = await getDBConnection();
  const response = await callApi(
    api.flightReachability,
    Method.GET,
    null,
    true,
    true,
    null,
  );

  const result = await handleResponse(response);
  if (result) {
    await saveDbValue(db, DbKeys.flightTime, result, TABLE_OFFLINE_NAME);
  }
  return result;
};
export const confirmAllPhotosAlbum = async (
  departureId: number,
  status: boolean,
) => {
  const data = {departureId: departureId, confirmed: status};
  const response = await callApi(
    api.confirmAllPhotos,
    Method.POST,
    data,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};
export const getPhotoAlbumStatus = async (departureId: number) => {
  const response = await callApi(
    api.getAlbumConfirmedStatus,
    Method.GET,
    null,
    true,
    false,
    departureId,
  );
  const result = await handleResponse(response);
  return result;
};
export const getFlightInformation = async () => {
  const db = await getDBConnection();
  const response = await callApi(
    api.flightInformation,
    Method.GET,
    null,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  const paxList = makePaxFlightsList(result);
  if (result?.length > 0) {
    await saveDbValue(db, DbKeys.flights, paxList, TABLE_OFFLINE_NAME);
  }
  return paxList;
};

export const getFlightInformationPerPax = async () => {
  const db = await getDBConnection();
  const response = await callApi(
    api.flightInformationPax,
    Method.GET,
    null,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  const paxList = makePaxFlightsList(result);

  if (result?.length > 0) {
    await saveDbValue(db, DbKeys.flightsPax, paxList, TABLE_OFFLINE_NAME);
  }
  return paxList;
};

export const getChat = async () => {
  const response = await callApi(api.chat, Method.GET, null, true, false, null);
  const result = await handleResponse(response);
  return result;
};

export const updateDepartureId = async (departureId: string) => {
  const response = await callApi(
    api.updateDepartureId,
    Method.PATCH,
    {},
    true,
    false,
    departureId,
  );

  const result = await handleResponse(response);
  return result;
};

export const getEmergencyContact = async () => {
  const db = await getDBConnection();
  const response = await callApi(
    api.emergencyContact,
    Method.GET,
    null,
    true,
    true,
    null,
  );
  const result = await handleResponse(response);
  if (result) {
    await saveDbValue(db, DbKeys.emergency, result, TABLE_OFFLINE_NAME);
  }
  return result;
};

export const getItinerary = async () => {
  const db = await getDBConnection();

  const response = await callApi(
    api.getItinerary,
    Method.GET,
    null,
    true,
    false,
    null,
  );

  const result = await handleResponse(response);
  if (result) {
    await saveDbValue(db, DbKeys.itinerary, result, TABLE_OFFLINE_NAME);
  }
  return result;
};

export const getItineraryDestinations = async () => {
  const response = await callApi(
    api.destinations,
    Method.GET,
    null,
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};

export const getSignedUrlPhotos = async (
  departureId: number,
  photosNames: string[],
) => {
  const response = await callApi(
    api.getSignedUrlPhotos,
    Method.POST,
    {
      fileNames: photosNames,
      departureId: departureId,
    },
    true,
    false,
    null,
  );
  const result = await handleResponse(response);
  return result;
};

export const getAlbumPhotos = async (departureId: number) => {
  const response = await callApi(
    api.getAlbumphotos,
    Method.GET,
    null,
    true,
    false,
    departureId,
  );
  const result = await handleResponse(response);

  return result;
};

export const getRecommendedRestaurants = async (destinationIds: string[]) => {
  const response = await callApi(
    api.recommendedRestaurants,
    Method.POST,
    {destinationIds},
    true,
    false,
    null,
  );

  const result = await handleResponse(response);

  return result;
};

export const getVSocialProjects = async (destinationIds: string[]) => {
  const response = await callApi(
    api.vsocialProjects,
    Method.POST,
    {destinationIds},
    true,
    false,
    null,
  );

  const result = await handleResponse(response);

  return result;
};

export const deleteAlbumPhoto = async (
  departureId: number,
  photoName: string,
) => {
  const response = await callApi(
    `photo/${departureId}/photos`,
    Method.DELETE,
    {
      departureId,
      fileNames: [photoName],
    },
    true,
    false,
    false,
  );

  const result = await handleResponse(response);

  return result;
};

export const sendFile = async (image: any) => {
  const formData = new FormData();

  const uri = image;

  const localUri = decodeURIComponent(uri);
  const filename = localUri.split('/').pop();
  const type = 'image/jpeg';
  const file: any =
    typeof {uri: localUri, name: filename, type} !== 'undefined'
      ? {uri: localUri, name: filename, type}
      : 0;

  formData.append('file', file);

  const response = await callApi(
    api.sendImage,
    Method.POST,
    formData,
    true,
    true,
    null,
  );

  const result = await handleResponse(response);
  return result;
};

export const getReservationGroupList = async () => {
  const response = await callApi(
    api.reservationGroupPaxList,
    Method.GET,
    null,
    true,
    false,
    null,
  );

  const result = await handleResponse(response);
  if (!result || !result.length) {
    return [];
  }
  const resultMapped = result?.map(item => {
    const id = item.id;
    const mainBookerId = item.booking_client_id;
    const names = item.reservation_client
      .map(({client}) => {
        return client?.first_name;
      })
      .join(', ');

    return {id, mainBookerId, names, path: null, photoDenied: null};
  });

  return resultMapped;
};

export const updateClientPhoto = async (clientId: string, image: any) => {
  const formData = new FormData();

  const uri = image;

  const localUri = decodeURIComponent(uri);
  const filename = localUri.split('/').pop();
  const type = 'image/jpeg';
  const file: any =
    typeof {uri: localUri, name: filename, type} !== 'undefined'
      ? {uri: localUri, name: filename, type}
      : 0;

  formData.append('file', file);
  formData.append('clientId', clientId);

  const response = await callApi(
    api.clientUpdateImageProfile,
    Method.PATCH,
    formData,
    true,
    true,
    null,
  );

  const result = await handleResponse(response);
  return result;
};
