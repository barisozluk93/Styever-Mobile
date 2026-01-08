import PropTypes from 'prop-types';
import { ImageBackground, TouchableOpacity, View } from 'react-native';
import { BaseColor, Images, useTheme } from '@/config';
import ProfileAuthor from '@/components/Profile/Author';
import Text from '@/components/Text';
import Loading from './Loading';
import styles from './styles';
import { Icon } from '@/components';
import { useTranslation } from 'react-i18next';

const News45 = ({
  style = {},
  image = Images.news,
  isImageExist = false,
  avatar = '',
  isAvatarExist = false,
  username = '',
  postDate = '',
  title = '',
  commentCount = 0,
  likeCount = 0,
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
    <TouchableOpacity style={style} onPress={onPress}>
      <ImageBackground source={isImageExist ? { uri: image } : image} style={styles.imageBackground} borderRadius={8}>
        <View style={styles.viewBackground}>
          <View style={styles.viewItem}>
            <ProfileAuthor
              styleThumb={styles.styleThumb}
              image={avatar}
              isAvatarExist={isAvatarExist}
              styleName={{ color: BaseColor.whiteColor }}
              styleDescription={{
                color: BaseColor.whiteColor,
              }}
              name={username}
              description={formatDate(new Date(postDate), true)}
            />
          </View>

          <View style={[styles.header, { borderTopColor: BaseColor.whiteColor }]}>
            <Text title3 whiteColor semibold>
              {title}
            </Text>
            <View style={styles.stats}>
              <TouchableOpacity style={styles.statItem} onPress={onCommentPress}>
                <Icon name="comment" size={20} color={BaseColor.whiteColor} />
                <Text bold style={[styles.statText, { color: BaseColor.whiteColor }]} >{commentCount}</Text>
              </TouchableOpacity>

              <View style={styles.statItem}>
                <TouchableOpacity onPress={onLikePress}>
                  {isLiked ? <Icon name="heart" size={20} color={BaseColor.whiteColor} solid /> : <Icon name="heart" size={20} color={BaseColor.whiteColor} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={onLikeListPress}>
                  <Text bold style={[styles.statText, { color: BaseColor.whiteColor }]}>{likeCount}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

News45.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  avatar: PropTypes.node.isRequired,
  name: PropTypes.string,
  postDate: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
  onLikePress: PropTypes.func,
  onLikeListPress: PropTypes.func,
  onCommentPress: PropTypes.func,
  loading: PropTypes.bool,
  isLiked: PropTypes.bool,
  commentCount: PropTypes.number,
  likeCount: PropTypes.number
};

export default News45;
