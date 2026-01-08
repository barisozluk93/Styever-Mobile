import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, I18nManager, ScrollView, View, } from 'react-native';
import {
  Header,
  Image,
  SafeAreaView,
  Text,
  PlaceholderLine,
  Placeholder,
} from '@/components';
import { BaseColor, BaseStyle, useTheme, Images } from '@/config';
import * as Utils from '@/utils';
import styles from './styles';
import { useSelector } from 'react-redux';
import RenderHTML from 'react-native-render-html';
import { articleUploadFolderUrl } from '@/utils/utility';

const NArticleDetail = (props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [itemData, setItemData] = useState();
  const [loading, setLoading] = useState(true);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const { language } = useSelector((state) => state.application);

  useEffect(() => {
    if (route?.params?.item) {
      setItemData(route?.params?.item);
    }
  }, [route?.params?.item])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  //For header background color from transparent to header color
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [BaseColor.whiteColor, colors.primary],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  //For header image opacity
  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, 350 - heightHeader - 20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  //artist profile image position from top
  const heightViewImg = scrollY.interpolate({
    inputRange: [0, 350 - heightHeader],
    outputRange: [350, heightHeader],
    useNativeDriver: true,
  });

  const renderPlaceholder = () => {
    let holders = Array.from(Array(5));

    return (
      <Placeholder>
        <View style={{ padding: 20 }}>
          {holders.map((item, index) => (
            <PlaceholderLine key={index} width={100} />
          ))}
        </View>
      </Placeholder>
    );
  };

  const renderContent = () => {
    return (
      <Fragment>
        <View style={styles.contentDescription}>
          <Text
            body2
            style={{
              color: colors.text,
              lineHeight: 20,
              paddingTop: 10,
            }}
            numberOfLines={100}
          >
            <RenderHTML source={{
              html: language === 'tr'
                ? itemData.content
                : itemData.contentEn
            }}
            baseStyle={{color: colors.text}}
              tagsStyles={{
                p: {
                  marginBottom: 12,
                  lineHeight: 22,
                  fontSize: 15,
                  marginTop: 10
                },
                b: {
                  fontSize: 16,
                  marginVertical: 8,
                  fontWeight: '600',
                },
                strong: {
                  fontSize: 16,
                  marginVertical: 8,
                  fontWeight: '600',
                },
              }}>
            </RenderHTML>
          </Text>
        </View>
      </Fragment>
    );
  };

  if (itemData) {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={[BaseStyle.safeAreaView]} forceInset={{ top: 'always', bottom: 'always' }}>
          <Header title='' />
          <ScrollView
            onContentSizeChange={() => {
              setHeightHeader(Utils.heightHeader());
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
            style={{ zIndex: 10 }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { y: scrollY },
                  },
                },
              ],
              {
                useNativeDriver: false,
              }
            )}
          >
            <View style={{ height: 330 - heightHeader }} />
            {loading ? renderPlaceholder() : renderContent()}
          </ScrollView>
        </SafeAreaView>
        <Animated.View
          style={[
            styles.headerImageStyle,
            {
              opacity: headerImageOpacity,
              height: heightViewImg,
            },
          ]}
        >
            <Image
              source={{ uri: itemData.file ? articleUploadFolderUrl + itemData.file.path.split("\\")[itemData.file.path.split("\\").length-1] : Images.avata6 }}
              style={{ height: '100%', width: '100%' }}
            />

          <View style={styles.imageOverlay}>
            <Text title3 whiteColor bold style={{marginBottom: 10}}>
                {language === 'tr' ? itemData.header : itemData.headerEn}
            </Text>

            {itemData.subHeader ? (
              <Text title4 whiteColor semibold>
                {language === 'tr' ? itemData.subHeader : itemData.subHeaderEn}
              </Text>
            ) : null}
          </View>

        </Animated.View>
        <Animated.View style={[styles.headerStyle, { position: 'absolute' }]}>
          <SafeAreaView style={{ width: '100%' }} forceInset={{ top: 'always', bottom: 'never' }}>
            <Header
              title=""
              renderLeft={() => {
                return (
                  <Animated.Image
                    resizeMode="contain"
                    style={[
                      styles.icon,
                      {
                        transform: [
                          {
                            scaleX: I18nManager.isRTL ? -1 : 1,
                          },
                        ],
                        tintColor: headerBackgroundColor,
                      },
                    ]}
                    source={Images.angleLeft}
                  />
                );
              }}
              onPressLeft={() => {
                navigation.navigate('NArticle');
              }}
            />
          </SafeAreaView>
        </Animated.View>
      </View>
    );
  }
};

export default NArticleDetail;
