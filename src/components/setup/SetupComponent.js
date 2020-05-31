import React, { Component } from 'react';
import { View, Text, StatusBar, Image } from 'react-native';
import AuthRealmServices from '../../Realm/AuthRealm';
import styles from '../../styles/search/SearchStyles';
import { connect } from 'react-redux';
import { fetchGooglePlanner, fetchMicrosoftPlanner, fetchFirebasePlanner } from '../../actions';
import * as Progress from 'react-native-progress';

import { Utils } from '../utils/Utils';

class SetupComponent extends Component {

    constructor(props) {
        super(props);

        var result = Utils.currentUser()
        console.log("Current User <<<< "+result[0].loginType)
        this.state = {
            user: result[0],
            eventProgress: '',
            currentProgress: 0,
            totalItems: 0,
            animateProgress: 0,
            progress: 0,
            indeterminate: true,
        }
    }

    componentDidMount() {
        console.log("ComponentDidMount ....... ")
        this.loadPlanners()
    }

    componentDidUpdate(previousProps, previousState) {

        var parsePrevProgress = 0;
        var parseCurrentProgress = 0;

        if (this.state.user.loginType === Utils.MICROSOFT_LOGIN_TYPE) {
            parsePrevProgress = JSON.parse(JSON.stringify(previousProps.microsoftPlannerList)).microsoftPlannerList
            parseCurrentProgress = JSON.parse(JSON.stringify(this.props.microsoftPlannerList)).microsoftPlannerList
        } else if (this.state.user.loginType === Utils.GOOGLE_LOGIN_TYPE) {
            parsePrevProgress = JSON.parse(JSON.stringify(previousProps.googlePlannerList)).googlePlannerList
            parseCurrentProgress = JSON.parse(JSON.stringify(this.props.googlePlannerList)).googlePlannerList
        } else if (Utils.nonSocialLogin(this.state.user.loginType)) {
            parsePrevProgress = JSON.parse(JSON.stringify(previousProps.firebasePlannerList)).firebasePlannerList
            parseCurrentProgress = JSON.parse(JSON.stringify(this.props.firebasePlannerList)).firebasePlannerList
        }

        if (parsePrevProgress.parseId !== parseCurrentProgress.parseId) {

            this.setState({
                eventProgress: parseCurrentProgress.eventId,
                currentProgress: parseCurrentProgress.parseId,
                indeterminate: false,
                totalItems: parseCurrentProgress.totalPlanners - 1,
            })
        }
    }

    animate() {
        let progress = 0;
        this.setState({
            animateProgress: progress
        });
        setTimeout(() => {
            this.setState({ indeterminate: false });
            setInterval(() => {
                progress += Math.random() / 2;
                if (progress > 1) {
                    progress = 1;
                }

                this.setState({
                    animateProgress: progress
                });
            }, 500);
        }, 1500);
    }

    loadPlanners() {
        console.log("loadPlanners - " + this.state.user.email)
        this.animate()
        if (this.state.user.loginType === Utils.MICROSOFT_LOGIN_TYPE) {
            this._getMicrosoftCalendar(this.state.user)
        } else if (this.state.user.loginType === Utils.GOOGLE_LOGIN_TYPE) {
            this._getGoogleCalendar(this.state.user)
        } else if (Utils.nonSocialLogin(this.state.user.loginType)) {
            this._getFirebaseCalendar(this.state.user)
        }
    }

    _getGoogleCalendar = async (params) => {
        //console.log("Get Google Planner --> " + JSON.stringify(params))
        this.props.fetchGooglePlanner(params);
    }

    _getMicrosoftCalendar = async (params) => {
        //console.log("Get Microsoft Planner --> " + JSON.stringify(params))
        this.props.fetchMicrosoftPlanner(params);
    }

    _getFirebaseCalendar = async (params) => {
        //console.log("Get Firebase Planner --> " + JSON.stringify(params))
        this.props.fetchFirebasePlanner(params);
    }

    navigateToDashboard() {
        setTimeout(() => {
            AuthRealmServices.updateSyncStatus(this.state.user.email, true)
            this.props.navigation.navigate(Utils.DASHBOARD_SCREEN);
        }, 1000)
    }

    render() {

        if ((this.state.currentProgress > 0 && this.state.currentProgress === this.state.totalItems) ||
            (this.state.animateProgress === 1 && this.state.totalItems === 0)) {

            if (this.props.navigation) {
                this.navigateToDashboard()
            } else {
                this.props.dismissSyncDialog()
            }
        }

        var calType = "";

        if (this.state.user.loginType === Utils.GOOGLE_LOGIN_TYPE) {
            calType = "Google"
        } else if (this.state.user.loginType === Utils.MICROSOFT_LOGIN_TYPE) {
            calType = "Microsoft"
        } else if (Utils.nonSocialLogin(this.state.user.loginType)) {
            calType = "Firebase"
        }

        return (
            <View style={styles.parent_setup_container}>

                <View style={styles.setup_container}>

                    <View style={styles.sync_header_container}>
                        <View style={styles.sync_icon_view}>
                            {this.state.user.loginType === Utils.GOOGLE_LOGIN_TYPE &&
                                <Image source={require('../../../assets/icons/ic_google_plus_logo.png')} style={styles.sync_icon_style_logo} />
                            }
                            {this.state.user.loginType === Utils.MICROSOFT_LOGIN_TYPE &&
                                <Image source={require('../../../assets/icons/ic_microsoft.png')} style={styles.sync_icon_style_logo} />
                            }
                            {(Utils.nonSocialLogin(this.state.user.loginType)) &&
                                <Image source={require('../../../assets/icons/ic_firebase.png')} style={styles.sync_icon_style_logo} />
                            }
                        </View>
                    </View>
                    <View style={styles.sync_label_view}>
                        <Text style={styles.app_label}>Please wait</Text>
                    </View>
                    <View style={styles.sync_label_view}>
                        <Text style={styles.app_label}>Syncing your {calType}  calendar </Text>
                    </View>
                    <View style={styles.sync_label_view}>
                        <Progress.Bar
                            progress={this.state.animateProgress}
                            size={10}
                            indeterminate={this.state.indeterminate}
                            width={200}
                            height={10} />
                    </View>
                </View>
            </View>
        )
    }
}

const dispatchProps = dispatch => ({
    fetchGooglePlanner: (planner) => dispatch(fetchGooglePlanner(planner)),
    fetchMicrosoftPlanner: (planner) => dispatch(fetchMicrosoftPlanner(planner)),
    fetchFirebasePlanner: (planner) => dispatch(fetchFirebasePlanner(planner)),
})

const stateProps = state => ({
    googlePlannerList: state.googlePlannerList,
    microsoftPlannerList: state.microsoftPlannerList,
    firebasePlannerList: state.firebasePlannerList
})

export default connect(stateProps, dispatchProps)(SetupComponent)
