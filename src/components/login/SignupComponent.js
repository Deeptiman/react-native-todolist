import React, {Component} from 'react';
import { View, Text, StatusBar, Image, Alert, TextInput, TouchableOpacity, Platform} from 'react-native';
import AuthRealmServices from '../../Realm/AuthRealm';
import firebase from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import ProgressLoader from 'rn-progress-loader';
import styles from '../../styles/login/LoginStyles';
import {Utils} from '../utils/Utils';

export default class SignupComponent extends Component {

    constructor(props) {
        super(props);     
        this.state = {
            name: '',
            email: '',
            password: '',
            visible: false
        }
    }

    _subscribeToAll = () => {
        console.log("Success - _subscribeToAll = ")

        if(Platform.OS === 'android'){
            messaging().subscribeToTopic(Utils.ALL_TOPIC).
            then((data) => {
                console.log("Success - subscribeToTopic = " + JSON.stringify(data))
            }).catch((error) => {
                console.log("Error - subscribeToTopic = " + JSON.stringify(error))
            });
        } 

        this.props.navigation.navigate(Utils.DASHBOARD_SCREEN);
    }
    
    _signupWithEmail = async() => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if(this.state.name.length < 3) {
            Alert.alert('Error', 'Minimum 3 characters to add Name');
        } else if (this.state.email.length < 3) {
            Alert.alert('Error', 'Minimum 3 characters to add Email');
        } else if (reg.test(this.state.email) === false) {
            Alert.alert('Error', 'Add proper email');
        } else {
            this.setState({visible: true})
                setTimeout( () => {
                    firebase().createUserWithEmailAndPassword(this.state.email, this.state.password)
                    .then((data) => {                        
                        console.log("Firebase SignIn >>> "+JSON.stringify(data))
                        var uid = data.user.uid;

                        this.authRef = database().ref('Users/')
                        .child(uid)
                        this.authRef.set({
                            id: uid,
                            name: this.state.name,
                            email: this.state.email,
                            photoURL: 'demo',
                            type: Utils.FIREBASE_LOGIN_TYPE,
                        })            
                        .then((data)=>{                            
                            var auth = {
                                id: uid,
                                name: this.state.name,
                                email: this.state.email,
                                phone: '000',
                                photoURL: '',
                                accessToken: 'demo',
                                loginType: Utils.FIREBASE_LOGIN_TYPE,
                                isLoggedIn: true,
                                isSynced: true,
                            }
                            AuthRealmServices.save(auth);
                            this._subscribeToAll()
                        }).catch((error)=>{
                            this.setState({
                                visible: false
                            })
                            Alert.alert('Error', 'Signup Error - '+error.message);
                        })
                    })
                    .catch((error) => {
                        this.setState({
                            visible: false
                        })
                        Alert.alert('Error', 'Signup Error - '+error.message);
                    })
                }, 1000);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header_container}>
                    <View style={styles.app_icon_view}>
                        <Image source={require('../../../assets/icons/ic_app_logo.png')} style={styles.icon_style_logo}/>
                    </View>
                </View>
                <View style={styles.app_label_view}>
                    <Text style={styles.app_label}>TODO-List</Text>
                </View>
                <ProgressLoader
                    visible={this.state.visible}
                    isModal={true} 
                    isHUD={true}
                    hudColor={"#000000"}
                    color={"#FFFFFF"} />
                <View style={styles.signin_email_container}>
                    <View style={styles.login_text_input_view} >
                        <TextInput  
                            style={styles.login_text_input}
                            placeholder="Name..." 
                            placeholderTextColor="#003f5c"
                            value={this.state.name}
                            onChangeText={text => this.setState({name:text})}/>
                    </View>
                    <View style={styles.login_text_input_view} >
                        <TextInput  
                            style={styles.login_text_input}
                            placeholder="Email..." 
                            placeholderTextColor="#003f5c"
                            value={this.state.email}
                            onChangeText={text => this.setState({email:text})}/>
                    </View>
                    <View style={styles.login_text_input_view} >
                        <TextInput  
                            style={styles.login_text_input}
                            secureTextEntry={true}
                            placeholder="Password..." 
                            placeholderTextColor="#003f5c"
                            value={this.state.password}
                            onChangeText={text => this.setState({password:text})}/>
                    </View>
                    <TouchableOpacity 
                        style={styles.login_btn_signup_container}
                        onPress={this._signupWithEmail}>
                        <View style={styles.login_btn_signup_view}>                            
                            <View style={styles.login_btn_label_view}>
                                <Text style={styles.login_btn_signin_label}>Sign up with email</Text>
                            </View>
                        </View>
                    </TouchableOpacity> 
                    <View style={styles.or_signin_container}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                            <Text style={styles.or_label}>Already have an account? Signin</Text>
                        </TouchableOpacity>
                    </View>                   
                </View>
            </View>
        )
    }
}