import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, RefreshControl, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import { Header, Icon, NotFound, SafeAreaView, Text, ThumbSquareSmall } from '@/components';
import { allNotifications, deleteNotification, markNotificationAsRead } from '@/apis/notificationApi';
import { getMemoryRequest } from '@/apis/memoryApi';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

const MNotification = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSelector((state) => state.user);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(
    async (showLoader = true) => {
      try {
        if (!user?.id) {
          setNotifications([]);
          return;
        }

        if (showLoader) {
          setLoading(true);
        }

        const response = await allNotifications(user.id);
        const list = Array.isArray(response) ? response : response?.data || [];

        const normalized = list.map((item, index) => ({
          id: item.id ?? index + 1,
          title: item.type ?? 'Bildirim',
          description: item.body ?? '',
          image: item.image ?? null,
          createdAt: item.createdAt ?? item.date ?? new Date().toISOString(),
          isRead: item.isRead ?? false,
          data: item.data ?? null,
          url: item.targetUrl ?? item.url ?? null,
        }));

        setNotifications(normalized);
      } catch (error) {
        console.log('fetchNotifications error:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id]
  );

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(true);
    }, [fetchNotifications])
  );

  const extractMemoryIdFromUrl = useCallback((url) => {
    if (!url || typeof url !== 'string') return null;

    // örnekler:
    // https://site.com/#/memories/15
    // https://site.com/memories/15
    // /memories/15
    const match = url.match(/\/memories\/(\d+)/i);

    if (match?.[1]) {
      return Number(match[1]);
    }

    return null;
  }, []);

  const openNotificationTarget = useCallback(
    async (notificationItem) => {
      try {
        const memoryIdStr = notificationItem?.url || notificationItem?.data?.url || null;
        const memoryId = Number(memoryIdStr);

        if (memoryId) {
          const response = await getMemoryRequest(memoryId);

          const memory =
            response?.data ??
            response?.result ??
            response;

          if (memory) {
            navigation.navigate('NPostDetail', { item: memory });
            return;
          }
        }

        if (notificationItem?.data?.screen) {
          navigation.navigate(notificationItem.data.screen, notificationItem.data.params || {});
          return;
        }

        if (targetUrl) {
          const supported = await Linking.canOpenURL(targetUrl);
          if (supported) {
            await Linking.openURL(targetUrl);
            return;
          }
        }
      } catch (error) {
        console.log('openNotificationTarget error:', error);
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('error_file_message'),
        });
      }
    },
    [extractMemoryIdFromUrl, navigation, t]
  );

  useEffect(() => {
    const foregroundListener = Notifications.addNotificationReceivedListener((notification) => {
      const content = notification?.request?.content;

      const newNotification = {
        id: content?.data?.notificationId ?? `${Date.now()}`,
        title: content?.type ?? content?.data?.type ?? 'Yeni Bildirim',
        description: content?.body ?? '',
        image: null,
        createdAt: new Date().toISOString(),
        isRead: false,
        data: content?.data ?? null,
        url: content?.data?.targetUrl ?? content?.data?.url ?? content?.targetUrl ?? null,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const data = response?.notification?.request?.content?.data;
      const content = response?.notification?.request?.content;

      const clickedNotification = {
        id: data?.notificationId ?? `${Date.now()}`,
        title: content?.title ?? data?.type ?? 'Bildirim',
        description: content?.body ?? '',
        image: null,
        createdAt: new Date().toISOString(),
        isRead: false,
        data: data ?? null,
        url: data?.targetUrl ?? data?.url ?? null,
      };

      console.log('Notification tıklandı:', data);

      if (clickedNotification?.id) {
        try {
          await markNotificationAsRead(clickedNotification.id);

          setNotifications((prev) =>
            prev.map((item) =>
              String(item.id) === String(clickedNotification.id)
                ? { ...item, isRead: true }
                : item
            )
          );
        } catch (error) {
          console.log('markNotificationAsRead error:', error);
        }
      }

      await openNotificationTarget(clickedNotification);
    });

    return () => {
      foregroundListener.remove();
      responseListener.remove();
    };
  }, [openNotificationTarget]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications(false);
  }, [fetchNotifications]);

  const formatTime = useCallback(
    (dateString) => {
      if (!dateString) return '';

      const now = new Date();
      const createdDate = new Date(dateString);
      const diffMs = now - createdDate;

      const diffMin = Math.floor(diffMs / 60000);
      const diffHour = Math.floor(diffMs / 3600000);

      if (diffMin < 1) return t('now');
      if (diffMin < 60) return `${diffMin} ${t('min')}`;
      if (diffHour < 24) return `${diffHour} ${t('h')}`;

      return createdDate.toLocaleDateString('tr-TR');
    },
    [t]
  );

  const { recentNotifications, earlierNotifications } = useMemo(() => {
    const now = new Date();
    const recent = [];
    const earlier = [];

    notifications.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const diffHour = (now - createdAt) / 3600000;

      if (diffHour <= 24) {
        recent.push(item);
      } else {
        earlier.push(item);
      }
    });

    return {
      recentNotifications: recent,
      earlierNotifications: earlier,
    };
  }, [notifications]);

  const deleteNot = useCallback(
    async (id) => {
      try {
        const result = await deleteNotification(id);

        if (result?.isSuccess) {
          Toast.show({
            type: 'success',
            text1: t('success'),
            text2: t('success_message'),
          });

          setNotifications((prev) =>
            prev.filter((item) => String(item.id) !== String(id))
          );
        } else {
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: t('delete_error_message'),
          });
        }
      } catch (error) {
        console.log('deleteNotification error:', error);
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('delete_error_message'),
        });
      }
    },
    [t]
  );

  const renderLeftActions = useCallback(
    (item) => {
      return (
        <TouchableOpacity
          onPress={() => deleteNot(item.id)}
          activeOpacity={1}
          style={{
            width: 90,
            marginLeft: 10,
            marginBottom: 8,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: BaseColor.pinkDarkColor,
          }}
        >
          <Icon name="trash" size={18} color={colors.text} />
          <Text style={{ color: colors.text, marginTop: 4 }}>
            {t('delete')}
          </Text>
        </TouchableOpacity>
      );
    },
    [deleteNot, t, colors.text]
  );

  const renderNotificationItem = (item) => {
    return (
      <Swipeable
        key={item.id}
        renderLeftActions={() => renderLeftActions(item)}
        overshootLeft={false}
      >
        <View
          style={{
            opacity: item.isRead ? 1 : 0.6,
            backgroundColor: item.isRead ? 'transparent' : colors.primaryLight,
            borderRadius: 8,
            marginHorizontal: 10,
            marginBottom: 8,
          }}
        >
          <ThumbSquareSmall
            image={item.image}
            txtLeftTitle={item.title}
            txtContent={item.description}
            txtRight={formatTime(item.createdAt)}
            onPress={async () => {
              try {
                if (!item.isRead) {
                  await markNotificationAsRead(item.id);

                  setNotifications((prev) =>
                    prev.map((x) =>
                      String(x.id) === String(item.id)
                        ? { ...x, isRead: true }
                        : x
                    )
                  );
                }
              } catch (error) {
                console.log('markNotificationAsRead error:', error);
              }

              await openNotificationTarget(item);
            }}
          />
        </View>
      </Swipeable>
    );
  };

  const renderSection = (title, items) => {
    if (!items?.length) return null;

    return (
      <>
        <Text headline style={{ padding: 20, paddingBottom: 10 }}>
          {title}
        </Text>
        {items.map(renderNotificationItem)}
      </>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('notifications')}
        renderLeft={() => (
          <Icon name="angle-left" size={20} color={colors.text} enableRTL={true} />
        )}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>) : notifications.length === 0 ? (
            <NotFound style={{ flex: 1 }} />
          ) : (
          <>
            {renderSection(t('music_recents'), recentNotifications)}
            {renderSection(t('music_earlier'), earlierNotifications)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MNotification;