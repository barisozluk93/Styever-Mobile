import {Linking,TouchableOpacity,View} from 'react-native';
import {useTheme} from '@/config';
import {useTranslation} from 'react-i18next';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import styles from './styles';

const SOCIAL_LINKS={
  instagram:'https://www.instagram.com/sty.ever',
  linkedin:'https://www.linkedin.com/company/styever/',
  tiktok:'https://www.tiktok.com/@styever',
};

const SiteFooter=({style})=>{
  const {colors}=useTheme();
  const {t}=useTranslation();
  const currentYear=new Date().getFullYear();
  const openLink=url=>Linking.openURL(url).catch(()=>{});
  return(
    <View style={[styles.container,{backgroundColor:colors.primary},style]}>
      <Text style={styles.copyright}>© {currentYear} Styever — {t('all_rights_reserved')}</Text>
      <View style={styles.socials}>
        <TouchableOpacity activeOpacity={0.8} style={styles.socialButton} onPress={()=>openLink(SOCIAL_LINKS.instagram)}>
          <Icon name="instagram" size={17} color="#FFFFFF"/>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.socialButton} onPress={()=>openLink(SOCIAL_LINKS.linkedin)}>
          <Icon name="linkedin-in" size={17} color="#FFFFFF"/>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.socialButton} onPress={()=>openLink(SOCIAL_LINKS.tiktok)}>
          <Icon name="tiktok" size={17} color="#FFFFFF"/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SiteFooter;
