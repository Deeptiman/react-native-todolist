import React, { Component } from 'react';
import { View, Text, BackHandler, ScrollView, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import CardView from 'react-native-cardview';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import Ripple from 'react-native-material-ripple';
import styles from '../../styles/search/SearchStyles';
import HTMLView from 'react-native-htmlview';
import moment from 'moment';
import { Utils } from '../utils/Utils';

export default class AnnouncementDetails extends Component {

    constructor(props) {
        super(props);

        const announcement = this.props.navigation.state.params.key;

        console.log("Announcement Details :: " + announcement)

        this.state = {
            announcement: announcement,
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
            console.log("goBack >>>>>>")
            this.props.navigation.navigate(Utils.DASHBOARD_SCREEN)
            return true;
        }
        return false;
    }

    render() {

        console.log("Announcement Details --- " + JSON.stringify(this.state.announcement))

        var item = JSON.parse(JSON.stringify(this.state.announcement))

        return (
            <View style={styles.announcement_details_container}>
                <CardView
                    style={styles.announcement_header_container}
                    cardElevation={2}
                    cardMaxElevation={2}>
                    <Row size={12}>
                        <Col sm={2}>
                            <Ripple
                                onPress={() => this.props.navigation.navigate(Utils.DASHBOARD_SCREEN)}>
                                <Image
                                    style={styles.announcement_back_icon}
                                    source={require('../../../assets/icons/close.png')}
                                />
                            </Ripple>
                        </Col>
                        <Col sm={7}>

                        </Col>
                    </Row>
                </CardView>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.announcement_view}>
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
                                                <Text style={styles.announcement_title_txt} numberOfLines={1}>
                                                    {item.title}
                                                </Text>
                                            </View>
                                            {item.image != 'no image' && item.image.length > 0 &&
                                                <View style={styles.announcement_image_view}>
                                                    <Image source={{ uri: item.image }} style={styles.icon_style_logo} />
                                                </View>
                                            }
                                            <View style={styles.announcement_detail_text_view}>
                                                <HTMLView value={item.body} stylesheet={htmlStyles} />
                                            </View>
                                            <View style={styles.announcement_topic_view}>
                                                <Row size={12}>
                                                    <Col sm={10}>
                                                        <Text style={styles.announcement_small_text_txt}>{moment(item.time).format("MMM")} {moment(item.time).format("DD")}, {moment(item.time).format("YYYY")}</Text>
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
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const htmlStyles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
});