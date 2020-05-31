import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
    },
    phone_number_container: {
        width: '100%',
        height: '8%',
        justifyContent: 'center',
    },
    header_container: {
        width: '100%',
        height: '25%',
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
        borderWidth: 0
    },
    icon_style_logo: {
        width: 100,
        height: 100
    },
    app_label_view: {
        width: '100%',
        height: '5%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    app_label: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        color: '#000'
    },
    sign_in_inst_view: {
        width: '100%',
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sign_in_inst_label: {
        fontFamily: 'Roboto-Light',
        fontSize: 15,
        color: '#000'
    },
    signin_email_container: {
        marginTop: 20,
    },
    add_phone_number_container: {
        marginTop: 20,
    },
    login_text_input_view: {
        width:"80%",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        height:50,
        marginTop: 10,
        marginLeft: 50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    login_text_input: {
        height:50,
        color:"black"
    },  
    login_btn_container: {
        width: '80%',
        height: '10%',
        marginLeft: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    email_btn_container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    phone_number_btn_container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    google_btn_container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    microsoft_btn_container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    facebook_btn_container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    login_google_btn_container: {
        width: '90%',
        height: '10%',
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    login_microsoft_btn_container: {
        width: '100%',
        height: '10%',
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    login_fabcebook_btn_container: {
        width: '100%',
        height: '7%',
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    login_btn_signin_container: {
        width: 220,
        height: 50,
        marginTop: 10,
        marginLeft: 50,
        alignItems: 'center',
    },
    login_btn_signup_view: {
        width: 220,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#000'
    },
    login_btn_signup_container: {
        width: '80%',
        height: '10%',
        marginTop: 20,
        marginLeft: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },    
    login_btn_view: {
        width: '100%',
        height: 55,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: '#FFF'
    },
    google_login_btn_mview: {
        width: 220,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#0072c6'
    },
    microsoft_login_btn_mview: {
        width: 220,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#0072c6'
    },
    facebook_login_btn_mview: {
        width: 220,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#3b5998'
    },
    email_login_btn_signin_view: {
        width: 220,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#000'
    },
    phone_number_btn_view: {
        width: 220,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#000'
    },
    email_login_btn_signup_view: {
        width: 220,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#000'
    },
    login_btn_icon_view: {
        width: '20%',
        marginLeft: 10,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    login_btn_icon: {
        width: 30,
        height: 30
    },
    login_btn_micon: {
        width: 20,
        height: 20
    },
    login_btn_label_view: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    login_social_btn_label_view: {
        width: '100%',
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    login_btn_label: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        color: '#000'
    },
    login_btn_mlabel: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        color: '#FFF',
        marginLeft: 20
    },
    login_btn_signin_label: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        color: '#FFF'
    },
    skip_btn_label: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        color: '#000'
    },
    or_container: {
        width: '100%',
        height: '5%',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    or_signin_container: {
        width: '100%',
        height: '5%',
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    or_social_container: {
        width: '100%',
        marginTop: 30,
        alignItems: 'center',
    },
    or_label: {
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        color: '#000'
    },
    or_social_label: {
        fontFamily: 'Roboto-Bold',
        fontSize: 13,
        color: '#090983'
    }
});