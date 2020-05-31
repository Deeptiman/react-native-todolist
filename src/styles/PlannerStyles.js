import {StyleSheet, Dimensions} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17
    },
    emptyItem: {
      backgroundColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      borderRadius: 5,
      padding: 10,
    },  
    emptyItemMsg: {
      width: 300,
      height: 150,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      padding: 10,
    },
    emptyItemTxt: {
      fontSize: 20,
      fontWeight: "bold",
      color: '#000000',
      padding: 5,
    },
    emptyItemIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      height: 60,
    },
    plannerTimeStyle: {
      fontSize: 17,
      fontWeight: "bold",
      color: '#000000',
      padding: 5,
    },
    plannerTitleStyle: {
      fontSize: 15,
      color: '#000000',
      padding: 5,
    },
    plannerDescStyle: {
      fontSize: 14,
      color: '#333',
      padding: 5,
    },
    emptyDate: {
      height: 15,
      flex:1,
      paddingTop: 30
    }
  });
  