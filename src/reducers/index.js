import {combineReducers} from 'redux';

import actionTypeReducer from '../reducers/actionTypeReducers';
import fetchPlannerReducer from '../reducers/fetchPlannerReducers';
import appLoginReducer from '../reducers/appLoginReducers';
import addPlannerReducer from  '../reducers/addPlannerReducers';
import fetchMicrosoftPlannerReducer from '../reducers/fetchMicrosoftPlannerReducers';
import fetchFirebasePlannerReducer from '../reducers/fetchFirebasePlannerReducers';
import fetchGoogleCalendarReducer from '../reducers/fetchGoogleCalendarReducers';
import fetchStudentsListReducer from '../reducers/fetchStudentsListReducers';
import fetchAnnouncementReducer from '../reducers/fetchAnnouncementReducers';
import fetchFBAnnouncementReducer from '../reducers/loadAnnoucements'
import grantGoogleDrivePermissionReducer from '../reducers/grantGoogleDrivePermission';
import uploadFilesGoogleDriveReducer from '../reducers/uploadFilesGoogleDrive';
import createPlannerReducer from '../reducers/createPlannerReducers';
import createFirebasePlannerReducer from '../reducers/createFirebasePlannerReducers';
import createGooglePlannerReducer from '../reducers/createGooglePlannerReducers';
import createMicrosoftPlannerReducer from '../reducers/createMicrosoftPlannerReducers';

const rootReducer = combineReducers({
    actionType: actionTypeReducer,
    plannerList: fetchPlannerReducer,
    appLoginPayload: appLoginReducer,
    addPlannerPayload: addPlannerReducer,
    firebasePlannerList: fetchFirebasePlannerReducer,
    googlePlannerList: fetchGoogleCalendarReducer,
    microsoftPlannerList: fetchMicrosoftPlannerReducer,
    fetchStudentsListPayload: fetchStudentsListReducer,
    loadFBAnnoucements: fetchFBAnnouncementReducer,
    fetchAnnouncementPayload: fetchAnnouncementReducer,
    grantDrivePermissionState: grantGoogleDrivePermissionReducer,
    uploadDriveAttachment: uploadFilesGoogleDriveReducer,
    plannerCallback: createPlannerReducer,
    createFirebasePlannerPayload: createFirebasePlannerReducer,
    createGooglePlannerPayload: createGooglePlannerReducer,
    createMicrosoftPlannerPayload: createMicrosoftPlannerReducer,
});

export default rootReducer;