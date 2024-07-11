import orderBy from 'lodash/orderBy';

const makePaxFlightsList = (data: any) => {
  if (!data?.length) {
    return [];
  }
  const pax = data.map(item => {
    return {
      pax: {
        id: item?.pax?.id,
        fullName: `${item?.pax?.first_name} ${item?.pax?.last_name}`,
        isTc: item?.isTC,
      },
      itinerary: item?.itinerary,
    };
  });

  const orderedList = orderBy(pax, item => item.pax.fullName, ['asc']);

  return orderedList;
};

export default makePaxFlightsList;
