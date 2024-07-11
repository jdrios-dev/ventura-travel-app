import React, {ReactNode, useState} from 'react';
import {TouchableOpacity, View, StyleSheet, Text, Image} from 'react-native';
import {ColorSet} from '../styles';
import {Icons} from '../constants';

type AccordionItemPros = {
  children: ReactNode;
  title: string;
};

function AccordionItem({children, title}: AccordionItemPros) {
  const [expanded, setExpanded] = useState(false);

  function toggleItem() {
    setExpanded(!expanded);
  }

  const body = <View style={styles.accordBody}>{children}</View>;

  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity
        style={[
          styles.accordHeader,
          {
            ...(expanded && {borderBottomLeftRadius: 0}),
            ...(expanded && {borderBottomRightRadius: 0}),
          },
        ]}
        onPress={toggleItem}>
        <Text style={styles.accordTitle}>{title}</Text>

        <Image
          source={expanded ? Icons.arrowUpWhite : Icons.arrowDownWhite}
          style={styles.imgArrow}
        />
      </TouchableOpacity>
      {expanded && body}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accordContainer: {
    paddingBottom: 4,
    borderRadius: 16,
  },
  accordHeader: {
    padding: 12,
    backgroundColor: ColorSet.themeLight,
    color: '#eee',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
  },
  accordTitle: {
    fontSize: 20,
    color: ColorSet.white,
    fontWeight: 'bold',
  },
  accordBody: {
    padding: 12,
  },
  textSmall: {
    fontSize: 18,
  },
  seperator: {
    height: 12,
  },
  imgArrow: {
    width: 25,
    height: 25,
  },
});

export default AccordionItem;
