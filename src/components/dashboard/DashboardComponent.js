import React from 'react';
import { View, Image} from 'react-native';
import { createAppContainer} from 'react-navigation';  
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';  

import Calendar from '../calendar/CalendarComponent';
import CreatePlanner from '../createplanner/CreatePlannerComponent';
import Announcement from '../announcement/Announcement';
import Settings from '../settings/SettingsComponent';

import styles from '../../styles/dashboard/DashboardStyles';

const TabNavigator = createMaterialBottomTabNavigator({  
        Calendar: { screen: Calendar,  
            navigationOptions:{  
                tabBarLabel:'Calendar',  
                tabBarIcon: ({ tintColor }) => (  
                    <View>  
                        <Image 
                            style={styles.tab_icon}
                            source={require('../../../assets/icons/ic_calendar.png')}/>
                    </View>),  
            }  
        },  
        CreatePlanner: { screen: CreatePlanner,  
            navigationOptions:{  
                tabBarLabel:'Create Planner',  
                tabBarIcon: ({ tintColor }) => (  
                    <View>  
                        <Image 
                            style={styles.tab_icon}
                            source={require('../../../assets/icons/ic_note_add.png')}/> 
                    </View>),  
                barStyle: { backgroundColor: '#000' },  
            }  
        },  
        Announcement: { screen: Announcement,  
            navigationOptions:{  
                tabBarLabel:'News',  
                tabBarIcon: ({ tintColor }) => (  
                    <View>  
                        <Image 
                            style={styles.tab_icon}
                            source={require('../../../assets/icons/ic_announcement.png')}/>  
                    </View>),  
                barStyle: { backgroundColor: '#000' },  
            }  
        },                 
        Settings: {  
            screen: Settings,  
            navigationOptions:{  
                tabBarLabel:'Settings',  
                tabBarIcon: ({ tintColor }) => (  
                    <View>  
                         <Image 
                            style={styles.tab_icon}
                            source={require('../../../assets/icons/ic_settings.png')}/> 
                    </View>),  
            }  
        },  
    },  
    {  
      initialRouteName: "Calendar",  
      barStyle: { backgroundColor: '#000' },  
    },  
);  
  
export default createAppContainer(TabNavigator); 