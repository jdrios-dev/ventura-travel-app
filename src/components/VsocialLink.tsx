import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View, Linking, StyleSheet} from 'react-native';
import Button from './Button';
import {ColorSet, FamilySet} from '../styles';
import {Screen} from '../constants';

type VsocialLinkProps = {
  data: {
    seo: {
      url_key: string;
    };
    name: string;
  };
  navigation: any;
};
// DELETE IF MARIE WANTS TO LINK THE VSOCIAL SCREEN AND NOT WEBSITE
// const createVsocialUrl = (urlKey: string, locale: string) => {
//   /**
//    * To lead FR, DE and EN to the page in that language
//    * we need to remove NL and Es due to the website does not
//    * support those langs
//    * EN is removed too due to is the default language
//    */
//   const langsToRemove = ['nl', 'es', 'en'];
//   const replaceLangForLink = langsToRemove.includes(locale) ? '' : `/${locale}`;
//   return `https://www.vsocialfoundation.org${replaceLangForLink}/social-projects/${urlKey}`;
// };

const VsocialLink = ({data, navigation}: VsocialLinkProps) => {
  const {t, i18n} = useTranslation();
  return (
    <View style={styles.containerView}>
      <Text style={styles.titleTextStyle}>{t('title_vsocial')}</Text>
      <Text style={[{...styles.detailTextStyle}, {marginBottom: 16}]}>
        {t('text_vsocial-description-project-name', {
          projectName: data?.name,
        })}
      </Text>
      <Button onPress={() => navigation.navigate(Screen.VSocial)}>
        {t('text_read-more')}
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  containerView: {
    backgroundColor: ColorSet.secondaryLight,
    padding: 10,
    marginTop: 10,
  },
  titleTextStyle: {
    fontSize: 18,
    fontFamily: FamilySet.bold,
    color: ColorSet.theme,
  },
  detailTextStyle: {
    fontSize: 16,
    fontFamily: FamilySet.regular,
    color: ColorSet.secondary,
    paddingTop: 5,
  },
});

export default VsocialLink;
