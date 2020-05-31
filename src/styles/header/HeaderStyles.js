import {StyleSheet, Dimensions, Platform} from 'react-native';

export default StyleSheet.create({
    container: {
      width: '100%',
      height: Platform.OS === 'android' ? '8%' : '9%',
      justifyContent: Platform.OS === 'android' ? 'center' : 'flex-end'
    },
    create_planner_container: {
      width: '100%',
      height: Platform.OS === 'android' ? '8%' : '15%',
      justifyContent: 'center'
    },
    menuBtn: {
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
        fontFamily:'Roboto-Medium',
        fontSize: 18,
        marginLeft: 20
    },
    seach_planner_btn_mview: {
      width:  60,
      height: 30,
      justifyContent: 'center',
      alignContent: "flex-end",
      alignSelf: 'flex-end',
      borderRadius: 5
    },
    setup_btn_mview: {
      width:  200,
      height: 30,
      marginLeft: 100,
      marginTop: 100,
      justifyContent: 'center',
      alignContent: "flex-start",
      alignSelf: 'flex-start',
      borderRadius: 5
    },
    search_planner_view: {
      height: 0,
      marginRight: 10
    },
    search_planner_menuBtn: {
      width: 25,
      height: 25,
      marginLeft: 10
    },
    search_planner_label_view: {
      width: '100%',
      marginLeft: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    subject_label: {
      fontFamily:'Roboto-Bold',
      fontSize: 18,
      marginTop: 10,
      marginLeft: 20
    },
    subject_text: {
      fontFamily:'Roboto-Medium',
      fontSize: 15,
      marginTop: 5,
      marginLeft: 20
    },
    date_time_label: {
      fontFamily:'Roboto-Bold',
      fontSize: 18,
      marginTop: 10,
      marginLeft: 20
    },
    date_time_text: {
      fontFamily:'Roboto-Medium',
      fontSize: 15,
      marginTop: 5,
      marginLeft: 20
    },
    description_label: {
      fontFamily:'Roboto-Bold',
      fontSize: 18,
      marginTop: 10,
      marginLeft: 20
    },
    description_text: {
      fontFamily:'Roboto-Medium',
      fontSize: 15,
      padding: 20,
      marginTop: 5,
      marginLeft: 50
    }

});