import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Dialog } from 'react-native-simple-dialogs';
import styles from '../../styles/calendar/CalendarStyles';
import * as Progress from 'react-native-progress';
import {Utils} from '../utils/Utils';

export default class CreatePlannerDialog extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        var calType = "";

        if (this.props.loginType === Utils.GOOGLE_LOGIN_TYPE) {
            calType = "Google"
        } else if (this.props.loginType === Utils.MICROSOFT_LOGIN_TYPE) {
            calType = "Microsoft"
        } else if (Utils.nonSocialLogin(this.props.loginType)) {
            calType = "Firebase"
        }

        return (
            <Dialog
                visible={this.props.createPlannerDialogVisible}
                dialogStyle={styles.sync_calendar_dialog}
                keyboardShouldPersistTaps="never">

                <View style={styles.create_header_container}>
                    <View style={styles.calendar_icon_view}>
                        {this.props.loginType === Utils.GOOGLE_LOGIN_TYPE &&
                            <Image source={require('../../../assets/icons/ic_google_plus_logo.png')} style={styles.calendar_icon_style_logo} />
                        }
                        {this.props.loginType === Utils.MICROSOFT_LOGIN_TYPE &&
                            <Image source={require('../../../assets/icons/ic_microsoft.png')} style={styles.calendar_icon_style_logo} />
                        }
                        {(Utils.nonSocialLogin(this.props.loginType)) &&
                            <Image source={require('../../../assets/icons/ic_firebase.png')} style={styles.calendar_icon_style_logo} />
                        }
                    </View>
                </View>
                <View style={styles.calendar_label_view}>
                    <Text style={styles.calendar_app_label}>Please wait</Text>
                </View>
                <View style={styles.calendar_label_view}>
                    <Text style={styles.calendar_app_label}>Creating your {calType} calendar</Text>
                </View>
                <View style={styles.calendar_label_progress_loader_view}>
                    <Progress.Bar
                        progress={this.props.animateProgress}
                        size={10}
                        indeterminate={this.props.indeterminate}
                        width={200}
                        height={10} />
                </View>
                <View style={styles.calendar_label_progress_view}>
                    <Text style={styles.calendar_app_label_progress}>{this.props.progress_statement}</Text>
                </View>
                <View style={styles.calendar_footer_view}>
                    {this.props.completedProcess &&
                        <TouchableOpacity
                            style={styles.calendar_done_btn_mview}
                            onPress={() => this.props.completed()}>
                            <View style={styles.calendar_done_label_view}>
                                <Text style={styles.calendar_done_label}>{this.props.error_in_calendar === true ? "Failed" : "Done"} </Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </Dialog>
        )
    }
}