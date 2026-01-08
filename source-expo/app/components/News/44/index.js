import PropTypes from 'prop-types';
import { ImageBackground, TouchableOpacity, View } from 'react-native';
import { BaseColor, Images } from '@/config';
import ProfileAuthor from '@/components/Profile/Author';
import Text from '@/components/Text';
import Loading from './Loading';
import styles from './styles';

const News44 = ({
  style = {},
  image = Images.news,
  title = '',
  onPress = () => {},
  loading,
}) => {
  if (loading) {
    return <Loading style={style} />;
  }

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <ImageBackground source={{ uri: image }} style={styles.imageBackground} borderRadius={8}>
        <View style={styles.viewBackground}>
          <Text title3 whiteColor semibold>
            {title}
          </Text>
        </View>
      </ImageBackground> :
    </TouchableOpacity>
  );
};

News44.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  title: PropTypes.string,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
};

export default News44;
