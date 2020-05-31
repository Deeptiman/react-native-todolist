import React, { Component } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import LoginScreen from './src/components/login/LoginComponent';
import SignupScreen from './src/components/login/SignupComponent';
import Setup from './src/components/setup/SetupComponent';
import Dashboard from './src/components/dashboard/DashboardComponent';
import CreatePlanner from './src/components/createplanner/CreatePlannerComponent';
import EventDetails from './src/components/calendar/EventDetailsComponent';
import Record from './src/components/record/RecordComponent';
import Search from './src/components/search/PlannerSearchComponent';
import Announcement from './src/components/announcement/Announcement';
import AnnoucementDetails from './src/components/announcement/AnnouncementDetails';
import Message from './src/components/message/MessageComponent';

import { Provider } from 'react-redux';
import store from './src/store';

const MainNavigator = createSwitchNavigator(
  {
    Login: { screen: LoginScreen },
    Signup: { screen: SignupScreen },
    Setup: { screen: Setup },
    Dashboard: { screen: Dashboard },
    CreatePlanner: { screen: CreatePlanner },
    Record: { screen: Record },
    Message: { screen: Message },
    Event: { screen: EventDetails },
    Search: { screen: Search },
    Announcement: { screen: Announcement },
    AnnoucementDetails: { screen: AnnoucementDetails }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const AppContainer = createAppContainer(MainNavigator);

export default class App extends Component {

  render() {
    return <Provider store={store}>
      <AppContainer />
    </Provider>
  }

}
