import {Platform,StyleSheet} from 'react-native';

export default StyleSheet.create({
  card:{
    width:'100%',
    borderWidth:1,
    borderRadius:14,
    padding:16,

    ...Platform.select({
      ios:{
        shadowColor:'#000',
        shadowOpacity:0.03,
        shadowRadius:8,
        shadowOffset:{width:0,height:3},
      },
      android:{
        elevation:1,
      },
    }),
  },

  cardTop:{
    flexDirection:'row',
    alignItems:'flex-start',
  },

  cardContent:{
    flex:1,
    paddingRight:10,
  },

  title:{
    fontSize:15,
    lineHeight:21,
    fontWeight:'800',
  },

  badges:{
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop:10,
  },

  badge:{
    minHeight:26,
    borderRadius:7,
    justifyContent:'center',
    paddingHorizontal:9,
    paddingVertical:4,
    marginRight:6,
    marginBottom:6,
  },

  outlineBadge:{
    borderWidth:1,
  },

  badgeText:{
    fontSize:11,
    lineHeight:15,
    fontWeight:'700',
  },

  address:{
    fontSize:13,
    lineHeight:19,
    marginTop:7,
  },

  location:{
    fontSize:12.5,
    lineHeight:18,
    fontWeight:'700',
    marginTop:5,
  },

  viewButton:{
    width:34,
    height:34,
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center',
  },
});
