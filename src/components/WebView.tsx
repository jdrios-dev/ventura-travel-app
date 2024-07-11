import React from 'react';
import {TextStyle} from 'react-native';
import {WebView} from 'react-native-webview';

import appStyle from '../styles/appStyle';
interface HtmlWebViewProps {
  style?: TextStyle | undefined;
  htmlCode?: any;
}
const HtmlWebView: React.FC<HtmlWebViewProps> = props => {
  const {style, htmlCode} = props;
  return <WebView style={[appStyle.m10, style]} source={{html: htmlCode}} />;
};
export default HtmlWebView;
