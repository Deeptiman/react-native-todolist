import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  message_text_input: {
    height: 180,
    fontSize: 15,
    color: '#000000',
    paddingRight: 10,
    alignSelf: 'flex-start'
  },
  message_input_container: {
    width: '100%',
    height: '80%',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  message_input_card_view: {
    width: '100%',
    height: '50%',
    padding: 10,
    alignItems: 'center',
  },
  message_send_chat_view: {
    width: '100%',
    height: 'auto',
  },
  composer: {
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: '#dddddd',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    fontSize: 16
  },
  message_textInputView: {
    width: '85%',
    height: 'auto',
    backgroundColor: '#fff',
    fontSize: 16,
    marginRight: 0,
    paddingLeft: 20,
    paddingRight: 10,
    lineHeight: 20,
    textAlignVertical: 'top'
  },
  sendContainer: {
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 5,
  },
  message_card_container: {
    width: '100%',
    height: 350,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  message_input_view: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignSelf: 'flex-start'
  },
  message_text_input: {
    fontSize: 15,
    color: '#000000',
    paddingRight: 10,
    alignSelf: 'flex-start'
  },
});