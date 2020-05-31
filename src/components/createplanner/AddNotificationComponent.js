import React, { Component } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Dialog } from 'react-native-simple-dialogs';
import styles from '../../styles/createplanner/CreatePlannerStyles';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import { Utils } from '../utils/Utils';

export default class AddNotificationComponent extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        let notification_props = [
            { label: 'Minutes', value: 1, time: 100, maxLength: 3 },
            { label: 'Hours', value: 2, time: 120, maxLength: 3 },
            { label: 'Days', value: 3, time: 20, maxLength: 2 },
            { label: 'Weeks', value: 4, time: 4, maxLength: 1 }
        ];

        let notification_methods_props = []

        if (this.props.loginType === Utils.GOOGLE_LOGIN_TYPE) {
            notification_methods_props = [
                { label: 'As email', payload: 'email', value: 1 },
                { label: 'As notification', payload: 'popup', value: 2 }
            ];
        } else if (this.props.loginType === Utils.MICROSOFT_LOGIN_TYPE) {
            notification_methods_props = [
                { label: 'As notification', payload: 'popup', value: 1 }
            ];
        }

        return (
            <Dialog
                visible={this.props.isVisible}
                title="Add Notification"
                titleStyle={styles.add_notification_title}
                dialogStyle={styles.add_notification_dialog}
                keyboardShouldPersistTaps="never">
                <ScrollView>
                    <View style={styles.add_notification_view}>
                        <View style={styles.notificationTextInputView}>
                            <TextInput
                                style={styles.notificationTextInput}
                                underlineColorAndroid="transparent"
                                selectionColor="#000"
                                maxLength={this.props.maxLength}
                                keyboardType="numeric"
                                onChangeText={time => this.props.setNotifyTime(time)}
                            >{this.props.notifyTime}</TextInput>
                        </View>
                        <RadioForm
                            style={styles.notification_radio_button_view}
                            formHorizontal={false}
                            animation={true}>
                            {
                                notification_props.map((obj, i) => (
                                    <RadioButton labelHorizontal={true} key={i} style={{ padding: 10 }} >
                                        <RadioButtonInput
                                            obj={obj}
                                            index={i}
                                            isSelected={this.props.timeIndex === i}
                                            borderWidth={2}
                                            buttonInnerColor={'#000'}
                                            buttonOuterColor={this.props.timeIndex === i ? '#2196f3' : '#000'}
                                            buttonSize={18}
                                            buttonOuterSize={22}
                                            buttonStyle={{}}
                                            onPress={(value) => { this.props.setTimeIndex(i, obj.label, obj.time, obj.maxLength) }}
                                            buttonWrapStyle={{ marginLeft: 10 }}
                                        />
                                        <RadioButtonLabel
                                            obj={obj}
                                            index={i}
                                            onPress={(value) => { this.props.setTimeIndex(i, obj.label, obj.time, obj.maxLength) }}
                                            labelHorizontal={true}
                                            labelStyle={{
                                                width: '100%',
                                                fontFamily: 'Roboto-Regular',
                                                fontSize: 16,
                                                color: '#000'
                                            }}
                                            labelWrapStyle={{}}
                                        />
                                    </RadioButton>
                                ))
                            }
                        </RadioForm>
                        <View style={styles.underline_view} />
                        <RadioForm
                            style={styles.notification_radio_button_view}
                            formHorizontal={false}
                            animation={true}>
                            {
                                notification_methods_props.map((obj, i) => (

                                    <RadioButton labelHorizontal={true} key={i} style={{ padding: 10 }} >
                                        <RadioButtonInput
                                            obj={obj}
                                            index={i}
                                            isSelected={this.props.methodIndex === i}
                                            borderWidth={2}
                                            buttonInnerColor={'#000'}
                                            buttonOuterColor={this.props.methodIndex === i ? '#2196f3' : '#000'}
                                            buttonSize={18}
                                            buttonOuterSize={22}
                                            buttonStyle={{}}
                                            onPress={() => this.props.setMethodIndex(i, obj.label, obj.payload)}
                                            buttonWrapStyle={{ marginLeft: 10 }}
                                        />
                                        <RadioButtonLabel
                                            obj={obj}
                                            index={i}
                                            onPress={() => this.props.setMethodIndex(i, obj.label, obj.payload)}
                                            labelHorizontal={true}
                                            labelStyle={{
                                                width: '100%',
                                                fontFamily: 'Roboto-Regular',
                                                fontSize: 16,
                                                color: '#000'
                                            }}
                                            labelWrapStyle={{}}
                                        />
                                    </RadioButton>
                                ))
                            }
                        </RadioForm>
                        <View style={styles.notification_footer_view}>
                            <Row size={20}>
                                <Col sm={15}>
                                    <TouchableOpacity
                                        style={styles.notification_close_btn_mview}
                                        onPress={() => this.props.closeNotifications()}>
                                        <Text style={styles.notification_close_label}>Close</Text>
                                    </TouchableOpacity>
                                </Col>
                                <Col sm={5}>
                                    <TouchableOpacity
                                        style={styles.notification_done_btn_mview}
                                        onPress={() => this.props.addNotifications()}>
                                        <View style={styles.notification_done_label_view}>
                                            <Text style={styles.notification_done_label}>Done </Text>
                                        </View>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                        </View>
                    </View>
                </ScrollView>

            </Dialog>
        )
    }
}