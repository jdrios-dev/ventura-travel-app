import React from 'react';
import {StyleSheet, View} from 'react-native';

import {ColorSet} from '../styles';

import ActionSheet from 'react-native-actions-sheet';

interface BottomSheetProps {
  bottomSheetRef: React.Ref<ActionSheet> | undefined;
  overlayOpacity?: number | undefined;
  bottomCloseBtn?: boolean | undefined;
  closeOnTouchBackdrop?: boolean | undefined;
}

const BottomSheet: React.FC<BottomSheetProps> = props => {
  const {bottomSheetRef} = props;

  return (
    <ActionSheet
      bounceOnOpen={true}
      elevation={0}
      indicatorColor={'#ccc'}
      closeOnPressBack={true}
      closeOnTouchBackdrop={true}
      openAnimationSpeed={10}
      overlayColor={ColorSet.grey}
      defaultOverlayOpacity={0.5}
      ref={bottomSheetRef}>
      <View style={styles.contentContainer}>{props.children}</View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 25,
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: ColorSet.white,
  },
});

export default BottomSheet;
