import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import Text from '@/components/Text';
import Loading from './Loading';
import styles from './styles';
import Image from '@/components/Image';
import { Icon } from '@/components';
import { useTheme } from '@/config';
import { useTranslation } from 'react-i18next';

const News43 = ({
  style = {},
  image = '',
  username = '',
  name = '',
  postDate = '',
  deathDate = '',
  birthDate = '',
  category = {},
  commentCount = 0,
  likeCount = 0,
  fileResult = undefined,
  isLiked = false,
  onPress = () => { },
  onLikePress = () => { },
  onLikeListPress = () => { },
  onCommentPress = () => { },
  loading,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const formatDate = (date, isDateTime) => {
    if (isDateTime) {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  if (loading) {
    return <Loading style={style} />;
  }

  return (
    <View style={style}>

      <View style={styles.card}>
        {fileResult && <Image
          source={{ uri: `data:image/*;base64,${image}` }}
          style={styles.image}
        />}

        {!fileResult && <Image
          source={image}
          style={styles.image}
        />}

        <View style={styles.content}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={onPress}>
              <Text headline>{name}</Text>
            </TouchableOpacity>

            <View style={styles.stats}>
              <TouchableOpacity style={styles.statItem} onPress={onCommentPress}>
                <Icon name="comment" size={20} color={colors.primaryLight} />
                <Text bold style={[styles.statText, { color: colors.text }]} >{commentCount}</Text>
              </TouchableOpacity>

              <View style={styles.statItem}>
                <TouchableOpacity onPress={onLikePress}>
                  {isLiked ? <Icon name="heart" size={20} color={colors.primaryLight} solid /> : <Icon name="heart" size={20} color={colors.primaryLight} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={onLikeListPress}>
                  <Text bold style={[styles.statText, { color: colors.text }]}>{likeCount}</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>

          <View style={styles.row}>
            <Text bold style={styles.label}>{t('category')}</Text>
            <Text bold style={[styles.value, { color: colors.text }]}>{category.name}</Text>
          </View>

          <View style={styles.row}>
            <Text bold style={styles.label}>{t('birth_date')}</Text>
            <View style={styles.iconValue}>
              <Icon solid name="calendar-alt" size={12} color={colors.primaryLight} />
              <Text bold style={[styles.value, { color: colors.text }]}>{formatDate(new Date(birthDate), false)}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text bold style={styles.label}>{t('death_date')}</Text>
            <View style={styles.iconValue}>
              <Icon solid name="calendar-alt" size={12} color={colors.primaryLight} />
              <Text bold style={[styles.value, { color: colors.text }]}>{formatDate(new Date(deathDate), false)}</Text>
            </View>
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <View style={styles.iconValue}>
              <Icon solid name="user" size={12} color={colors.primaryLight} />
              <Text style={[styles.footerText, { color: colors.text }]}>{username}</Text>
            </View>

            <View style={styles.iconValue}>
              <Icon solid name="calendar-alt" size={12} color={colors.primaryLight} />
              <Text style={[styles.footerText, { color: colors.text }]}>{formatDate(new Date(postDate), true)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

News43.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  avatar: PropTypes.node.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
};

export default News43;
