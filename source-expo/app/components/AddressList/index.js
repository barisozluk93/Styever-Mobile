import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/config';
import Text from '@/components/Text';
import styles from './styles';
import Icon from '@/components/Icon';
import { useTranslation } from 'react-i18next';

const AddressList = ({
  style = {},
  onSelect = () => { },
  disabled = true,
  item = {},
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity style={[styles.card, style, item.isPrimary && styles.selected, { backgroundColor: colors.card }]} onPress={onSelect}>
      <Text headline style={[styles.title, { color: colors.primary }]}>{item.addressHeader}</Text>
      <View style={styles.divider} />

      <View style={styles.propertiesGrid}>
          <View style={styles.propertyItem}>
            <Icon name="check" size={16} color={colors.primary} />
            <Text style={styles.property}>{item.address}</Text>
          </View>
          <View style={[styles.propertyItem, {marginBottom : 5}]}>
            <Icon name="check" size={16} color={colors.primary} />
            <Text style={styles.property}>{item.district} / {item.city}</Text>
          </View>
          <View style={styles.propertyItem}>
            <Icon name="check" size={16} color={colors.primary} />
            <Text style={styles.property}>{item.country}</Text>
          </View>
      </View>
    </TouchableOpacity>
  );
};

AddressList.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  subTitle: PropTypes.string,
  description: PropTypes.string,
  progress: PropTypes.number,
  days: PropTypes.string,
  members: PropTypes.array,
};

export default AddressList;
