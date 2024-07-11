import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {Button, Header} from '../../../components';
import {ColorSet, appStyle, screenWidth} from '../../../styles';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import AccordionItem from '../../../components/Accordeon';
import {Screen} from '../../../constants';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

const VSocialDetailProject = ({navigation, route}) => {
  const projectData = route.params.project;
  const {t} = useTranslation();

  const headerImageUri = `https://storage.googleapis.com/media_ventura_travel/${projectData?.seo?.header_media?.[0]?.key}`;
  const makeImagesUrl = media => {
    return media?.map(item => ({
      ...item,
      url: `https://storage.googleapis.com/media_ventura_travel/${item?.key}`,
    }));
  };

  const renderImages = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          appStyle.rowWrap,
          appStyle.ph5,
          {
            paddingLeft: 0,
            height: screenWidth.width100 / 3.5 - 5,
          },
        ]}
        onPress={() =>
          navigation.navigate(Screen.PhotoDetail, {
            items: item,
            hideActions: true,
            hideProperties: true,
          })
        }>
        <Image style={[styles.imageViewSmall]} source={{uri: item?.url}} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[appStyle.safeContainer]}>
      <StatusBar backgroundColor={ColorSet.white} barStyle={'dark-content'} />
      <Header
        title={projectData.name}
        back
        onPressBack={() => navigation.goBack()}
      />
      <FastImage style={[styles.imageView]} source={{uri: headerImageUri}} />
      <FlatList
        data={makeImagesUrl(projectData.media)}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={renderImages}
        keyExtractor={(_, index) => index.toString()}
        style={styles.imageCarousel}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollview}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{justifyContent: 'flex-start'}}>
        <AccordionItem title={t('title_project-description')}>
          <Text style={styles.detailsDescription}>
            {projectData.description}
          </Text>
        </AccordionItem>
        <AccordionItem title={t('text_involvement')}>
          <Text style={styles.detailsDescription}>
            {projectData.additional_text_1}
          </Text>
        </AccordionItem>
        <AccordionItem title={t('text_their-story')}>
          <Text style={styles.detailsDescription}>
            {projectData.additional_text_2}
          </Text>
        </AccordionItem>
        {/* Spacer, do not remove */}
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{height: 20}} />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.navigate(Screen.VSocialDonationForm)}>
          {t('button_donate-now')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  projectCard: {
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 16,
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
  },
  detailsContainer: {
    padding: 12,
  },
  detailsTitle: {
    color: ColorSet.textBase,
    fontSize: 18,
    marginBottom: 8,
  },
  detailsDescription: {
    color: ColorSet.textBase,
    fontSize: 16,
  },
  scrollview: {
    padding: 8,
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 8,
  },
  imageViewSmall: {
    marginBottom: 10,
    width: screenWidth.width100 / 3.5 - 5,
    height: screenWidth.width100 / 3.5 - 5,
    resizeMode: 'cover',
  },
  imageCarousel: {
    marginVertical: 4,
    maxHeight: screenWidth.width100 / 3.5 - 5,
  },
});

export default VSocialDetailProject;
