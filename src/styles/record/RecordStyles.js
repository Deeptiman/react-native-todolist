import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    record_view: {
        width: '100%',
        height: '100%',
    },

    record_audio_input_container: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    record_audio_input_card_view: {
        width: '100%',
        height: '10%',
        padding: 10,
        alignItems: 'center',
    },
    record_audio_card_container: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#F5F4F4',
    },
    record_audio_icon_view: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    record_audio_search_icon: {
        width: 25,
        height: 25,
        marginLeft: 20,
        alignSelf: 'flex-start'
    },
    record_audio_input_view: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    record_audio_text_input: {
        fontSize: 15,
        color: '#000000',
        paddingRight: 10,
    },
    record_audio_no_result_label: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#000000',
    },
    record_audio_list_view: {
        padding: 10,
        marginTop: 2,
    },
    record_audio_list: {
        marginTop: 0,
        marginBottom: 50
    },
    record_audio_list_icon_view: {
        width: 40,
        height: 40,
        marginTop: 10,
        marginLeft: 10
    },
    record_audio_list_item_container: {
        width: '100%',
        height: 80,
        marginLeft: 10,
    },
    record_audio_subject_view: {
        height: 40,
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',
    },
    record_audio_subject_txt: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#000000',
    },
    record_audio_start_date_view: {
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'flex-start',
    },
    record_audio_start_date_txt: {
        fontSize: 12,
        color: '#7C7C7C',
    },
    record_audio_icon: {
        width: 30,
        height: 30,
        marginTop: 2,
        marginLeft: 15
    },
    record_dialog: {
        height: 'auto',
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    record_dialog_view: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#fff'
    },
    record_audio_title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',
    },
    record_image_view: {
        padding: 10,
    },
    record_timer_view: {
        padding: 10,
    },
    record_audio_image_view: {
        width: 80,
        height: 80,
        marginTop: 10,
        justifyContent: 'center',
        alignContent: "center",
        alignSelf: 'center',
    },
    record_audio_timer_view: {
        width: 150,
        height: 50,
        marginLeft: 70,
        marginTop: 10,
        fontSize: 30,
        color: '#000000',
        justifyContent: 'center',
        alignContent: "center",
        alignSelf: 'center',
    },
    record_audio_save_view: {
        width: '100%',
        height: 80,
        justifyContent: 'center',
    },
    record_file_name_input: {
        width: '100%',
        fontSize: 15,
        color: '#000000',
        paddingRight: 10,
        marginLeft: 20,
    },
    record_file_name_card_container: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#F5F4F4',
    },
    record_audio_footer_view: {
        height: 100
    },
    record_audio_cancel_footer_view: {
        height: 100
    },
    record_audio_btn_mview: {
        width: 180,
        height: 45,
        marginTop: 20,
        justifyContent: 'center',
        alignContent: "center",
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: '#000'
    },
    record_audio_stop_btn_mview: {
        width: 180,
        height: 45,
        marginTop: 20,
        justifyContent: 'center',
        alignContent: "center",
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: '#4E4E4E'
    },
    record_audio_cancel_btn_mview: {
        width: 180,
        height: 45,
        marginTop: 5,
        justifyContent: 'center',
        alignContent: "center",
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: '#E10407'
    },
    record_audio_btn_label_view: {
        width: '100%',
        marginLeft: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    record_audio_btn_label: {
        fontSize: 16,
        color: '#FFF'
    },
});