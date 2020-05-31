import React, { Component } from 'react';
import { View, Text, FlatList, Image, Alert, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Dialog } from 'react-native-simple-dialogs';
import styles from '../../styles/createplanner/CreatePlannerStyles';
import CardView from 'react-native-cardview';
import Ripple from 'react-native-material-ripple';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import CheckBox from 'react-native-check-box';
import { Utils } from '../utils/Utils';

export default class AddPeopleComponent extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (

            <Dialog
                visible={this.props.isVisible}
                title="Add People"
                titleStyle={styles.add_people_title}
                dialogStyle={styles.add_people_dialog}
                onTouchOutside={() => this.props.closePeopleDialog(false)}
                keyboardShouldPersistTaps="never">
                <View style={styles.add_people_view}>
                    <View style={styles.searchInputContainer}>
                        <View style={styles.searchCardView}>
                            <CardView
                                style={styles.searchCardContainer}
                                cardElevation={10}
                                cardMaxElevation={5}
                                cornerRadius={10}>
                                <View style={styles.searchIconView}>
                                    <Image
                                        style={styles.searchIcon}
                                        source={require('../../../assets/icons/ic_search.png')}
                                    />
                                </View>
                                <View style={styles.searchTextInputView}>
                                    <TextInput
                                        style={styles.searchTextInput}
                                        underlineColorAndroid="transparent"
                                        placeholder="Type student name here"
                                        autoCapitalize="none"
                                        onChangeText={this.props.handleSearch}
                                    />
                                </View>
                            </CardView>
                        </View>
                    </View>
                    <View
                        style={
                            this.props.filteredData && this.props.filteredData.length > 0
                                ? { display: 'none' }
                                : {
                                    flex: 1,
                                    marginTop: 50,
                                    justifyContent: 'center',
                                }
                        }>
                        <Text style={styles.searchPlaceNoResultLabel}>
                            Sorry, no results found
                        </Text>
                    </View>
                    <View style={styles.add_people_list_view}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {this.props.isVisible === true &&
                                <FlatList
                                    style={styles.add_people_list}
                                    data={
                                        this.props.filteredData && this.props.filteredData.length > 0
                                            ? this.props.filteredData
                                            : null
                                    }
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <Ripple
                                            key={item.email}
                                            onPress={() => (this.props.total_invite_attendees > Utils.MAXIMUM_ATTENDEES && item.isChecked === false) ? Alert.alert('Info', Utils.ERROR_MSG_ATTENDEES_LIMIT) : this.props.updateCheck(item)}>

                                            {this.props.user.email !== item.email &&
                                                <Row size={12}>
                                                    <Col sm={2}>
                                                        <View style={styles.add_people_checkbox_view}>
                                                            <CheckBox onClick={() => {
                                                                this.props.user.email != item.email ? this.props.updateCheck(item) : console.log("Current User")
                                                            }}
                                                                isChecked={item.isChecked} />
                                                        </View>
                                                    </Col>
                                                    <Col sm={8}>
                                                        <View style={styles.add_people_list_container}>
                                                            <View style={styles.add_people_icon_view}>
                                                                {item.photo &&
                                                                    <Image style={styles.add_people_icon} source={{ uri: item.photo }} />
                                                                }
                                                                {!item.photo &&
                                                                    <Image style={styles.add_people_icon} source={require('../../../assets/icons/ic_person.png')} />
                                                                }
                                                            </View>
                                                            <View style={styles.add_people_list_item_container}>
                                                                <View style={styles.add_people_name_view}>
                                                                    <Text style={styles.add_people_name} numberOfLines={1}>
                                                                        {item.name}
                                                                    </Text>
                                                                </View>
                                                                <View style={styles.add_people_email_View}>
                                                                    <Text style={styles.add_people_email}>{item.email}</Text>
                                                                </View>
                                                            </View>

                                                        </View>
                                                    </Col>
                                                </Row>
                                            }
                                        </Ripple>
                                    )}
                                />
                            }
                        </ScrollView>
                    </View>
                    <View style={styles.add_people_footer_view}>
                        <Row size={13}>
                            <Col sm={8}>
                            </Col>
                            <Col sm={5}>
                                <TouchableOpacity
                                    style={styles.add_people_done_btn_mview}
                                    onPress={() => this.props.closePeopleDialog(false)}>
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