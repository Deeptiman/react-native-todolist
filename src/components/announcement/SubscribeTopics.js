import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Dialog } from 'react-native-simple-dialogs';
import styles from '../../styles/createplanner/CreatePlannerStyles';
import Ripple from 'react-native-material-ripple';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import CheckBox from 'react-native-check-box';

export default class SubscribeTopics extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        console.log("Topics >>> " + JSON.stringify(this.props.topics))

        Object.values(this.props.topics).map((topic, index) => {
            console.log("Load Topic :: " + topic.tag)
        });

        var topics = this.props.topics

        return (
            <Dialog
                visible={this.props.isVisible}
                title="Topics"
                titleStyle={styles.topic_title}
                onTouchOutside={() => this.props.closeTopicDialog(false)}
                dialogStyle={styles.add_topic_dialog}
                keyboardShouldPersistTaps="never">
                <View style={styles.topic_view}>

                    <ScrollView  style={styles.add_people_list_view} 
                    showsVerticalScrollIndicator={false}>
                        <View>
                            {
                                <FlatList
                                    style={styles.add_people_list}
                                    data={
                                        topics && topics.length > 0
                                            ? topics
                                            : null
                                    }
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => (
                                        <Ripple
                                            key={index}
                                            style={styles.topic_item_view}
                                            onPress={() => this.props.updateCheck(item)}>
                                            <Row size={12}>
                                                <Col sm={1}>
                                                    <View style={styles.add_people_checkbox_view}>
                                                        <CheckBox onClick={() => {
                                                            this.props.updateCheck(item)
                                                        }}
                                                            isChecked={item.subscribe}
                                                        />
                                                    </View>
                                                </Col>
                                                <Col sm={8}>
                                                    <View style={styles.topic_list_container}>

                                                        <View style={styles.topic_name_view}>
                                                            <Text style={styles.topic_name} numberOfLines={1}>
                                                                {item.tag}
                                                            </Text>
                                                        </View>

                                                    </View>
                                                </Col>
                                            </Row>
                                        </Ripple>
                                    )}
                                />
                            }
                        </View>
                    </ScrollView>
                    <View style={styles.topic_footer_view}>
                        <Row size={13}>
                            <Col sm={8}>
                            </Col>
                            <Col sm={5}>
                                <TouchableOpacity
                                    style={styles.topic_done_btn_mview}
                                    onPress={() => this.props.subscribe()}>
                                    <View style={styles.add_people_done_label_view}>
                                        <Text style={styles.add_people_done_label}>Done </Text>
                                    </View>
                                </TouchableOpacity>
                            </Col>
                        </Row>
                    </View>
                </View>
            </Dialog>
        )
    }
}