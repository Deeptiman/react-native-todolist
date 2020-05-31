import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '85%',
    backgroundColor: '#fff'
  },
  setup_container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  parent_setup_container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },  
  announcement_container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  announcement_details_container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  planner_container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
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
  sync_header_container: {
    width: '100%',
    height: '35%',
    marginTop: 30,
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
  sync_icon_view: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderColor: '#5E5E5F',
    borderWidth: 0
  },
  app_label_view: {
    width: '100%',
    height: '5%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sync_label_view: {
    width: '100%',
    height: '5%',
    marginTop: 15,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  search_planner_view: {
    width: '100%',
    height: '100%',
  },
  announcement_view: {
    width: '100%',
    height: '100%',
  },
  search_planner_input_container: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
  },
  announcement_input_container: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
  },
  search_input_card_view: {
    width: '100%',
    height: '10%',
    padding: 10,
    alignItems: 'center',
  },

  announcement_input_card_view: {
    width: '100%',
    height: '10%',
    padding: 10,
    alignItems: 'center',
  },

  search_card_container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
  },
  announcement_card_container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
  },
  search_planner_icon_view: {
    width: '40%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search_planner_icon: {
    width: 25,
    height: 25,
  },
  search_planner_back_icon: {
    width: 25,
    height: 25,
    marginTop: 8,
    marginLeft: 20
  },
  announcement_ripple_back_icon: {
    width: 25,
    height: 25,
  },
  announcement_back_icon: {
    width: 25,
    height: 25,
    marginTop: 5,
    marginLeft: 20
  },
  search_text_input_view: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },
  announcement_input_view: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },
  search_planner_text_input: {
    fontSize: 15,
    color: '#000000',
    paddingRight: 10,
  },
  announcement_text_input: {
    fontSize: 15,
    color: '#000000',
    paddingRight: 10,
  },
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
    fontSize: 14,
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
  empty_view: {
    backgroundColor: '#f2f2f2',
    width: '100%',
    height: '0%',
    marginTop: 20,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  search_planner_no_result_label: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  announcement_no_result_label: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
  },
  search_planner_list_view: {
    flex: 1,
  },
  search_planner_list: {
    marginTop: 0,
    marginBottom: 50
  },
  announcement_list_view: {
    flex: 1,
  },
  announcement_list: {
    marginTop: 0,
    marginBottom: 50
  },
  search_planner_header_container: {
    width: '100%',
    height: Platform.OS === 'android' ? '8%' : '9%',
    justifyContent: Platform.OS === 'android' ? 'center' : 'flex-end',
    alignSelf: 'flex-start'
  },
  announcement_header_container: {
    width: '100%',
    height: Platform.OS === 'android' ? '8%' : '9%',
    justifyContent: Platform.OS === 'android' ? 'center' : 'flex-end',
    alignSelf: 'flex-start'
  },
  event_card_container: {
    width: '90%',
    height: 100,
    margin: 10
  },
  search_planner_header_label: {
    fontSize: 18,
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  search_planner_icon_view: {
    width: 40,
    height: 40,
    marginTop: 15,
    marginLeft: 10
  },
  announcement_icon_view: {
    width: 40,
    height: 40,
    marginTop: 15,
    marginLeft: 10
  },
  search_planner_event_icon_view: {
    width: 40,
    height: 40,
    marginTop: 10,
    marginLeft: 10
  },
  search_planner_list_container: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    borderRadius: 80,
  },
  announcement_list_container: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    borderRadius: 80,
    margin: 10
  },
  image_style_logo : {
    width: 100,
    height: 100
  },
  search_planner_list_item_container: {
    width: '100%',
    height: 'auto',
    marginLeft: 10,
  },
  search_planner_subject_view: {
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center',
  },
  search_planner_subject_txt: {
    fontSize: 14,
    color: '#fff',
  },
  search_planner_start_date_view: {
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'flex-start',
  },
  search_planner_attendee_view: {
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'flex-start',
  },
  search_planner_start_date_txt: {
    fontSize: 12,
    color: '#fff',
  },
  announcement_header_label: {
    fontSize: 18,
    marginTop: 5,
    alignSelf: 'flex-start'
  }, 
  annoucement_list_container: {
    width: '100%',
    height: 200,
    flexDirection: 'row',
    borderRadius: 80,
  },
  announcement_list_item_container: {
    width: '100%',
    height: 'auto',
    marginLeft: 10,
    marginRight: 20,
  },
  announcement_title_view: {
    height: 40,
    marginLeft: 5,
    marginRight: 25,
    justifyContent: 'center',
  },
  announcement_title_txt: {
    fontSize: 16,
    color: '#000',
  },
  announcement_small_text_view: {
    marginLeft: 5,
    marginRight: 30,
    margin: 25,
    justifyContent: 'flex-start',
  },
  announcement_detail_text_view: {
    marginLeft: 5,
    marginRight: 25,
    marginTop: 10,
    justifyContent: 'flex-start',
  },
  announcement_image_view: {    
    marginLeft: 0,
    marginTop: 10,
    marginRight: 40,
    justifyContent: 'center',
  },

  announcement_topic_view: {
    width:  'auto',
    height: 35,
    justifyContent: 'center',   
  },
  announcement_topic_label_view: {
    width:  120,
    height: 35,
    alignItems: 'center',
    alignContent: "flex-end",
    alignSelf: 'flex-end',
    borderRadius: 5,
    backgroundColor: '#000',
    marginLeft: 5,
    padding: 0,
    marginRight: 30,
  },
  topic_choose_view: {
    width:  100,
    height: 35,
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 30,
  },
  topic_menuBtn: {
    width: 25,
    height: 25,
    marginLeft: 10,
    marginTop: 5
  },
  announcement_topic_txt: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5
  },
  search_planner_attendee_view: {
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'flex-start',
  },
  announcement_small_text_txt: {
    fontSize: 14,
    color: '#000',
  },

  announcement_time_txt: {
    fontSize: 12,
    color: '#000',
    marginTop: 10
  },

  section_start_date_txt: {
    fontSize: 18,
    color: '#fff',
  },
  section_start_month_txt: {
    fontSize: 14,
    color: '#000',
  },
  section_event_date_view: {
    marginTop: 15,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C2283',
    height: 40,
    width: 40,
    borderRadius: 1000,
  },
  section_event_month_view: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  app_label: {
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
    fontSize: 16,
    color: '#FFF'
  },
  icon_style_logo: {
    width: '100%',
    height: 200,
  },
  sync_icon_style_logo: {
    width: 120,
    height: 100
  },
  header_label: {
    fontSize: 20,
    marginLeft: 20
  },
  subject_label: {
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
  announcement_icon: {
    width: 25,
    height: 25,
    marginTop: 0
  },
  subject_text: {
    fontSize: 22,
    marginLeft: 10
  },
  date_time_view: {
    marginTop: 25,
    marginLeft: 30
  },
  date_time_label: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 20
  },
  date_time_text: {
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20
  },
  reminder_view: {
    marginTop: 25,
    marginLeft: 30
  },
  reminder_icon_view: {
    width: 25,
    height: 25,
    marginTop: 5
  },
  reminder_text: {
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20
  },
  location_view: {
    marginTop: 25,
    marginLeft: 30
  },
  location_text: {
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
    fontSize: 15,
    marginTop: 5,
    marginLeft: 20,
    color: '#3A3AED'
  },
  conference_video_label: {
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
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 20
  },
  organizer_text: {
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
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 20
  },
  attendes_text: {
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
    fontSize: 18,
    marginTop: 10,
    marginLeft: 20
  },
  description_text: {
    fontSize: 15,
    marginLeft: 20,
    marginRight: 10,
    marginBottom: 20,

  }
});