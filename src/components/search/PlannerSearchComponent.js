import React, { Component } from 'react';
import { View, Text, FlatList, SafeAreaView, BackHandler, TextInput, Image } from 'react-native';
import CardView from 'react-native-cardview';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import PlannerServices from '../../Realm/PlannerRealm';
import Ripple from 'react-native-material-ripple';
import styles from '../../styles/search/SearchStyles';
import moment from 'moment';
import { Utils } from '../utils/Utils';

export default class PlannerSearchComponent extends Component {

    constructor(props) {
        super(props);
        const startDate = this.props.navigation.state.params.key;

        var planners = startDate === Utils.ALL_PLANNERS ? PlannerServices.findAll() : PlannerServices.findAllByStartDate(startDate)
        var result = Utils.currentUser()

        this.state = {
            plannerList: planners,
            filteredPlannerData: planners,
            user: result[0],
            startDate: startDate,
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
            this.props.navigation.navigate(Utils.DASHBOARD_SCREEN)
            return true;
        }
        return false;
    }

    handleSearch = searchText => {
        this.setState({ query: searchText });

        let filteredData = this.state.plannerList.filter(function (item) {
            return (
                item.subject.toLowerCase().includes(searchText.toLowerCase())
            );
        });

        this.setState({ filteredPlannerData: filteredData });
    };

    checkEventByDate(event) {
        this.props.navigation.navigate(Utils.SHOW_EVENT_SCREEN, { name: Utils.SHOW_EVENT_SCREEN, key: event, flag: 1, list: this.state.startDate === Utils.ALL_PLANNERS ? 0 : 1 })
        console.log("Event Details ---> " + JSON.stringify(event))
    }

    render() {
        console.log("Search Filter Planner List ---> " + JSON.stringify(this.state.filteredPlannerData))

        return (
            <View style={styles.planner_container}>
                <CardView
                    style={styles.search_planner_header_container}
                    cardElevation={2}
                    cardMaxElevation={2}>
                    <Row size={12}>
                        <Col sm={2}>
                            <Ripple
                                onPress={() => this.props.navigation.navigate(Utils.DASHBOARD_SCREEN)}>
                                <Image
                                    style={styles.search_planner_back_icon}
                                    source={require('../../../assets/icons/ic_black_back_icon.png')}
                                />
                            </Ripple>
                        </Col>
                        <Col sm={7}>
                            <Text style={styles.search_planner_header_label}>Planner Search</Text>
                        </Col>
                    </Row>
                </CardView>

                <View style={styles.search_planner_view}>
                    <View style={styles.search_planner_input_container}>
                        <View style={styles.search_input_card_view}>
                            <CardView
                                style={styles.search_card_container}
                                cardElevation={10}
                                cardMaxElevation={5}
                                cornerRadius={10}>
                                <View style={styles.search_planner_icon_view}>
                                    <Image
                                        style={styles.search_planner_icon}
                                        source={require('../../../assets/icons/ic_search.png')}
                                    />
                                </View>
                                <View style={styles.search_text_input_view}>
                                    <TextInput
                                        style={styles.search_planner_text_input}
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
                            this.state.filteredPlannerData && this.state.filteredPlannerData.length > 0
                                ? { display: 'none' }
                                : {
                                    flex: 1,
                                    justifyContent: 'center',
                                }
                        }>
                        <Text style={styles.search_planner_no_result_label}>
                            Sorry, no planners found
                        </Text>
                    </View>
                    <SafeAreaView style={styles.search_planner_list_view}>

                        <FlatList
                            style={styles.search_planner_list}
                            data={
                                this.state.filteredPlannerData && this.state.filteredPlannerData.length > 0
                                    ? this.state.filteredPlannerData
                                    : null
                            }
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => (

                                <Ripple
                                    key={item.startDate}
                                    onPress={() => this.checkEventByDate(item)}>
                                    <Row size={16}>
                                        <Col sm={2}>
                                            {console.log("Item -- " + item.hexCode)}
                                            {index == 0 &&
                                                <View>
                                                    <View style={styles.section_event_date_view}>
                                                        <Text style={styles.section_start_date_txt}>{moment(item.startDate).format("DD")}</Text>
                                                    </View>
                                                    <View style={styles.section_event_month_view}>
                                                        <Text style={styles.section_start_month_txt}>{moment(item.startDate).format("MMM")}</Text>
                                                    </View>
                                                </View>
                                            }

                                            {index > 0 && item.startDate != this.state.filteredPlannerData[Object.keys(this.state.filteredPlannerData)[index - 1]].startDate &&
                                                <View>
                                                    <View style={styles.section_event_date_view}>
                                                        <Text style={styles.section_start_date_txt}>{moment(item.startDate).format("DD")}</Text>
                                                    </View>
                                                    <View style={styles.section_event_month_view}>
                                                        <Text style={styles.section_start_month_txt}>{moment(item.startDate).format("MMM")}</Text>
                                                    </View>
                                                </View>
                                            }
                                        </Col>
                                        <Col sm={14}>
                                            <CardView
                                                style={{
                                                    width: '90%',
                                                    height: 'auto',
                                                    margin: 10,
                                                    backgroundColor: item.hexCode,
                                                }}
                                                cardElevation={10}
                                                cardMaxElevation={5}>
                                                <View style={styles.search_planner_list_container}>
                                                    <View style={styles.search_planner_list_item_container}>
                                                        <View style={styles.search_planner_subject_view}>
                                                            <Text style={styles.search_planner_subject_txt} numberOfLines={1}>
                                                                {item.subject}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.search_planner_start_date_view}>
                                                            <Text numberOfLines={1} style={styles.search_planner_start_date_txt}>{item.startTime}  {item.startDate === item.endDate && item.endTime} at {item.location}</Text>
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