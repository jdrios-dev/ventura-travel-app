import {
  FlatList,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Header} from '../../../components';
import {ColorSet, appStyle} from '../../../styles';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {Screen} from '../../../constants';
import {
  getItinerary,
  getItineraryDestinations,
  getVSocialProjects,
} from '../../../networking/Services';

function removeVsocialText(text: string): string {
  const searchString = '| VSocial Foundation';
  if (text.includes(searchString)) {
    return text.replace(searchString, '').trim();
  } else {
    return text;
  }
}

const renderItem = ({item}, navigation, t) => {
  const headerImageUri = `https://storage.googleapis.com/media_ventura_travel/${item?.seo?.header_media?.[0]?.key}`;

  return (
    <View style={styles.projectCard}>
      <FastImage style={[styles.imageView]} source={{uri: headerImageUri}} />
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>{item.name}</Text>
        <Text style={styles.detailsDescription}>
          {removeVsocialText(item.seo?.title)}
        </Text>
        <Button
          onPress={() =>
            navigation.navigate(Screen.VSocialDetailProject, {
              project: item,
            })
          }>
          {t('button_now-more')}
        </Button>
      </View>
    </View>
  );
};

const VSocial = ({navigation}) => {
  const {t} = useTranslation();
  const [vSocialProjects, setVSocialProjects] = useState([]);
  const [vSocialProjectsItinerary, setVSocialProjectsItineray] = useState([]);

  const handleItineraryData = async () => {
    const data: any = await getItinerary();

    const projects = data.map(i => i?.vSocialProject).filter(i => i?.seo);

    if (projects?.length) {
      setVSocialProjectsItineray(projects.map(i => ({...i, i: 1})));
    }
  };

  const handleData = async () => {
    const {destinations} = await getItineraryDestinations();
    const destinationIds = destinations?.map(item => item?.id);
    const data = await getVSocialProjects(destinationIds);
    setVSocialProjects(data.map(i => ({...i, i: 2})));
  };
  useEffect(() => {
    handleData();
    handleItineraryData();
  }, []);

  const deleteDuplicates = (projectsFromDeparture, projectsFromDestination) => {
    const mainProjectsIds = projectsFromDeparture?.map(({id}) => id);
    const filtered = projectsFromDestination?.filter(
      item => !mainProjectsIds?.includes(item.id),
    );

    return [...projectsFromDeparture, ...filtered];
  };

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        title={t('title_vsocial-projects')}
        back
        onPressBack={() => navigation.goBack()}
      />
      {vSocialProjects?.length ? (
        <FlatList
          ListHeaderComponent={() => (
            <Text style={[styles.introduction, {color: ColorSet.grayLight}]}>
              {t('text_vsocial-introduction')}
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          data={deleteDuplicates(vSocialProjectsItinerary, vSocialProjects)}
          renderItem={item => renderItem(item, navigation, t)}
          keyExtractor={item => item?.id}
        />
      ) : (
        <View
          style={[
            appStyle.flex1,
            appStyle.aiCenter,
            appStyle.jcCenter,
            appStyle.p10,
          ]}>
          <Text style={styles.notFound}>
            {t('text_vsocial-no-found-projects')}
          </Text>
          <Button
            onPress={() => Linking.openURL('https://vsocialfoundation.org')}>
            {t('button_visit-now')}
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  projectCard: {
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 32,
    minHeight: 240,

    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    backgroundColor: 'white',
  },
  imageView: {
    width: '100%',
    height: 190,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  detailsContainer: {
    padding: 12,
  },
  detailsTitle: {
    color: ColorSet.themeLight,
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  detailsDescription: {
    color: ColorSet.textBase,
    fontSize: 16,
    marginBottom: 8,
  },
  introduction: {
    color: ColorSet.textBase,
    fontSize: 18,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  notFound: {
    color: ColorSet.textBase,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default VSocial;
