import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: Platform.OS === 'android' ? '8%' : '9%',
    justifyContent: Platform.OS === 'android' ? 'center' : 'flex-end'
  },
  menuBtn: {
    width: 25,
    height: 25,
    marginLeft: 10
  },
  shareMenuBtn: {
    width: 25,
    height: 25,
    marginLeft: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  editMenuBtn: {
    width: 25,
    height: 25,
    marginLeft: 10
  },
  header_container: {
    width: '100%',
    height: '35%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  app_icon_view: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderColor: '#5E5E5F',
    borderWidth: 1
  },
  app_label_view: {
    width: '100%',
    height: '5%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  app_label: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    color: '#000'
  },
  attachments_icon_view: {
    width: '8%',
    height: 20,
    marginTop: 2
  },
  attachments_icon: {
    width: 20,
    height: 20,
    borderRadius: 150 / 2,
  },
  attachments_name_view: {
    height: 20,
    marginLeft: 10,
  },
  attachments_name: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    color: '#000000',
    marginLeft: 5,
    marginTop: 1,
  },
  logout_btn_signout_container: {
    width: '80%',
    height: '10%',
    marginTop: 20,
    marginLeft: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout_btn_signout_view: {
    width: '80%',
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#000'
  },
  logout_btn_label_view: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout_btn_signout_label: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#FFF'
  },
  icon_style_logo: {
    width: 100,
    height: 100
  },
  header_label: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginLeft: 20
  },
  subject_label: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 20
  },
  subject_view: {
    marginTop: 30,
    marginLeft: 30
  },
  subject_icon: {
    width: 25,
    height: 25,
    marginTop: 5
  },
  subject_text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 22,
    marginLeft: 10
  },
  date_time_view: {
    marginTop: 25,
    marginLeft: 30
  },
  date_time_label: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 20
  },
  date_time_text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20
  },
  reminder_view: {
    marginTop: 25,
    marginLeft: 30
  },
  color_view: {
    marginTop: 25,
    marginLeft: 30
  },
  reminder_icon_view: {
    width: 25,
    height: 25,
    marginTop: 5
  },
  reminder_text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20
  },
  color_text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20
  },  
  location_view: {
    marginTop: 25,
    marginLeft: 30
  },
  location_text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20
  },
  conference_view: {
    marginTop: 25,
    marginLeft: 30
  },
  conference_icon_view: {
    width: 25,
    height: 25,
  },
  conference_text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20,
    color: '#3A3AED'
  },
  conference_video_label: {
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 20,
  },
  organizer_view: {
    marginTop: 25,
    marginLeft: 30
  },
  organizer_icon_view: {
    width: 25,
    height: 25,
    marginTop: 5
  },
  organizer_label: {
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 20
  },
  organizer_text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20
  },
  attendes_view: {
    marginTop: 25,
    marginLeft: 30
  },
  attendes_icon_view: {
    width: 25,
    height: 25,
  },
  meet_response_icon_view: {
    width: 15,
    height: 15,
    marginTop: 10,
    marginLeft: 20
  },
  attendes_label: {
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 20
  },
  attendes_text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20
  },
  description_view: {
    marginTop: 25,
    marginLeft: 30
  },
  description_icon_view: {
    width: 25,
    height: 25,
  },
  description_label: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 20
  },
  description_text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    marginLeft: 20,
    marginRight: 10,
    marginBottom: 20,

  }
});