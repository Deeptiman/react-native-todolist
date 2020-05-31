import React, { Component } from 'react';
import { View, Text, FlatList, PermissionsAndroid, Platform, Alert, TextInput, ScrollView, Linking, Image, TouchableOpacity } from 'react-native';
import CardView from 'react-native-cardview';
import { Dialog } from 'react-native-simple-dialogs';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import Ripple from 'react-native-material-ripple';
import CountDown from 'react-native-countdown-component';
import headerStyles from '../../styles/header/HeaderStyles';
import styles from '../../styles/record/RecordStyles';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import RecordRealmService from '../../Realm/RecordRealm';
import FileViewer from 'react-native-file-viewer';
import moment from 'moment';
import { Utils } from '../utils/Utils'

export default class RecordComponent extends Component {

    constructor(props) {
        super(props);

        const savedRecordList = RecordRealmService.findAll()

        this.state = {
            record_dialog_visible: false,
            record_style_state: false,
            record_timer: Utils.MAXIMUM_RECORDING_TIME,
            record_timer_running: false,
            record_file_name: '',
            record_time_stamp: '',
            saved_recording_list: savedRecordList,
            filter_recording_list: savedRecordList,
            hasWritePermission: false,
            hasRecordPermission: false,
            audioPath: ''
        }
    }

    componentDidMount() {
        this.checkPermission()
    }

    openAudioLink(path) {

        setTimeout(() => {
            FileViewer.open(path)
                .then(() => {
                    // success
                    console.log("File open success")
                })
                .catch(error => {
                    // error
                    Alert.alert('Error', 'File has error - ' + error.message)
                    console.log("File open error -- " + error.message)
                });
        }, 1000);
    }

    checkPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Permissions for write access',
                        message: 'Give permission to storage to write a file',
                        buttonPositive: 'ok',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the storage');
                    this.setState({ hasWritePermission: true })
                } else {
                    console.log('permission denied');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: 'Permissions for read access',
                        message: 'Give permission to storage to read a file',
                        buttonPositive: 'ok',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the storage');

                } else {
                    console.log('permission denied');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }

        }
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasRecordPermission: isAuthorised })
            if (!isAuthorised) return;
        });
    }

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    updateRecordBtn = async (state) => {

        if (this.state.record_file_name.length === 0) {
            Alert.alert('Error', 'Please enter the file name')
        } else {

            if (!this.state.hasWritePermission) {
                Alert.alert('Permission Error', 'Can\'t record, no [WRITE] permission granted!');
                return;
            } else if (!this.state.hasRecordPermission) {
                Alert.alert('Permission Error', 'Can\'t record, no [RECORD] permission granted!');
                return;
            } else {
                this.setState({
                    record_style_state: state,
                    record_timer_running: state
                })

                if (!state) {
                    this.stopRecord()
                    return;
                }
            }
        }
    }

    async startRecord() {

        let audioPath = AudioUtils.MusicDirectoryPath + '/students/' + this.state.record_file_name + this.state.record_time_stamp + '.mp3';

        this.prepareRecordingPath(audioPath);
        try {
            const filePath = await AudioRecorder.startRecording();
            console.log("File Path ---> " + filePath)
        } catch (error) {
            console.error(error);
        }
    }

    async stopRecord() {
        try {
            const filePath = await AudioRecorder.stopRecording();
            console.log("Stop File Path ---> " + filePath)
            Alert.alert('Success', 'Audio Recorded as ' + this.state.record_file_name);
            this.saveRecordPath(filePath)
            this.reset(false)
            return filePath;
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Record error - ' + error.message);
        }
    }

    saveRecordPath(filePath) {
        const utcStartTime = moment.utc(this.state.record_time_stamp);
        var startDate = utcStartTime.local().format('YYYY-MM-DD');
        var startTime = utcStartTime.local().format('H:mm a');
        var total = this.state.saved_recording_list.length
        var record = {
            id: this.state.saved_recording_list.length == 0 ? 1 : total + 1,
            path: filePath,
            fileName: this.state.record_file_name,
            timeStamp: startDate + " , " + startTime
        }
        RecordRealmService.save(record)

        const filesList = RecordRealmService.findAll()
        console.log("File List --> " + filesList)
        this.setState({
            saved_recording_list: filesList,
            filter_recording_list: filesList
        })
    }

    reset(visible) {
        this.setState({
            record_style_state: false,
            record_timer_running: false,
            record_file_name: '',
            record_dialog_visible: visible
        })
    }


    filterRecordFiles = searchText => {

        let filteredData = this.state.saved_recording_list.filter(function (item) {
            //console.log("Student Title %%%%%%%%%% ===> " + item.title)
            return (
                item.fileName.toLowerCase().includes(searchText.toLowerCase())
            );
        });

        this.setState({ filter_recording_list: filteredData });
    };

    handleSearch = searchText => {
        this.setState({ record_file_name: searchText, record_time_stamp: new Date() })
    };

    render() {

        if (this.state.record_timer_running) {
            this.startRecord()
        }

        return (
            <View style={styles.container}>
                <CardView
                    style={headerStyles.container}
                    cardElevation={2}
                    cardMaxElevation={2}>
                    <Row size={12}>
                        <Col sm={10}>
                            <Text style={headerStyles.header_label}>Record</Text>
                        </Col>
                        <Col sm={2}>
                            <Ripple
                                onPress={() => this.reset(true)}>
                                <Image
                                    style={styles.record_audio_icon}
                                    source={require('../../../assets/icons/record_audio.png')}
                                />
                            </Ripple>
                        </Col>
                    </Row>
                </CardView>
                <View style={styles.record_view}>
                    <View style={styles.record_audio_input_container}>
                        <View style={styles.record_audio_input_card_view}>
                            <CardView
                                style={styles.record_audio_card_container}
                                cardElevation={10}
                                cardMaxElevation={5}
                                cornerRadius={10}>
                                <View style={styles.record_audio_icon_view}>
                                    <Image
                                        style={styles.record_audio_search_icon}
                                        source={require('../../../assets/icons/ic_search.png')}
                                    />
                                </View>
                                <View style={styles.record_audio_input_view}>
                                    <TextInput
                                        style={styles.record_audio_text_input}
                                        underlineColorAndroid="transparent"
                                        placeholder="Search here"
                                        autoCapitalize="none"
                                        onChangeText={this.filterRecordFiles}
                                    />
                                </View>
                            </CardView>
                        </View>
                    </View>
                    <View
                        style={
                            this.state.filter_recording_list && this.state.filter_recording_list.length > 0
                                ? { display: 'none' }
                                : {
                                    flex: 1,
                                    justifyContent: 'center',
                                }
                        }>
                        <Text style={styles.record_audio_no_result_label}>
                            Sorry, no recordings found
                        </Text>
                    </View>
                    <View style={styles.record_audio_list_view}>
                        <FlatList
                            style={styles.record_audio_list}
                            data={
                                this.state.filter_recording_list && this.state.filter_recording_list.length > 0
                                    ? this.state.filter_recording_list
                                    : null
                            }
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Ripple
                                    key={item.path}
                                    onPress={() => this.openAudioLink(item.path)}>

                                    <Row size={12}>
                                        <Col sm={2}>
                                            <Image style={styles.record_audio_list_icon_view} source={require('../../../assets/icons/headset.png')} />
                                        </Col>
                                        <Col sm={8}>
                                            <View style={styles.record_audio_list_container}>
                                                <View style={styles.record_audio_list_item_container}>
                                                    <View style={styles.record_audio_subject_view}>
                                                        <Text style={styles.record_audio_subject_txt} numberOfLines={1}>
                                                            {item.fileName}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.record_audio_start_date_view}>
                                                        <Text style={styles.record_audio_start_date_txt}>{item.timeStamp}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </Col>
                                    </Row>
                                </Ripple>
                            )}
                        />
                    </View>
                </View>
                <Dialog
                    visible={this.state.record_dialog_visible}
                    title="Record Audio"
                    titleStyle={styles.record_audio_title}
                    dialogStyle={styles.record_dialog}
                    keyboardShouldPersistTaps="never">
                    <ScrollView style={styles.record_dialog_view} showsVerticalScrollIndicator={false}>
                        <View style={styles.record_audio_save_view}>
                            <CardView
                                style={styles.record_file_name_card_container}
                                cardElevation={5}
                                cardMaxElevation={5}
                                cornerRadius={10}>
                                <TextInput
                                    style={styles.record_file_name_input}
                                    underlineColorAndroid="transparent"
                                    placeholder="Type file name here"
                                    autoCapitalize="none"
                                    onChangeText={this.handleSearch}>
                                    {this.state.record_file_name}</TextInput>
                            </CardView>
                        </View>
                        <View style={styles.record_image_view}>
                            <Image
                                style={styles.record_audio_image_view}
                                source={require('../../../assets/icons/record_icon.png')}
                            />
                        </View>
                        <View style={styles.record_timer_view}>
                            <CountDown
                                until={this.state.record_timer}
                                running={this.state.record_timer_running}
                                size={25}
                                onFinish={() => this.stopRecord()}
                                digitStyle={{ backgroundColor: '#FFF' }}
                                digitTxtStyle={{ color: '#000', fontFamily: 'Roboto-Medium' }}
                                timeToShow={['M', 'S']}
                                timeLabels={{ m: null, s: null }}
                                separatorStyle={{ color: '#000' }}
                                timeLabels={{ m: null, s: null }}
                                showSeparator
                            />
                        </View>
                        <View style={styles.record_audio_footer_view}>
                            <TouchableOpacity
                                style={this.state.record_style_state ? styles.record_audio_stop_btn_mview : styles.record_audio_btn_mview}
                                onPress={() => this.updateRecordBtn(!this.state.record_style_state)}>
                                <View style={styles.record_audio_btn_label_view}>
                                    <Text style={styles.record_audio_btn_label}> {this.state.record_style_state ? 'Stop Recording' : 'Start Recording'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.record_audio_cancel_footer_view}>
                            <TouchableOpacity
                                style={styles.record_audio_cancel_btn_mview}
                                onPress={() => this.reset(false)}>
                                <View style={styles.record_audio_btn_label_view}>
                                    <Text style={styles.record_audio_btn_label}>Cancel Recording </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Dialog>
            </View>
        )
    }
}
