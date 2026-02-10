// components/MediaSlider.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Video } from 'expo-av';
import styles from './styles';
import { Linking } from "react-native";
import Icon from '@/components/Icon';

const { width } = Dimensions.get('window');

export default function MediaSlider({ media, activeMediaIndex, onIndexChange }) {
  const [activeIndex, setActiveIndex] = useState(activeMediaIndex);
  const [loadingMap, setLoadingMap] = useState({});
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
      onIndexChange?.(viewableItems[0].index);
    }
  });

  const setLoading = (index, value) => {
    setLoadingMap(prev => ({ ...prev, [index]: value }));
  };

  const getItemLayout = (_, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  useEffect(() => {
    if (flatListRef.current && activeMediaIndex != null) {
      flatListRef.current.scrollToIndex({
        index: activeMediaIndex,
        animated: true,
      });
      setActiveIndex(activeMediaIndex);
    }
  }, [activeMediaIndex])

  const openYoutube = (videoId) => {
    Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  };


  return (
    <FlatList
      ref={flatListRef}
      getItemLayout={getItemLayout}
      data={media}
      horizontal
      pagingEnabled
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 100 }}
      renderItem={({ item, index }) => (
        <View style={{ width }}>
          {item.type === 'image' ? (
            <Image
              source={{ uri: item.uri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : item.type === 'video' ? (
            <View style={styles.videoWrapper}>
              {loadingMap[index] !== false && (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" />
                </View>
              )}
              <Video
                source={{ uri: item.uri }}
                style={{ width: '100%', height: '100%' }}
                useNativeControls={false}
                resizeMode="cover"
                shouldPlay={true}
                isLooping
                onError={(error) => console.log(error)}
                onLoadStart={() => setLoading(index, true)}
                onReadyForDisplay={() => setLoading(index, false)}
              />
            </View>
          ) : (
            <View style={styles.youtubeContainer}>
              <Image
                source={{ uri: `https://img.youtube.com/vi/${item.uri}/hqdefault.jpg` }}
                style={styles.youtubeImage}
                resizeMode="cover"
              />

              <View style={styles.youtubeOverlay} />

              {/* SADECE PLAY BUTONU TIKLANABİLİR */}
              <TouchableOpacity
                style={styles.youtubePlay}
                activeOpacity={0.8}
                onPress={() => openYoutube(item.uri)}
              >
                <Icon name="play" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    />
  );
}
