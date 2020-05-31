import React, { Component } from 'react';
import { View, Text, FlatList, Alert, Image, Linking, ToastAndroid, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import CardView from 'react-native-cardview';
import DatePicker from 'react-native-datepicker';
import database from '@react-native-firebase/database';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import ProgressLoader from 'rn-progress-loader';
import moment from 'moment';
import { connect } from 'react-redux';
import styles from '../../styles/createplanner/CreatePlannerStyles';
import headerStyles from '../../styles/header/HeaderStyles';
import CheckBox from 'react-native-check-box';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import AddPeopleComponent from './AddPeopleComponent';
import AddNotificationComponent from './AddNotificationComponent';
import AddColorComponent from './AddColorComponent';
import CreatePlannerDialog from './CreatePlannerDialog';
import { createFirebasePlanner, createGooglePlanner, createMicrosoftPlanner } from '../../actions';
import { Utils } from '../utils/Utils';

var attachments = []
var attachmentUploadedObjs = []

class CreatePlannerComponent extends Component {
  constructor(props) {
    super(props)

    var result = Utils.currentUser()
    console.log(" Initial Date --- " + JSON.stringify(new Date()))
    this.state = {
      user: result[0],
      plannerId: 0,
      loginType: '',
      socialLogin: false,
      subject: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      time: '',
      sample: '',
      attendees: [],
      total_invite_attendees: 0,
      notificationMethods: [],
      attachments: [],
      methodEmailType: '',
      methodNotifyType: '',
      visible: false,
      visiblePeopleModal: false,
      selected: null,
      studentsList: [],
      isConferenceEnabled: false,
      currentColor: '',

      currentUploadedFile: 0,
      attachmentUploadedObjs: [],
      totalAttachedFile: 0,
      createPlannerDialogVisible: false,
      next_function_call: '',
      progress_statement: '',
      postCalendarPayload: '',
      animateProgress: 0,
      totalProcess: 0,
      indeterminate: true,
      completedProcess: false,
      error_in_calendar: false,
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.updateCheck = this.updateCheck.bind(this)

    this.setNotifyTime = this.setNotifyTime.bind(this)
    this.setTimeIndex = this.setTimeIndex.bind(this)
    this.setMethodIndex = this.setMethodIndex.bind(this)
    this.addNotifications = this.addNotifications.bind(this)
    this.closeNotifications = this.closeNotifications.bind(this)

    this.closePeopleDialog = this.closePeopleDialog.bind(this)
    this.closeNotificationDialog = this.closeNotificationDialog.bind(this)
    this.chooseColor = this.chooseColor.bind(this)
    this.closeColorDialog = this.closeColorDialog.bind(this)
    this.closePlannerDialog = this.closePlannerDialog.bind(this)
    this.completed = this.completed.bind(this)
  }

  componentDidMount() {
    this.reset()
    this.fetchStudentsList()
  }

  componentDidUpdate(previousProps, previousState) {
    //console.log("componentDidUpdate --- " + JSON.stringify(previousProps))

    var previousPlanner = JSON.parse(JSON.stringify(previousProps.plannerCallback)).plannerCallback
    var currentPlanner = JSON.parse(JSON.stringify(this.props.plannerCallback)).plannerCallback

    if (previousPlanner && currentPlanner) {

      if (previousPlanner.fileNumber !== currentPlanner.fileNumber) {

        this.setState({
          //animateProgress: currentPlanner.fileNumber,
          totalProcess: currentPlanner.totalFiles,
          indeterminate: false
        })

        if (currentPlanner.fileNumber === currentPlanner.totalProcess) {

          this.setState({
            progress_statement: currentPlanner.error === true ? currentPlanner.progress_statements : 'Calendar created successfully',
            completedProcess: true,
            error_in_calendar: currentPlanner.error
          })
        }
      }
    }
  }

  animate() {
    let progress = 0;
    this.setState({
      animateProgress: progress
    });
    setTimeout(() => {
      this.setState({ indeterminate: false });
      setInterval(() => {
        if (this.state.completedProcess === false) {
          progress += Math.random() / 5;
          if (progress > 1) {
            progress = 1;
          }
        } else {
          progress = 1;
        }
        this.setState({
          animateProgress: progress
        });
      }, 500);
    }, 1500);
  }

  onSave = () => {

    if (this.state.subject.length < 3) {
      Alert.alert('Error', 'Minimum 5 characters to add Subject');
    } else if (this.state.startDate.length <= 0) {
      Alert.alert('Error', 'Choose start Date');
    } else if (this.state.startTime.length <= 0) {
      Alert.alert('Error', 'Choose start Time');
    } else if (this.state.endDate.length <= 0) {
      Alert.alert('Error', 'Choose end Date');
    } else if (this.state.endTime.length <= 0) {
      Alert.alert('Error', 'Choose end Time');
    } else if (new Date(this.state.startDate) > new Date(this.state.endDate)) {
      Alert.alert('Error', 'Start Date cannot be ahead of End Date');
    } else if (new Date(this.state.startDate) === new Date(this.state.endDate) &&
      moment(this.state.endTime, 'HH:mm').isBefore(moment(this.state.startTime, 'HH:mm'))) {
      Alert.alert('Error', 'Start Time cannot be ahead of End Time');
    } else if (this.state.description.length < 10) {
      Alert.alert('Error', 'Minimum 10 characters to add Description');
    } else {


      var result = Utils.currentUser();
      if (result[0] != undefined) {

        var subject = this.state.subject;
        var startDate = this.state.startDate;
        var startTime = this.state.startTime;
        var endDate = this.state.endDate;
        var endTime = this.state.endTime;
        var description = this.state.description;
        var studentsList = this.state.studentsList;
        var notificationMethods = this.state.notificationMethods;
        var isConferenceEnabled = this.state.isConferenceEnabled;
        var requestId = "89d8ds89sd89ds";
        var colorId;

        if (this.state.currentColor.value === undefined) {
          colorId = Utils.getDefaultColorCode(result[0].loginType)
        } else {
          colorId = this.state.currentColor.value
        }

        var attendees = [];
        studentsList.map((student, index) => {
          if (student.isChecked) {
            attendees.push({
              email: student.email
            })
          }
        })

        var reminders = [];
        notificationMethods.map((notification, index) => {
          var time = notification.time;
          var type = notification.type;
          var method = notification.methodPayload;

          // 60 * hours ==> Minutes
          // 1440 * days ==> Minutes
          // 10080 * weeks ==> Minutes
          var minutes = Utils.getMinutes(type, time)

          reminders.push({
            method: method,
            minutes: minutes
          })
        })
        var payload = {
          userId: result[0].id,
          email: result[0].email,
          accessToken: result[0].accessToken,
          subject: subject,
          startDate: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime,
          description: description,
          colorId: colorId,
          attendees: attendees,
          attachments: this.state.attachments,
          hasAttachments: this.state.attachments.length != 0 ? true : false,
          reminders: reminders,
          requestId: requestId,
          isConferenceEnabled: isConferenceEnabled,
        }

        console.log("Payload Add -- " + JSON.stringify(payload) + " -- " + this.state.currentColor.value + " >>> " + colorId)
        attachmentUploadedObjs = []
        this.setState({
          visible: false,
          animateProgress: 0,
          totalProcess: 0,
          indeterminate: true,
          completedProcess: false,
          error_in_calendar: false,
          progress_statement: '',
          postCalendarPayload: payload,
          createPlannerDialogVisible: true,
        })
        this.animate()
        setTimeout(() => {
          if (this.state.loginType === Utils.GOOGLE_LOGIN_TYPE) {
            console.log("Send Google Calendar Request --- " + JSON.stringify(payload))
            this.props.createGooglePlanner(payload)
          } else if (this.state.loginType === Utils.MICROSOFT_LOGIN_TYPE) {
            console.log("Send Microsoft Calendar Request --- " + JSON.stringify(payload))
            this.props.createMicrosoftPlanner(payload)
          } else if (Utils.nonSocialLogin(this.state.loginType)) {
            console.log("Send Firebase Calendar Request --- " + JSON.stringify(payload))
            this.props.createFirebasePlanner(payload)
          }
        }, 1000);
      }
    }

  }

  closePlannerDialog(visible) {
    this.setState({
      createPlannerDialogVisible: visible
    })
  }






  fetchStudentsList() {
    var userRef = database().ref('Users')
    let newUserObject = []
    userRef.on('value', studentSnap => {
      studentSnap.forEach((snap) => {
        var sn = snap.val();
        //console.log("Add Email --> " + sn.email)
        newUserObject.push({
          email: sn.email,
          id: sn.id,
          name: sn.name,
          photo: sn.photoURL,
          isChecked: false,
        })
        this.setState({ studentsList: newUserObject, filteredData: newUserObject })
      });
    });
  }

  handleSearch = searchText => {

    let filteredData = this.state.studentsList.filter(function (item) {
      //console.log("Student Title %%%%%%%%%% ===> " + item.title)
      return (
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.setState({ filteredData: filteredData });
  };

  makeTwoDigits(time) {
    const timeString = `${time}`;
    if (timeString.length === 2) return time
    return `0${time}`
  }

  getTimeType(hour) {
    if (hour < 13) return `AM`;
    return `PM`;
  }

  removeNotifyMethod(item) {
    var notificationMethods = [...this.state.notificationMethods]
    let index = this.state.notificationMethods.findIndex(el =>
      el.method === item.method &&
      el.time === item.time &&
      el.type === item.type);
    notificationMethods.splice(index, 1);
    this.setState({
      notificationMethods: notificationMethods
    })
  }

  showNotifyDialog(item) {
    var notificationMethods = [...this.state.notificationMethods]
    let index = this.state.notificationMethods.findIndex(el =>
      el.method === item.method &&
      el.time === item.time &&
      el.type === item.type);

    var notifyObj = notificationMethods[index]
    this.setState({
      methodIndex: notifyObj.methodIndex,
      timeIndex: notifyObj.timeIndex,
      visibleNotificationModal: true,
    })
  }

  addNotifications() {
    var notificationMethods = [...this.state.notificationMethods]
    let index = this.state.notificationMethods.findIndex(el =>
      el.method === this.state.methodLabel &&
      el.time === this.state.notifyTime &&
      el.type === this.state.timeType);

    if (this.state.notifyTime != 0 && index == -1) {

      if (this.state.user.loginType === Utils.MICROSOFT_LOGIN_TYPE) {
        notificationMethods = []
      }

      notificationMethods.push({
        method: this.state.methodLabel,
        methodIndex: this.state.methodIndex,
        methodPayload: this.state.methodPayload,
        timeIndex: this.state.timeIndex,
        time: this.state.notifyTime,
        type: this.state.timeType
      })
      this.setState({
        visibleNotificationModal: false,
        notificationMethods: notificationMethods
      })
    } else {
      this.setState({
        visibleNotificationModal: false,
      })
    }
  }

  closeNotifications() {
    this.setState({
      visibleNotificationModal: false,
    })
  }

  completed() {
    this.setState({
      createPlannerDialogVisible: false
    })

    if (!this.state.error_in_calendar)
      this.reset()
  }

  updateCheck(item) {

    //console.log(" Item Check --> " + item.email)
    console.log(" Before Update --> " + JSON.stringify(this.state.studentsList))

    var studentsList = [...this.state.studentsList]
    let index = this.state.studentsList.findIndex(el => el.email === item.email);
    var studentObj = studentsList[index]
    console.log("Email -- " + item.email + " ::: " + JSON.stringify(studentObj))
    studentsList[index] = {
      email: item.email,
      id: item.id,
      name: item.name,
      photo: item.photo,
      isChecked: !studentObj.isChecked,
    }

    var total_invite_attendees = this.state.total_invite_attendees
    this.setState({
      studentsList: studentsList,
      filteredData: studentsList,
      total_invite_attendees: !studentObj.isChecked === true ? total_invite_attendees + 1 : total_invite_attendees === 0 ? 1 : total_invite_attendees - 1
    });

    console.log(" After Update --> " + JSON.stringify(this.state.studentsList))
  }

  setNotifyTime(time) {
    this.setState({
      notifyTime: time > this.state.defaultTime ? this.state.defaultTime : time
    })
  }

  setTimeIndex(timeIndex, timeLabel, defaultTime, maxLength) {
    this.setState({
      timeIndex: timeIndex,
      timeType: timeLabel,
      defaultTime: defaultTime,
      maxLength: maxLength,
      notifyTime: defaultTime
    })
  }

  setMethodIndex(methodIndex, methodLabel, methodPayload) {
    /*console.log("methodIndex == " + methodIndex)
    console.log("methodLabel == " + methodLabel)
    console.log("methodPayload == " + methodPayload)*/
    this.setState({
      methodIndex: methodIndex,
      methodLabel: methodLabel,
      methodPayload: methodPayload
    })
  }

  closePeopleDialog(visible) {
    console.log(" CLose Dialog -- " + visible)
    this.setState({
      visiblePeopleModal: false
    })
  }

  closeNotificationDialog(visible) {
    console.log(" CLose Notification Dialog -- " + visible)
    this.setState({
      visibleNotificationModal: false
    })
  }

  defaultNotifySet() {
    this.setState({
      methodLabel: this.state.loginType === Utils.GOOGLE_LOGIN_TYPE ? 'As email' : 'As notification',
      methodPayload: this.state.loginType === Utils.GOOGLE_LOGIN_TYPE ? 'email' : 'notification',
      methodIndex: 0,
      timeIndex: 0,
      notifyTime: 10,
      defaultTime: 100,
      maxLength: 3,
      timeType: 'Minutes',
      visibleNotificationModal: true
    });
  }

  reset() {

    /*let date = new Date();
    var dayMonth = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
    var time = this.makeTwoDigits(date.getHours()) + ":" + this.makeTwoDigits(date.getMinutes()) + " " + this.getTimeType(date.getHours());*/

    const utcStartTime = moment.utc(new Date());
    var date = utcStartTime.local().format('YYYY-MM-DD');
    var time = utcStartTime.local().format('HH:mm a');
    var result = Utils.currentUser();

    var googleNotification = [
      { method: 'As email', methodPayload: 'email', methodIndex: 0, timeIndex: 0, time: 30, type: 'Minutes' },
      { method: 'As notification', methodPayload: 'popup', methodIndex: 0, timeIndex: 0, time: 10, type: 'Minutes' }]

    var microsoftNotification = [
      {
        method: 'As notification',
        methodPayload: 'popup',
        methodIndex: 0,
        timeIndex: 0,
        time: 10,
        type: 'Minutes'
      }]

    this.setState({
      loginType: result[0].loginType,
      socialLogin: Utils.socialLogin(result[0].loginType),
      subject: '',
      startDate: date,
      startTime: time,
      endDate: date,
      endTime: time,
      description: '',
      notificationMethods: result[0].loginType === Utils.GOOGLE_LOGIN_TYPE ? googleNotification : microsoftNotification,
      isConferenceEnabled: false,
      visible: false,
      attendeesList: [],
      total_invite_attendees: 0,
      attachments: []
    })

    var studentsList = [...this.state.studentsList]
    this.state.studentsList.map((item, idx) => {
      let index = this.state.studentsList.findIndex(el => el.email === item.email)
      console.log("Email -- " + item.email)
      studentsList[index] = {
        email: item.email,
        id: item.id,
        name: item.name,
        photo: item.photo,
        isChecked: false,
      }
    })
    this.setState({
      studentsList: studentsList,
      filteredData: studentsList
    });
  }

  removeChooseFile(attach) {

    var savedAttachments = [...this.state.attachments]
    let index = this.state.attachments.findIndex(el => el.uri === attach.uri);
    savedAttachments.splice(index, 1)

    this.setState({ attachments: savedAttachments })
  }

  chooseFiles = async () => {
    console.log("chooseFiles --> ")
    // Pick multiple files
    try {
      var savedAttachments = [...this.state.attachments]
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images,
        DocumentPicker.types.pdf,
        DocumentPicker.types.zip,
        DocumentPicker.types.csv,
        DocumentPicker.types.audio],
      });
      for (const res of results) {

        if (res.size < Utils.MAXIMUM_ATTACHMENT_FILE_SIZE && savedAttachments.length < Utils.MAXIMUM_ATTACHMENTS) {
          RNFS.readFile(res.uri, Utils.READ_ATTACHMENT_FILE_TYPE)
            .then(base64 => {
              console.log("Insert -- " + res.uri + " --- " + res.size)
              savedAttachments.push({
                    uri: res.uri,
                    path: "No path found",
                    base64: base64,
                    name: res.name,
                    size: res.size,
                    type: res.type
                  })
                  this.setState({ attachments: savedAttachments })
            });
        } else {
          console.log("Large Size --- " + res.size)

          if (savedAttachments.length > Utils.MAXIMUM_ATTACHMENTS) {
            ToastAndroid.showWithGravityAndOffset(Utils.ERROR_MSG_ATTACHMENTS_LIMIT,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25, 200);
          } else {
            ToastAndroid.showWithGravityAndOffset(res.name + " has more than maximum file size",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25, 200);
          }
        }
      }
      console.log("Total of Attachments >>> " + attachments.length)

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log("Error ---> File ::: " + err)
      } else {
        console.log(" Error --- " + err)
      }
    }
  }

  openVideoLink(url) {
    Linking.openURL(url)
  }

  closeColorDialog() {
    this.setState({
      visibleColorModal: false
    })
  }
  chooseColor(color) {
    console.log("chooseColor - " + JSON.stringify(color))
    this.setState({
      visibleColorModal: false,
      currentColor: this.state.currentColor.value === color.value ? '' : color
    })
  }

  render() {

    let date = new Date();
    var dayMonth = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
    var time = this.makeTwoDigits(date.getHours()) + ":" + this.makeTwoDigits(date.getMinutes()) + " " + this.getTimeType(date.getHours());

    return (
      <View style={styles.container}>

        <CardView
          style={headerStyles.create_planner_container}
          cardElevation={2}
          cardMaxElevation={2}>
          <Row size={12}>
            <Col sm={5} md={4} lg={3}>
              <Text style={headerStyles.header_label}>Create Planner</Text>
            </Col>
            <Col sm={7}>
              <View style={styles.done_planner_view}>
                <TouchableOpacity
                  style={styles.done_planner_btn_mview}
                  onPress={() => this.onSave()}>
                  <View style={styles.done_planner_label_view}>
                    <Text style={styles.done_planner_label}>Done </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Col>
          </Row>
        </CardView>

        <ProgressLoader
          visible={this.state.visible}
          isModal={true}
          isHUD={true}
          hudColor={"#000000"}
          color={"#FFFFFF"} />

        <CreatePlannerDialog
          createPlannerDialogVisible={this.state.createPlannerDialogVisible}
          loginType={this.state.user.loginType}
          animateProgress={this.state.animateProgress}
          totalProcess={this.state.totalProcess}
          completedProcess={this.state.completedProcess}
          error_in_calendar={this.state.error_in_calendar}
          completed={this.completed}
          indeterminate={this.state.indeterminate}
          progress_statement={this.state.progress_statement}
          closePlannerDialog={this.closePlannerDialog}
        />

        <ScrollView style={{ flex: 1, }} showsVerticalScrollIndicator={false}>
          <View style={styles.planner_form_view}>
            <View style={styles.subject_view}>
              <Row size={12}>
                <Col sm={1}>
                  <Image
                    style={styles.subject_icon}
                    source={require('../../../assets/icons/subject.png')}
                  />
                </Col>
                <Col sm={11}>
                  <TextInput
                    placeholder='Add Subject'
                    placeholderTextColor="#000"
                    selectionColor="#000"
                    underlineColorAndroid="#fff"
                    maxLength={50}
                    style={styles.subject_text}
                    onChangeText={text => this.setState({ subject: text })}>
                    {this.state.subject}
                  </TextInput>
                </Col>
              </Row>
            </View>
            <View style={styles.underline_view} />
            <View style={styles.start_date_time_view}>
              <Row size={13}>
                <Col sm={1}>
                  <Image
                    style={styles.subject_icon}
                    source={require('../../../assets/icons/date_time.png')}
                  />
                </Col>
                <Col sm={4}>
                  <DatePicker
                    style={styles.date_picker}
                    date={this.state.startDate}
                    mode="date"
                    placeholderText={dayMonth}
                    format="YYYY-MM-DD"
                    showIcon={false}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        color: '#000'
                      },
                      dateText: {
                        fontFamily: 'Roboto-Regular',
                        fontSize: 16,
                        color: 'black'
                      }
                    }}
                    onDateChange={(date) => { this.setState({ startDate: date }) }}>
                  </DatePicker>
                </Col>
                <Col sm={5}>
                  <DatePicker
                    style={styles.date_picker}
                    date={this.state.startTime}
                    mode="time"
                    showTime={{ user12hours: true, format: "HH:mm a" }}
                    placeholderText={time}
                    format="HH:mm a"
                    showIcon={false}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        color: '#000'
                      },
                      dateText: {
                        fontFamily: 'Roboto-Regular',
                        fontSize: 16,
                        color: 'black'
                      }
                    }}
                    onDateChange={(time) => {
                      this.setState({ startTime: time })
                    }}>
                  </DatePicker>
                </Col>
              </Row>
            </View>
            <View style={styles.end_date_time_view}>
              <Row size={13}>
                <Col sm={1}>
                  <Image
                    style={styles.subject_icon}
                    source={require('../../../assets/icons/date_time.png')}
                  />
                </Col>
                <Col sm={4}>
                  <DatePicker
                    style={styles.date_picker}
                    date={this.state.endDate}
                    mode="date"
                    placeholderText={dayMonth}
                    format="YYYY-MM-DD"
                    showIcon={false}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        color: '#000'
                      },
                      dateText: {
                        fontFamily: 'Roboto-Regular',
                        fontSize: 16,
                        color: 'black'
                      }
                    }}
                    onDateChange={(date) => { this.setState({ endDate: date }) }}>
                  </DatePicker>
                </Col>
                <Col sm={5}>
                  <DatePicker
                    style={styles.date_picker}
                    date={this.state.endTime}
                    mode="time"
                    showTime={{ user12hours: true, format: "HH:mm a" }}
                    placeholderText={time}
                    format="HH:mm a"
                    showIcon={false}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        color: '#000'
                      },
                      dateText: {
                        fontFamily: 'Roboto-Regular',
                        fontSize: 16,
                        color: 'black'
                      }
                    }}
                    onDateChange={(time) => { this.setState({ endTime: time }) }}>
                  </DatePicker>
                </Col>
              </Row>
            </View>
            <View style={styles.underline_view} />
            {this.state.socialLogin === true &&
              <View>
                <View style={styles.attendes_view}>
                  <Row size={14}>
                    <Col sm={1}>
                      <Image
                        style={styles.attendes_icon_view}
                        source={require('../../../assets/icons/attendees.png')}
                      />
                    </Col>
                    <Col sm={13}>
                      <TouchableOpacity onPress={() => { this.setState({ visiblePeopleModal: true }); }}>
                        <Text style={styles.attendes_label}>Add Attendees {JSON.stringify(this.props.studentsList)}</Text>
                      </TouchableOpacity>

                      <View style={{ marginTop: 10 }}>
                        {this.state.studentsList.map((student, index) => {
                          if (student.isChecked) {
                            console.log("Student Checked -- " + student.email)
                            return (
                              <View style={{ padding: 5, marginLeft: 10 }}>
                                <Row size={16}>
                                  <Col sm={1}>
                                    <View style={styles.invite_people_icon_view}>
                                      {student.photo &&
                                        <Image style={styles.invite_people_icon} source={{ uri: student.photo }} />
                                      }
                                      {student.photo === undefined &&
                                        <Image style={styles.invite_people_icon} source={require('../../../assets/icons/ic_person.png')} />
                                      }

                                    </View>
                                  </Col>
                                  <Col sm={11}>
                                    <View style={styles.invite_people_name_view}>
                                      <Text style={styles.invite_people_name} numberOfLines={1}>
                                        {student.email}
                                      </Text>
                                    </View>
                                  </Col>
                                  <Col sm={2}>
                                    <TouchableOpacity onPress={() => this.updateCheck(student)}>
                                      <Image
                                        style={styles.add_people_close_view}
                                        source={require('../../../assets/icons/close.png')}
                                      />
                                    </TouchableOpacity>
                                  </Col>
                                </Row>
                              </View>
                            )
                          }
                        })}
                      </View>

                      <AddPeopleComponent
                        user={this.state.user}
                        isVisible={this.state.visiblePeopleModal}
                        filteredData={this.state.filteredData}
                        total_invite_attendees={this.state.total_invite_attendees}
                        handleSearch={this.handleSearch}
                        updateCheck={this.updateCheck}
                        closePeopleDialog={this.closePeopleDialog}
                      />

                    </Col>
                  </Row>
                </View>
                <View style={styles.social_underline_view} />
              </View>
            }
            {this.state.socialLogin === true &&
              <View>
                <View style={styles.reminder_view}>
                  <Row size={14}>
                    <Col sm={1}>
                      <Image
                        style={styles.reminder_icon_view}
                        source={require('../../../assets/icons/reminder.png')}
                      />
                    </Col>
                    <Col sm={13}>
                      {this.state.notificationMethods.length < 4 &&
                        <TouchableOpacity onPress={() => {
                          this.defaultNotifySet();
                        }}>
                          <Text style={styles.reminder_text}>Add notification</Text>
                        </TouchableOpacity>
                      }
                      <FlatList
                        style={styles.add_people_list}
                        data={
                          this.state.notificationMethods && this.state.notificationMethods.length > 0
                            ? this.state.notificationMethods
                            : null
                        }
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                          <View>
                            <Row size={12}>
                              <Col sm={8}>
                                <View style={styles.notification_method_view}>
                                  <Text style={styles.notification_time} numberOfLines={1}>
                                    {item.time} {item.type} before {item.method}
                                  </Text>
                                </View>
                              </Col>
                              <Col sm={2}>
                                <TouchableOpacity onPress={() => this.removeNotifyMethod(item)}>
                                  <Image
                                    style={styles.notification_close_view}
                                    source={require('../../../assets/icons/close.png')}
                                  />
                                </TouchableOpacity>
                              </Col>
                            </Row>
                          </View>
                        )} />

                      <AddNotificationComponent
                        isVisible={this.state.visibleNotificationModal}
                        loginType={this.state.loginType}
                        maxLength={this.state.maxLength}
                        notifyTime={this.state.notifyTime}
                        timeIndex={this.state.timeIndex}
                        methodIndex={this.state.methodIndex}
                        notifyTime={this.state.notifyTime}
                        setNotifyTime={this.setNotifyTime}
                        setTimeIndex={this.setTimeIndex}
                        setMethodIndex={this.setMethodIndex}
                        addNotifications={this.addNotifications}
                        closeNotifications={this.closeNotifications}
                      />
                    </Col>
                  </Row>
                </View>
                <View style={styles.social_underline_view} />
              </View>
            }
            {this.state.socialLogin === true &&
              <View>
                <View style={styles.conference_view}>
                  <TouchableOpacity onPress={() => {
                    this.setState({ isConferenceEnabled: !this.state.isConferenceEnabled })
                  }}>
                    <Row size={16}>
                      <Col sm={1}>
                        <Image
                          style={styles.reminder_icon_view}
                          source={require('../../../assets/icons/video.png')}
                        />
                      </Col>
                      <Col sm={10}>
                        <Text style={styles.conference_text}>Add Video conferencing</Text>
                      </Col>
                      <Col sm={4}>
                        <View style={{ marginTop: 5 }}>
                          <CheckBox onClick={() => {
                            this.setState({ isConferenceEnabled: !this.state.isConferenceEnabled })
                          }}
                            isChecked={this.state.isConferenceEnabled} />
                        </View>
                      </Col>
                    </Row>
                  </TouchableOpacity>
                </View>
                <View style={styles.video_underline_view} />
              </View>
            }
            <View style={styles.color_view}>
              <TouchableOpacity onPress={() => {
                this.setState({ visibleColorModal: true })
              }}>
                <Row size={16}>
                  <Col sm={1}>
                    <View
                      style={{
                        width: 25,
                        height: 25,
                        marginTop: 5,
                        backgroundColor: this.state.currentColor.color ? this.state.currentColor.color : '#5484ed',
                        borderRadius: 20
                      }}
                    />
                  </Col>
                  <Col sm={8}>
                    <Text style={styles.color_text}>{this.state.currentColor.color ? this.state.currentColor.label : 'Add Color'} </Text>
                  </Col>
                  <Col sm={6}>
                    <AddColorComponent
                      isVisible={this.state.visibleColorModal}
                      loginType={this.state.user.loginType}
                      currentColor={this.state.currentColor}
                      chooseColor={this.chooseColor}
                      closeColorDialog={this.closeColorDialog}
                    />
                  </Col>
                </Row>
              </TouchableOpacity>
            </View>
            <View style={styles.underline_view} />
            {this.state.socialLogin === true &&
              <View>
                <View style={styles.conference_view}>
                  <Row size={16}>
                    <Col sm={1}>
                      <Image
                        style={styles.reminder_icon_view}
                        source={require('../../../assets/icons/attachment.png')}
                      />
                    </Col>
                    <Col sm={14}>
                      <TouchableOpacity onPress={() => {
                        this.chooseFiles()
                      }}>
                        <Text style={styles.conference_text}>Add Attachments</Text>
                      </TouchableOpacity>

                      <View style={{ marginTop: 10 }}>
                        {this.state.attachments.map((attach) => {
                          return (
                            <View style={{ padding: 5, marginLeft: 10 }}>
                              <Row size={16}>
                                <Col sm={1}>
                                  <View style={styles.attachments_icon_view}>
                                    <Image style={styles.attachments_icon} source={require('../../../assets/icons/attach_file.png')} />
                                  </View>
                                </Col>
                                <Col sm={11}>
                                  <View style={styles.attachments_name_view}>
                                    <TouchableOpacity>
                                      <Text style={styles.attachments_name} numberOfLines={1}>
                                        {attach.name}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </Col>
                                <Col sm={2}>
                                  <TouchableOpacity onPress={() => this.removeChooseFile(attach)}>
                                    <Image
                                      style={styles.add_people_close_view}
                                      source={require('../../../assets/icons/close.png')}
                                    />
                                  </TouchableOpacity>
                                </Col>
                              </Row>
                            </View>
                          )
                        })}
                      </View>
                    </Col>
                  </Row>
                </View>
                <View style={styles.attachment_underline_view} />
              </View>
            }
            <View style={styles.description_view}>
              <Row size={16}>
                <Col sm={1}>
                  <Image
                    style={styles.reminder_icon_view}
                    source={require('../../../assets/icons/description.png')}
                  />
                </Col>
                <Col sm={14}>
                  <TextInput
                    style={styles.descriptionTextInputView}
                    underlineColorAndroid="transparent"
                    multiline={true}
                    placeholder="Add description"
                    placeholderTextColor="#000"
                    autoCapitalize="none"
                    onChangeText={text => this.setState({ description: text })}>
                    {this.state.description}
                  </TextInput>
                </Col>
              </Row>
            </View>
            <View style={styles.underline_view} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const stateProps = state => ({
  studentsList: state.studentsList,
  createFirebasePlannerPayload: state.createFirebasePlannerPayload,
  createGooglePlannerPayload: state.createGooglePlannerPayload,
  createMicrosoftPlannerPayload: state.createMicrosoftPlannerPayload,
  plannerCallback: state.plannerCallback,
});
const dispatchProps = dispatch => ({
  createFirebasePlanner: (payload) => dispatch(createFirebasePlanner(payload)),
  createGooglePlanner: (payload) => dispatch(createGooglePlanner(payload)),
  createMicrosoftPlanner: (payload) => dispatch(createMicrosoftPlanner(payload)),
});
export default connect(stateProps, dispatchProps)(CreatePlannerComponent)