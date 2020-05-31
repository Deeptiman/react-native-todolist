import React, { Component } from 'react';
import { View, Text, Alert, TouchableOpacity, ToastAndroid, Image, Platform } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import messaging from '@react-native-firebase/messaging';
import CardView from 'react-native-cardview';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import styles from '../../styles/calendar/CalendarStyles';
import headerStyles from '../../styles/header/HeaderStyles';
import AuthRealmServices from '../../Realm/AuthRealm';
import PlannerServices from '../../Realm/PlannerRealm';
import AnnouncementRealmServices from '../../Realm/AnnouncementRealm';
import SyncCalendarDialog from './SyncCalendarDialog';
import { connect } from 'react-redux';
import { fetchPlanners, fetchGooglePlanner, fetchAnnouncement, fetchStudentsList, saveMicrosoftPlanner } from '../../actions';
import { AnnouncementHelper } from '../../actions/AnnouncementHelper';

import {Utils} from '../utils/Utils';

class CalendarComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: Utils.currentUser(),
      plannerList: '',
      syncDone: false,
      syncDialogVisible: false,
    }

    this.closeSyncDialog = this.closeSyncDialog.bind(this)
  }

  messageListener = async () => {

    const notificationOpen = await messaging().getInitialNotification();
    if (notificationOpen) {

      console.log("fetchAnnouncement : onNotificationOpened >>>> "+notificationOpen.notification.notificationId)

      //await firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId)

      AnnouncementHelper.processNotification(notificationOpen.notification.data)
        .then(async(announcement) => {

          console.log("onNotificationOpened: processNotification >> " + JSON.stringify(announcement))
          console.log("messageListener : getInitialNotification")
          //this.showAlert(announcement.title, announcement.body); 

          var realmAnnouncement = AnnouncementRealmServices.findByTime(announcement.time)

          if (realmAnnouncement.length === 0) {
            AnnouncementRealmServices.save(announcement)
            this.props.navigation.navigate(Utils.SHOW_ANNOUNCEMENT_DETAIL_SCREEN, { name: Utils.SHOW_ANNOUNCEMENT_DETAIL_SCREEN, key: announcement })
            console.log("removeAllDeliveredNotifications...")
           // await messaging().notifications().removeAllDeliveredNotifications();
          }
        })
    }
  }

  checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  }

  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("Your Firebase Token is - " + fcmToken);
      //this.showAlert("Your Firebase Token is:", fcmToken);
    } else {
      console.log("Failed", "No token received");
      this.showAlert("Failed", "No token received");
    }
  }


  requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
      console.log("User has authorised")
    } catch (error) {
      // User has rejected permissions
      console.log("User has rejected permissions - " + JSON.stringify(error))
    }
  }

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false },
    );
  }

  async componentDidMount() {
    console.log("componentDidMount....");

    if(Platform.OS === 'android') {
      this.checkPermission();
      this.messageListener();
      //this.props.fetchAnnouncement();
    }
    this.props.fetchPlanners(true)
  }

  componentDidUpdate(previousProps, previousState) {
    var parsePrevProgress = 0;
    var parseCurrentProgress = 0;

    if (this.state.user.loginType === Utils.MICROSOFT_LOGIN_TYPE) {
      parsePrevProgress = JSON.parse(JSON.stringify(previousProps.microsoftPlannerList)).microsoftPlannerList
      parseCurrentProgress = JSON.parse(JSON.stringify(this.props.microsoftPlannerList)).microsoftPlannerList
    } else if (this.state.user.loginType === Utils.GOOGLE_LOGIN_TYPE) {
      parsePrevProgress = JSON.parse(JSON.stringify(previousProps.googlePlannerList)).googlePlannerList
      parseCurrentProgress = JSON.parse(JSON.stringify(this.props.googlePlannerList)).googlePlannerList
    } else if (Utils.nonSocialLogin(this.state.user.loginType)) {
      parsePrevProgress = JSON.parse(JSON.stringify(previousProps.firebasePlannerList)).firebasePlannerList
      parseCurrentProgress = JSON.parse(JSON.stringify(this.props.firebasePlannerList)).firebasePlannerList
    }

    if ((parsePrevProgress.parseId !== parseCurrentProgress.parseId)) {

      var currentProgress = parseCurrentProgress.parseId
      var total = parseCurrentProgress.totalPlanners - 1
      if ((currentProgress === total) || total === -1) {
        this.setState({ syncDone: true })
      }
    }
  }

  checkPlannerByDate(date) {

    var planners = PlannerServices.findAllByStartDate(date)

    if (planners.length > 1) {
      this.props.navigation.navigate(Utils.PLANNER_LIST_SCREEN, { key: date })
    } else {
      var result = JSON.parse(JSON.stringify(planners));
      this.props.navigation.navigate(Utils.SHOW_EVENT_SCREEN, { name: Utils.SHOW_EVENT_SCREEN, key: result[0], flag: 0 })
    }
  }

  closeSyncDialog(visible) {
    if (!visible) {
      ToastAndroid.showWithGravityAndOffset(Utils.SYNC_CALENDAR_MSG,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25, 200);
    }
    this.setState({
      syncDone: false,
      syncDialogVisible: visible
    })

  }


  render() {

    var planner = JSON.parse(JSON.stringify(this.props.plannerList)).plannerList;
    var agenda = planner == null ? undefined : planner;

    return (
      <View style={styles.container}>
        <CardView
          style={headerStyles.container}
          cardElevation={2}
          cardMaxElevation={2}>
          <Row size={12}>
            <Col sm={3} md={4} lg={3}>
              <Text style={headerStyles.header_label}>Calendar</Text>
            </Col>
            <Col sm={7}>
              <View style={headerStyles.search_planner_view}>
                <TouchableOpacity
                  style={headerStyles.seach_planner_btn_mview}
                  onPress={() => this.closeSyncDialog(true)}>
                  <Image
                    style={headerStyles.search_planner_menuBtn}
                    source={require('../../../assets/icons/sync.png')}
                  />
                </TouchableOpacity>
              </View>
            </Col>
            <Col sm={2}>
              <View style={headerStyles.search_planner_view}>
                <TouchableOpacity
                  style={headerStyles.seach_planner_btn_mview}
                  onPress={() => this.props.navigation.navigate(Utils.PLANNER_LIST_SCREEN, { key: Utils.ALL_PLANNERS })}>
                  <Image
                    style={headerStyles.search_planner_menuBtn}
                    source={require('../../../assets/icons/ic_search.png')}
                  />
                </TouchableOpacity>
              </View>
            </Col>
          </Row>
          <SyncCalendarDialog
            syncDialogVisible={this.state.syncDialogVisible}
            syncDone={this.state.syncDone}
            closeSyncDialog={this.closeSyncDialog}
          />
        </CardView>
        <View style={styles.calendar_view}>
          <CalendarList
            markedDates={agenda}
            minDate={Utils.APP_MIN_CALENDAR_DATE}
            onDayPress={(days) => { agenda && agenda[days.dateString] && this.checkPlannerByDate(days.dateString) }}
            pastScrollRange={50}
            futureScrollRange={50}
            scrollEnabled={true}
            showScrollIndicator={false}
            markingType={'multi-dot'}
            multiDotLimit={{ limit: 3, type: 'number' }}
          />
        </View>
      </View>
    );
  }
}

const dispatchProps = dispatch => ({
  fetchPlanners: (type) => dispatch(fetchPlanners(type)),
  fetchAnnouncement: () => dispatch(fetchAnnouncement()),
  fetchMicrosoftPlanner: (planner) => dispatch(fetchMicrosoftPlanner(planner)),
  fetchGooglePlanner: (planner) => dispatch(fetchGooglePlanner(planner)),
  fetchFirebasePlanner: (planner) => dispatch(fetchFirebasePlanner(planner)),
  fetchStudentsList: (studentsList) => dispatch(fetchStudentsList(studentsList)),
});

const stateProps = state => ({
  plannerList: state.plannerList,
  eventsList: state.eventsList,
  appLoginPayload: state.appLoginPayload,
  microsoftPlannerList: state.microsoftPlannerList,
  firebasePlannerList: state.firebasePlannerList,
  googlePlannerList: state.googlePlannerList,
  studentsList: state.studentsList
});

export default connect(stateProps, dispatchProps)(CalendarComponent);