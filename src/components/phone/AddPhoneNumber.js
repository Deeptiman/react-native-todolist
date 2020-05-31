import React, { Component } from 'react';
import { View, Text, StatusBar, Image, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase'
import ProgressLoader from 'rn-progress-loader';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import AuthRealmServices from '../../Realm/AuthRealm';
import styles from '../../styles/login/LoginStyles';

class AddPhoneNumber extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phone_number: '',
            visible: false,
        }
    }

    _add_phone_number = async () => {

        this.setState({ visible: true })
        setTimeout(async () => {
            var realmUser = AuthRealmServices.find();
            var result = JSON.parse(JSON.stringify(realmUser));

            var user = result[0]

            var authRef = firebase.database().ref('Users').child(user.id)
            authRef.once('value', snap => {
                authRef.set({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: this.state.phone_number,
                    photoURL: user.photo,
                    type: user.loginType
                }).then((data) => {
                    console.log("Add Phone number Data === " + data);

                    AuthRealmServices.updatePhoneNumber(this.state.phone_number, user.email)
                    setTimeout(() => {
                        this.props.navigation.navigate('Dashboard');
                    }, 1000)

                }).catch((error) => {
                    console.log("Error Phone number === " + error);
                })
            });
        }, 1000);
    }

    skip = async() => {
        this.props.navigation.navigate('Dashboard');
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="transparent" />
                <CardView
                    style={styles.phone_number_container}
                    cardElevation={2}
                    cardMaxElevation={2}>
                    <Row size={12}>
                        <Col sm={10}>
                        </Col>
                        <Col sm={2}>
                            <Ripple
                                onPress={() => console.log("skip")}>
                                <Text style={styles.skip_btn_label}>Sign in with email</Text>
                            </Ripple>
                        </Col>
                    </Row>
                </CardView>
                <View style={styles.header_container}>
                    <View style={styles.app_icon_view}>
                        <Image source={require('../../../assets/icons/ic_app_logo.png')} style={styles.icon_style_logo} />
                    </View>
                </View>
                <View style={styles.app_label_view}>
                    <Text style={styles.app_label}>Add PhoneNumber</Text>
                </View>
                <ProgressLoader
                    visible={this.state.visible}
                    isModal={true}
                    isHUD={true}
                    hudColor={"#000000"}
                    color={"#FFFFFF"} />
                <View style={styles.add_phone_number_container}>
                    <View style={styles.login_text_input_view} >
                        <TextInput
                            style={styles.login_text_input}
                            placeholder="Phone number..."
                            placeholderTextColor="#003f5c"
                            keyboardType="number-pad"
                            onChangeText={text => this.setState({ phone_number: text })} />
                    </View>
                </View>

                <Row size={13} style={styles.phone_number_btn_container}>
                    <Col sm={3}>
                    </Col>
                    <Col sm={6}>
                        <TouchableOpacity
                            style={styles.phone_number_btn_view}
                            onPress={this._add_phone_number}>
                            <View style={styles.login_btn_label_view}>
                                <Text style={styles.login_btn_signin_label}>Add</Text>
                            </View>
                        </TouchableOpacity>
                    </Col>
                </Row>
            </View>
        )
    }
}