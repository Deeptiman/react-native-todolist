import {StyleSheet, Dimensions} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    plannerContainer: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: 30
    },
    datePickerIcon: {
      width: 50,
      height: 50,
      alignItems: 'flex-start'
    },
    datePickerText: {
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      marginTop: 13,
      marginLeft: 15
    },
    addTitleInput: {
      width: 320,
      backgroundColor: '#eeeeee', 
      borderRadius: 2,
      paddingHorizontal: 16,
      fontSize: 14,
      color: '#002f6c',
      marginVertical: 10
    },
    addDescriptionInput: {
      width: 300,
      height: 100,
      backgroundColor: '#eeeeee', 
      borderRadius: 2,
      paddingHorizontal: 16,
      justifyContent: 'flex-start',
      fontSize: 16,
      color: '#002f6c',
      marginVertical: 10
    },    
    descContainer: {
      width: 320,
      marginTop: 5     
    },
    textareaContainer: {
      height: 180,
      padding: 5,
      backgroundColor: '#eeeeee',
      paddingHorizontal: 16,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    textarea: {
      textAlignVertical: 'top',  
      height: 170,
      fontSize: 14,
      color: '#333',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    button: {
        width: 320,
        backgroundColor: '#4f83cc',
        borderRadius: 5,
        marginVertical: 10,
        paddingVertical: 12
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    }
});