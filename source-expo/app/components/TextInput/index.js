import {cloneElement,forwardRef} from 'react';
import PropTypes from 'prop-types';
import {I18nManager,TextInput,View} from 'react-native';
import {BaseColor,BaseStyle,useFont,useTheme} from '@/config';
import Icon from '@/components/Icon';

const INPUT_BORDER_COLOR='#D8DFEA';
const INPUT_BACKGROUND_COLOR='#FFFFFF';
const INPUT_ICON_COLOR='#A8B2CA';

const Index=forwardRef((props,ref)=>{
  const font=useFont();
  const {colors}=useTheme();

  const {
    style={},
    onChangeText=()=>{},
    onFocus=()=>{},
    placeholder='Placeholder',
    value='',
    success=true,
    secureTextEntry=false,
    keyboardType='default',
    multiline=false,
    textAlignVertical='center',
    icon=null,
    iconLeft=null,
    onSubmitEditing=()=>{},
    inputStyle={},
    ...attrs
  }=props;

  const defaultIconName=secureTextEntry
    ?'lock'
    :keyboardType==='email-address'
      ?'envelope'
      :(
        keyboardType==='phone-pad'||
        keyboardType==='phone'
      )
        ?'mobile-screen-button'
        :multiline
          ?'pen-to-square'
          :'pen';

  const normalizedLeftIcon=iconLeft
    ?cloneElement(
      iconLeft,
      {
        color:INPUT_ICON_COLOR,
        size:iconLeft.props?.size||18,
        style:[
          iconLeft.props?.style,
          {
            width:22,
            marginRight:12,
          },
        ],
      },
    )
    :(
      <Icon
        name={defaultIconName}
        size={18}
        color={INPUT_ICON_COLOR}
        style={{
          width:22,
          marginRight:12,
        }}
      />
    );

  return(
    <View
      style={[
        BaseStyle.textInput,
        style,
        {
          backgroundColor:INPUT_BACKGROUND_COLOR,
          borderColor:INPUT_BORDER_COLOR,
          borderWidth:1,
          borderRadius:12,
          paddingHorizontal:16,
          minHeight:56,
        },
      ]}
    >
      {normalizedLeftIcon}

      <TextInput
        ref={ref}
        style={[
          {
            fontFamily:`${font}-Regular`,
            flex:1,
            height:'100%',
            textAlign:I18nManager.isRTL?'right':'auto',
            color:colors.text,
            paddingTop:5,
            paddingBottom:5,
            fontSize:15,
          },
          inputStyle,
        ]}
        onChangeText={text=>onChangeText(text)}
        onFocus={()=>onFocus()}
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={
          success
            ?BaseColor.grayColor
            :colors.primary
        }
        secureTextEntry={secureTextEntry}
        value={value}
        selectionColor={colors.primary}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={textAlignVertical}
        onSubmitEditing={onSubmitEditing}
        {...attrs}
      />

      {icon}
    </View>
  );
});

Index.propTypes={
  style:PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  onChangeText:PropTypes.func,
  onFocus:PropTypes.func,
  placeholder:PropTypes.string,
  value:PropTypes.string,
  success:PropTypes.bool,
  secureTextEntry:PropTypes.bool,
  keyboardType:PropTypes.string,
  multiline:PropTypes.bool,
  textAlignVertical:PropTypes.string,
  icon:PropTypes.node,
  iconLeft:PropTypes.node,
  onSubmitEditing:PropTypes.func,
  inputStyle:PropTypes.object,
};

export default Index;
