import React, { Component } from 'react';
import { View, Text, FlatList, BackHandler, SafeAreaView, TextInput, Image } from 'react-native';
import CardView from 'react-native-cardview';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import { fetchAnnouncement, loadAnnouncementFromFirebase } from '../../actions';
import Ripple from 'react-native-material-ripple';
import styles from '../../styles/search/SearchStyles';
import SubscribeTopics from './SubscribeTopics';
import AnnouncementRealmServices from '../../Realm/AnnouncementRealm';
import moment from 'moment';
import { connect } from 'react-redux';
import { Utils } from '../utils/Utils';

class AnnouncementComponent extends Component {

    constructor(props) {
        super(props);

        var announcement = AnnouncementRealmServices.findAll()
        var result = Utils.currentUser();

        this.state = {
            user: result[0],
            announcementList: announcement,
            announcementData: announcement,
            topicModal: false,
            topics: ''
        }
        this.closeTopicDialog = this.closeTopicDialog.bind(this)
        this.subscribe = this.subscribe.bind(this)
        this.updateCheck = this.updateCheck.bind(this)
    }

    componentDidMount() {
        this.loadTopics()
        this.loadFromFirebase()
    }

    handleSearch = searchText => {

        let filteredData = this.state.announcementList.filter(function (item) {

            return (
                item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                item.body.toLowerCase().includes(searchText.toLowerCase()) ||
                item.topic.toLowerCase().includes(searchText.toLowerCase())
            );
        });

        this.setState({ announcementData: filteredData });
    };

    showAnnouncement(item) {
        console.log("showAnnouncement -- " + JSON.stringify(item))
        this.props.navigation.navigate('AnnoucementDetails', { name: 'AnnoucementDetails', key: item })
    }

    loadFromFirebase() {
        this.props.loadAnnouncementFromFirebase(this.state.user)
    }

    loadTopics() {
        var topics = []
        database().ref('Topics').once('value', querySnapshot => {

            Object.values(querySnapshot.val()).map((topic, index) => {

                var topicRef = database().ref('Users')
                    .child(this.state.user.id)
                    .child('topics')
                    .child(topic.tag);
                topicRef.once('value', snapShot => {
                    var tp = snapShot.val() ? JSON.parse(JSON.stringify(snapShot.val())).subscribe : false

                    if (topic.tag != 'all') {
                        topics.push({
                            tag: topic.tag,
                            subscribe: tp
                        })
                    }

                    if (index == querySnapshot.numChildren() - 1) {
                        this.setState({
                            topics: topics,
                        })
                    }
                })
            })
        })
    }

    subscribe() {
        this.setState({
            topicModal: false
        })

        var topics = [...this.state.topics]

        Object.values(topics).map((topic, index) => {

            if (topic.subscribe) {
                messaging().subscribeToTopic(topic.tag).
                    then((data) => {
                        console.log("Success - subscribeToTopic = " + JSON.stringify(data))
                    }).catch((error) => {
                        console.log("Error - subscribeToTopic = " + JSON.stringify(error))
                    });
            } else {
                messaging().unsubscribeFromTopic(topic.tag).
                    then((data) => {
                        console.log("Success - unsubscribeFromTopic = " + JSON.stringify(data))
                    }).catch((error) => {
                        console.log("Error - unsubscribeFromTopic = " + JSON.stringify(error))
                    });
            }

            database().ref('Users')
                .child(this.state.user.id)
                .child('topics')
                .child(topic.tag)
                .set({
                    tag: topic.tag,
                    subscribe: topic.subscribe
                }).then((data) => {
                    console.log("Success Topic Firebase Updated == " + JSON.stringify(data))
                    handleTopicClose(topic.value)
                }).catch((error) => {
                    console.log("Error Topic Firebase Updated === " + JSON.stringify(error))
                })

            this.loadFromFirebase()
        })
    }

    updateCheck(item) {
        var topics = [...this.state.topics]
        let index = this.state.topics.findIndex(el => el.tag === item.tag);
        topics[index] = {
            tag: item.tag,
            subscribe: !item.subscribe
        }
        this.setState({
            topics: topics
        })
    }

    openTopicDialog() {
        this.setState({
            topicModal: true
        })
    }

    closeTopicDialog(value) {
        this.setState({
            topicModal: value
        })
    }

    render() {

        return (
            <View style={styles.announcement_container}>
                <CardView
                    style={styles.announcement_header_container}
                    cardElevation={2}
                    cardMaxElevation={2}>
                    <Row size={12}>
                        <Col sm={1}>                        
                        </Col>
                        <Col sm={8}>
                            <Text style={styles.announcement_header_label}>News</Text>
                        </Col>
                        <Col sm={3}>
                            <Ripple
                                onPress={() => this.openTopicDialog()}>
                                <View style={styles.topic_choose_view}>
                                    <Image
                                        style={styles.topic_menuBtn}
                                        source={require('../../../assets/icons/topics.png')}
                                    />
                                </View>
                            </Ripple>

                            <SubscribeTopics
                                isVisible={this.state.topicModal}
                                topics={this.state.topics}
                                subscribe={this.subscribe}
                                updateCheck={this.updateCheck}
                                closeTopicDialog={this.closeTopicDialog}
                            />

                        </Col>
                    </Row>
                </CardView>
                <View style={styles.announcement_view}>
                    <View style={styles.announcement_input_container}>
                        <View style={styles.announcement_input_card_view}>
                            <CardView
                                style={styles.announcement_card_container}
                                cardElevation={10}
                                cardMaxElevation={5}
                                cornerRadius={10}>
                                <View style={styles.announcement_icon_view}>
                                    <Image
                                        style={styles.announcement_icon}
                                        source={require('../../../assets/icons/ic_search.png')}
                                    />
                                </View>
                                <View style={styles.announcement_input_view}>
                                    <TextInput
                                        style={styles.announcement_text_input}
                                        underlineColorAndroid="transparent"
                                        placeholder="Search here"
                                        autoCapitalize="none"
                                        onChangeText={this.handleSearch}
                                    />
                                </View>
                            </CardView>
                        </View>
                    </View>
                    <View
                        style={
                            this.state.announcementData && this.state.announcementData.length > 0
                                ? { display: 'none' }
                                : {
                                    flex: 1,
                                    justifyContent: 'center',
                                }
                        }>
                        <Text style={styles.announcement_no_result_label}>
                            Sorry, no announcements found
                        </Text>
                    </View>
                    <SafeAreaView style={styles.announcement_list_view}>

                        <FlatList
                            style={styles.announcement_list}
                            data={
                                this.state.announcementData && this.state.announcementData.length > 0
                                    ? this.state.announcementData
                                    : null
                            }
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => (

                                <Ripple
                                    key={index}
                                    onPress={() => this.showAnnouncement(item)}>
                                    <Row size={16}>
                                        <Col sm={14}>
                                            <CardView
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    marginLeft: 30,
                                                    margin: 10,
                                                    backgroundColor: "#fff",
                                                }}
                                                cardElevation={10}
                                                cardMaxElevation={5}>
                                                <View style={styles.announcement_list_container}>
                                                    <View style={styles.announcement_list_item_container}>
                                                        <View style={styles.announcement_title_view}>
                                                            <Text style={styles.announcement_title_txt}>
                                                                {item.title}
                                                            </Text>
                                                        </View>
                                                        {item.image != 'no image' && item.image.length > 0 &&
                                                            <View style={styles.announcement_image_view}>
                                                                <Image source={{ uri: item.image }} style={styles.icon_style_logo} />
                                                            </View>
                                                        }
                                                        <View style={styles.announcement_small_text_view}>
                                                            <Text style={styles.announcement_small_text_txt}>{item.smallText}</Text>
                                                        </View>
                                                        <View style={styles.announcement_topic_view}>
                                                            <Row size={12}>
                                                                <Col sm={10}>
                                                                    <Text style={styles.announcement_time_txt}>{moment(item.time).format("MMM")} {moment(item.time).format("DD")}, {moment(item.time).format("YYYY")}</Text>
                                                                </Col>
                                                                <Col sm={2}>
                                                                    <View style={styles.announcement_topic_label_view}>
                                                                        <Text style={styles.announcement_topic_txt}>{item.topic}</Text>
                                                                    </View>
                                                                </Col>
                                                            </Row>

                                                        </View>
                                                    </View>
                                                </View>
                                            </CardView>
                                        </Col>
                                    </Row>
                                </Ripple>
                            )}
                        />
                    </SafeAreaView>
                </View>
            </View>
        )
    }
}

const dispatchProps = dispatch => ({
    fetchAnnouncement: () => dispatch(fetchAnnouncement()),
    loadAnnouncementFromFirebase: (params) => dispatch(loadAnnouncementFromFirebase(params))
});

const stateProps = state => ({
    fetchAnnouncementPayload: state.fetchAnnouncementPayload,
    loadFBAnnoucements: state.loadFBAnnoucements
});
export default connect(stateProps, dispatchProps)(AnnouncementComponent);