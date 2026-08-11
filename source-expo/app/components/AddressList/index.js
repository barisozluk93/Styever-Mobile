import PropTypes from 'prop-types';
import {TouchableOpacity,View} from 'react-native';
import {BaseColor,useTheme} from '@/config';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import {useTranslation} from 'react-i18next';
import styles from './styles';

const AddressList=({
  style={},
  onSelect=()=>{},
  onDelete=()=>{},
  item={},
})=>{
  const {colors}=useTheme();
  const {t}=useTranslation();

  return(
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        style,
        {
          backgroundColor:colors.card,
          borderColor:colors.border,
        },
      ]}
      onPress={onSelect}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardContent}>
          <Text
            numberOfLines={0}
            style={styles.title}
          >
            {item.addressHeader||t('address')}
          </Text>

          <View style={styles.badges}>
            {item.isPrimary&&(
              <View
                style={[
                  styles.badge,
                  {backgroundColor:colors.primary+'14'},
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {color:colors.primary},
                  ]}
                >
                  {t('primary')}
                </Text>
              </View>
            )}

            {!!item.city&&(
              <View
                style={[
                  styles.badge,
                  styles.outlineBadge,
                  {borderColor:colors.border},
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.city}
                </Text>
              </View>
            )}
          </View>

          <Text
            numberOfLines={0}
            grayColor
            style={styles.address}
          >
            {item.address}
          </Text>

          <Text
            numberOfLines={0}
            style={styles.location}
          >
            {[item.district,item.city,item.country]
              .filter(Boolean)
              .join(' / ')}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.viewButton,
              {backgroundColor:BaseColor.pinkDarkColor},
            ]}
            onPress={event=>{
              event.stopPropagation();
              onDelete(item);
            }}
          >
            <Icon
              name="trash"
              size={14}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View
            style={[
              styles.viewButton,
              {backgroundColor:colors.primary+'14'},
            ]}
          >
            <Icon
              name="angle-right"
              size={14}
              color={colors.primary}
              enableRTL={true}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

AddressList.propTypes={
  onSelect:PropTypes.func,
  onDelete:PropTypes.func,
  style:PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  item:PropTypes.object,
};

export default AddressList;
