import React, { Component } from 'react';
import { View, Text, ScrollView, BackHandler, Linking, Image, TouchableOpacity } from 'react-native';
import CardView from 'react-native-cardview';
import { StyleSheet } from 'react-native';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import Ripple from 'react-native-material-ripple';
import moment from 'moment';
import { connect } from 'react-redux';
import HTMLView from 'react-native-htmlview';
import Share from 'react-native-share';
import styles from '../../styles/calendar/CalendarStyles';
import eventStyles from '../../styles/event/EventStyles';
import { Utils } from '../utils/Utils';

class EventDetailsComponent extends Component {

    constructor(props) {
        super(props);
        const event = this.props.navigation.state.params.key;
        const flag = this.props.navigation.state.params.flag;
        const searchList = this.props.navigation.state.params.list;

        console.log("Event --> " + JSON.stringify(event))

        this.state = {
            planner: event,
            flag: flag,
            searchList: searchList
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        console.log("handleBackButtonClick >>>")
        if (this.props.navigation && this.props.navigation.goBack) {
            var planner = JSON.parse(JSON.stringify(this.state.planner))
            this.state.flag == 0 ? this.props.navigation.navigate(Utils.DASHBOARD_SCREEN) : this.props.navigation.navigate(Utils.PLANNER_LIST_SCREEN, { key: this.state.searchList == 0 ? Utils.ALL_PLANNERS : planner.startDate })
            return true;
        }
        return false;
    }

    openVideoLink(url) {
        Linking.openURL(url)
    }

    sharePlanner(planner) {

        setTimeout(() => {
            Share.open({
                url: planner.weblink,
                title: planner.subject,
                message: planner.description
            })
                .then((res) => {
                    console.log("Share Res - " + res)
                })
                .catch((err) => {
                    err && console.log("Error - " + err);
                });
        }, 1000);
    }

    render() {

        var result = Utils.currentUser()

        let momentStartDateObj = moment(this.state.planner.startDate, Utils.DATE_FORMAT)
        let momentEndDateObj = moment(this.state.planner.endDate, Utils.DATE_FORMAT)

        var startDate = moment(momentStartDateObj).format(Utils.UI_DATE_TIME_FORMART);
        var endDate = "\n\n" + moment(momentEndDateObj).format(Utils.UI_DATE_TIME_FORMART);
        if (this.state.planner.startDate === this.state.planner.endDate) {
            endDate = '';
        }

        var planner = JSON.parse(JSON.stringify(this.state.planner))      

        var onlineMeeting = JSON.parse(JSON.stringify(planner.onlineMeeting))
        var meetObj = onlineMeeting[0]
        var color = JSON.parse(JSON.stringify(planner.color))
        var colorObj = color[0]


        var socialLogin = Utils.socialLogin(result[0].loginType)

        return (
            <View style={styles.container}>
                <CardView
                    style={eventStyles.container}
                    cardElevation={2}
                    cardMaxElevation={2}>
                    <Row size={12}>
                        <Col sm={2}>
                            <Ripple
                                onPress={() => this.state.flag == 0 ? this.props.navigation.navigate(Utils.DASHBOARD_SCREEN) : this.props.navigation.navigate(Utils.PLANNER_LIST_SCREEN, { key: this.state.searchList == 0 ? Utils.ALL_PLANNERS : planner.startDate })}>
                                <Image
                                    style={eventStyles.menuBtn}
                                    source={require('../../../assets/icons/close.png')}
                                />
                            </Ripple>
                        </Col>
                        <Col sm={8}></Col>
                        <Col sm={2}>
                            {socialLogin === true &&
                                <Ripple
                                    onPress={() => this.sharePlanner(planner)}>
                                    <Image
                                        style={eventStyles.shareMenuBtn}
                                        source={require('../../../assets/icons/share.png')}
                                    />
                                </Ripple>
                            }
                        </Col>
                    </Row>
                </CardView>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={eventStyles.subject_view}>
                        <Row size={12}>
                            <Col sm={1}>
                                <Image
                                    style={eventStyles.subject_icon}
                                    source={require('../../../assets/icons/subject.png')}
                                />
                            </Col>
                            <Col sm={11}>
                                <Text style={eventStyles.subject_text}>{planner.subject}</Text>
                            </Col>
                        </Row>
                    </View>
                    <View style={eventStyles.date_time_view}>
                        <Row size={14}>
                            <Col sm={1}>
                                <Image
                                    style={eventStyles.subject_icon}
                                    source={require('../../../assets/icons/date_time.png')}
                                />
                            </Col>
                            <Col sm={13}>
                                <Text style={eventStyles.date_time_text}>{startDate} . {planner.startTime} - {endDate} {planner.endTime}</Text>
                            </Col>
                        </Row>
                    </View>
                    {planner.reminders && Object.values(planner.reminders).length > 0 &&
                        <View style={eventStyles.reminder_view}>
                            <Row size={14}>
                                <Col sm={1}>
                                    <Image
                                        style={eventStyles.reminder_icon_view}
                                        source={require('../../../assets/icons/reminder.png')}
                                    />
                                </Col>
                                <Col sm={13}>
                                    {planner.reminders && Object.values(planner.reminders).map((reminder, index) => {
                                        return (<Text style={eventStyles.reminder_text}>{reminder.timeLabel} before as {reminder.method}</Text>)
                                    })}

                                </Col>
                            </Row>
                        </View>
                    }

                    {colorObj &&
                        <View style={eventStyles.color_view}>
                            <Row size={16}>
                                <Col sm={1}>
                                    <View
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginTop: 5,
                                            backgroundColor: colorObj.hexCode,
                                            borderRadius: 20
                                        }}
                                    />
                                </Col>
                                <Col sm={8}>
                                    <Text style={eventStyles.color_text}> {colorObj.label} </Text>
                                </Col>
                            </Row>
                        </View>
                    }

                    {planner.location &&
                        <View style={eventStyles.location_view}>
                            <Row size={14}>
                                <Col sm={1}>
                                    <Image
                                        style={eventStyles.subject_icon}
                                        source={require('../../../assets/icons/location.png')}
                                    />
                                </Col>
                                <Col sm={13}>
                                    <TouchableOpacity
                                        style={styles.description_view}
                                        onPress={() => this.openVideoLink(planner.location)}>
                                        <Text style={eventStyles.location_text}>{planner.location}</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </View>
                    }
                    {meetObj &&
                        meetObj.videoLink && meetObj.videoLink != 'no video link' &&
                        <View style={eventStyles.conference_view}>
                            <Row size={14}>
                                <Col sm={1}>
                                    <Image
                                        style={eventStyles.conference_icon_view}
                                        source={require('../../../assets/icons/video.png')}
                                    />
                                </Col>
                                <Col sm={13}>

                                    <TouchableOpacity
                                        style={styles.description_view}
                                        onPress={() => this.openVideoLink(meetObj.videoLink)}>
                                        <Text style={eventStyles.conference_video_label}>Join Video Call</Text>
                                        {result[0].loginType === Utils.GOOGLE_LOGIN_TYPE &&
                                            <Text style={eventStyles.conference_text}>https://hangout.google.com</Text>
                                        }
                                        {result[0].loginType === Utils.MICROSOFT_LOGIN_TYPE &&
                                            <Text style={eventStyles.conference_text}>https://teams.microsoft.com</Text>
                                        }
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </View>
                    }
                    {meetObj &&
                        meetObj.phoneNumber && meetObj.phoneNumber != 'no phone number' &&
                        <View style={eventStyles.conference_view}>
                            <Row size={14}>
                                <Col sm={1}>
                                    <Image
                                        style={eventStyles.conference_icon_view}
                                        source={require('../../../assets/icons/phone.png')}
                                    />
                                </Col>
                                <Col sm={13}>
                                    <TouchableOpacity
                                        style={styles.description_view}
                                        onPress={() => this.openVideoLink(meetObj.phoneNumber)}>
                                        <Text style={eventStyles.conference_video_label}>Join Phone Call</Text>
                                        <Text style={eventStyles.location_text}>{meetObj.phoneNumber}</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </View>
                    }
                    {planner.organizer &&
                        <View style={eventStyles.organizer_view}>
                            <Row size={14}>
                                <Col sm={1}>
                                    <Image
                                        style={eventStyles.organizer_icon_view}
                                        source={require('../../../assets/icons/organizer.png')}
                                    />
                                </Col>
                                <Col sm={13}>
                                    <Text style={eventStyles.organizer_label}>Organizer</Text>
                                    <Text style={eventStyles.organizer_text}>{planner.organizer}</Text>
                                </Col>
                            </Row>
                        </View>
                    }

                    {planner.attendees && Object.values(planner.attendees).length > 0 &&
                        <View style={eventStyles.attendes_view}>
                            <Row size={14}>
                                <Col sm={1}>
                                    <Image
                                        style={eventStyles.attendes_icon_view}
                                        source={require('../../../assets/icons/attendees.png')}
                                    />
                                </Col>
                                <Col sm={13}>
                                    <Text style={eventStyles.attendes_label}>Attendees</Text>
                                    {Object.values(planner.attendees).map((attend, index) => {
                                        return (
                                            <Row size={14}>
                                                <Col sm={1}>
                                                    {(Utils.needAction(attend.response)) &&
                                                        <Image
                                                            style={eventStyles.meet_response_icon_view}
                                                            source={require('../../../assets/icons/need_action.png')}
                                                        />
                                                    }
                                                    {Utils.accepted(attend.response) &&
                                                        <Image
                                                            style={eventStyles.meet_response_icon_view}
                                                            source={require('../../../assets/icons/accept.png')}
                                                        />
                                                    }
                                                    {Utils.declined(attend.response) &&
                                                        <Image
                                                            style={eventStyles.meet_response_icon_view}
                                                            source={require('../../../assets/icons/decline.png')}
                                                        />
                                                    }
                                                    {(Utils.tentative(attend.response)) &&
                                                        <Image
                                                            style={eventStyles.meet_response_icon_view}
                                                            source={require('../../../assets/icons/tentative.png')}
                                                        />
                                                    }
                                                </Col>
                                                <Col sm={13}>
                                                    <Text style={eventStyles.attendes_text}>{attend.email}</Text>
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                </Col>
                            </Row>
                        </View>
                    }
                    {planner.attachments && Object.values(planner.attachments).length > 0 &&
                        <View style={eventStyles.attendes_view}>
                            <Row size={14}>
                                <Col sm={1}>
                                    <Image
                                        style={eventStyles.attendes_icon_view}
                                        source={require('../../../assets/icons/attachment.png')}
                                    />
                                </Col>
                                <Col sm={13}>
                                    <Text style={eventStyles.attendes_label}>Attachments</Text>
                                    {Object.values(planner.attachments).map((attach, index) => {
                                        return (
                                            <View style={{ padding: 5, marginLeft: 10 }}>
                                                <Row size={16}>
                                                    <Col sm={1}>
                                                        <View style={eventStyles.attachments_icon_view}>
                                                            <Image style={eventStyles.attachments_icon} source={require('../../../assets/icons/attach_file.png')} />
                                                        </View>
                                                    </Col>
                                                    <Col sm={11}>
                                                        <View style={eventStyles.attachments_name_view}>
                                                            <TouchableOpacity onPress={() => this.openVideoLink(attach.fileUrl)}>
                                                                <Text style={eventStyles.attachments_name} numberOfLines={1}>
                                                                    {attach.title}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </Col>
                                                </Row>
                                            </View>
                                        )
                                    })}
                                </Col>
                            </Row>
                        </View>
                    }
                    {planner.description &&
                        <View style={eventStyles.description_view}>
                            <Row size={14}>
                                <Col sm={1}>
                                    <Image
                                        style={eventStyles.description_icon_view}
                                        source={require('../../../assets/icons/description.png')}
                                    />
                                </Col>
                                <Col sm={13}>
                                    <View style={eventStyles.description_text}>
                                        <HTMLView value={planner.description} stylesheet={htmlStyles} />
                                    </View>
                                </Col>
                            </Row>
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }
}

const stateProps = state => ({
    plannerList: state.plannerList,
});

export default connect(stateProps, null)(EventDetailsComponent);

const htmlStyles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
});