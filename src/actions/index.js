import {
    FETCH_PLANNERS,
    APP_LOGIN,
    FETCH_ANNOUNCEMENT,
    FETCH_FIREBASE_ANNOUNCEMENT,
    FETCH_STUDENTS_LIST,
    FETCH_FIREBASE_PLANNER,
    FETCH_GOOGLE_PLANNER,
    FETCH_MICROSOFT_PLANNER,
    CREATE_MICROSOFT_PLANNER,
    CREATE_PLANNER_CALLBACK
} from './constants';

import database from '@react-native-firebase/database'
import messaging from '@react-native-firebase/messaging'
import PlannerRealmServices from '../Realm/PlannerRealm';
import AnnouncementRealmServices from '../Realm/AnnouncementRealm';
import { GoogleCalendar } from './GoogleCalendar';
import { MicrosoftCalendar } from './MicrosoftCalendar';
import { FirebaseCalendar } from './FirebaseCalendar';
import { AnnouncementHelper } from './AnnouncementHelper';
import { Utils } from '../components/utils/Utils';

//////////////////////// App Login //////////////////////////////////

export const appLoginSuccess = data => ({
    type: APP_LOGIN,
    payload: data,
});

export const appLogin = (userInfo) => dispatch => {

    console.log("Action --> userInfo ==>>> " + JSON.stringify(userInfo));
    console.log("Action --> userInfo ==>>> Id == " + userInfo.id);

    var authRef = database().ref('Users').child(userInfo.id)
    authRef.once('value', snap => {
        if (!snap.exists()) {
            authRef.set({
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                photoURL: userInfo.photo,
                type: userInfo.loginType
            }).then((data) => {
                console.log("Login Users Data === " + data);
                dispatch(appLoginSuccess({ success: true }))
            }).catch((error) => {
                console.log("Error Login User === " + error);
                dispatch(appLoginSuccess({ error: 'Signin Error - ' + error.message }))
            })
        }
    });
};



////////////////////////// Read Students List /////////////////////////////////

export const fetchStudentsListSuccess = data => ({
    type: FETCH_STUDENTS_LIST,
    payload: data
})

export const fetchStudentsList = () => dispatch => {

    var userRef = firebaseDatabase.ref('Users')
    let newUserObject = []
    userRef.on('value', studentSnap => {
        studentSnap.forEach((snap) => {
            var sn = snap.val();
            console.log("Add Email --> " + sn.email)
            newUserObject.push({
                email: sn.email,
                id: sn.id,
                name: sn.name,
                photo: sn.photoURL
            })
        });
    });
    console.log("Dispatch ALL STUDENTS --> " + JSON.stringify(newUserObject))
    dispatch(fetchStudentsListSuccess(newUserObject))
}


////////////////////// Save Firebase Planner /////////////////////////////
export const fetchFirebasePlannerSuccess = data => ({
    type: FETCH_FIREBASE_PLANNER,
    payload: data,
})

export const fetchFirebasePlanner = (params) => async (dispatch) => {

    console.log("fetchFirebasePlanner...")

    await setTimeout(async () => {
        var plannerRef = await database().ref('Users').child(params.id).child("planners")
        await plannerRef.once('value', async (querySnapshot) => {
            var totalPlanners = querySnapshot.numChildren()

            if (totalPlanners === 0) {
                await dispatch(fetchFirebasePlannerSuccess({
                    success: 'No Firebase Planners ',
                    eventId: 'No eventId',
                    parseId: 1,
                    totalPlanners: 1
                }))
            }

            var parseId = 0
            await querySnapshot.forEach(async (snapShot) => {
                await snapShot.forEach(async (snap) => {
                    await FirebaseCalendar.fetchFirebaseCalendar(snap, parseId++, totalPlanners)
                        .then(async (data) => {
                            await dispatch(fetchFirebasePlannerSuccess(data))
                        })
                })
            })
        })
    }, 2000)
}

////////////////////// Save Google Planner ////////////////////////////////////////////////////////

export const fetchGooglePlannerSuccess = data => ({
    type: FETCH_GOOGLE_PLANNER,
    payload: data,
});

export const fetchGooglePlanner = (params) => dispatch => {

    //console.log("Action Fetch Google Planner --> " + JSON.stringify(params))

    var url = Utils.GOOGLE_CALENDAR_URL + params.email + Utils.GOOLE_CALENDAR_GET_EVENTS_ENDPOINT;
    //var url = GOOGLE_CALENDAR_URL + params.email + "/events?singleEvents=true";

    fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': Utils.AUTH_REQUEST_TOKEN + params.accessToken,
        }
    }).then(response => response.json())
        .then(data => {
            var items = JSON.parse(JSON.stringify(data)).items;
            console.log("Google Calendar Response -- "+JSON.stringify(data))
            var totalPlanners = items.length
            items.map(async (cal, index) => {
                await setTimeout(async () => {
                    await GoogleCalendar.parseGoogleCalendarJSON(cal, index, totalPlanners).
                        then((res) => {
                            //console.log("Read Google Calendar - " + JSON.stringify(res))
                            dispatch(fetchGooglePlannerSuccess(res))
                        }).catch((error) => {
                            var msg = JSON.parse(JSON.stringify(error)).error
                            console.log("parseGoogleCalendarJSON Error --> " + msg + " :: " + JSON.stringify(error))
                        })
                }, 2000)
            });
        })
};


///////////////////// Save Microsoft Planner ////////////////////////////////////

export const fetchMicrosoftPlannerSuccess = data => ({
    type: FETCH_MICROSOFT_PLANNER,
    payload: data,
});

export const fetchMicrosoftPlanner = (params) => dispatch => {

    var url = Utils.MICROSOFT_CALENDAR_URL + "/events"

    console.log("fetchMicrosoftPlanner - " + url)
    console.log("accessToken === " + params.accessToken)

    fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': Utils.AUTH_REQUEST_TOKEN + params.accessToken,
        }
    }).then(response => response.json())
        .then(data => {

            var data = JSON.parse(JSON.stringify(data)).value;
            var totalPlanners = data.length

            data.map(async (cal, index) => {
                await setTimeout(async () => {
                    //console.log("Microsoft Cal ---> " + JSON.stringify(cal))
                    await MicrosoftCalendar.parseMicrosoftPlannerJSON(cal, index, totalPlanners).
                        then(async (parseRes) => {

                            var data = JSON.parse(JSON.stringify(parseRes))
                            var eventId = data.eventId
                            console.log("Read Microsoft Calendar - " + eventId + " -- " + index + " == " + totalPlanners + " -- ParseRes >>> " + JSON.stringify(parseRes))
                            dispatch(fetchMicrosoftPlannerSuccess(parseRes))

                            MicrosoftCalendar.getAttachmentsByEventId(params, eventId)
                                .then((res) => {
                                    console.log("getAttachmentsByEventId Success --> " + JSON.stringify(res) + " -- " + index + " == " + totalPlanners + " -- ParseRes >>> " + JSON.stringify(parseRes))
                                }).catch((error) => {
                                    console.log("getAttachmentsByEventId Error --> " + JSON.stringify(error) + " -- " + index + " == " + totalPlanners + " -- ParseRes >>> " + JSON.stringify(parseRes))
                                })
                        }).catch(async (error) => {
                            console.log("Error Read Microsoft Calendar --> " + JSON.stringify(error) + " -- " + index + " == " + totalPlanners + " -- ParseRes >>> " + JSON.stringify(parseRes))
                        })
                }, 2000)
            });
        })
};


///////////////////////////////////// CREATE PLANNER CALLBACK ///////////////////////////////
export const createPlannerSuccess = data => ({
    type: CREATE_PLANNER_CALLBACK,
    payload: data
})
////////////////////////////////////////////////////////////////////////////////////////////


///////////////////// Create Firebase Planner /////////////////////////////////////////////
export const createFirebasePlanner = (payload) => async (dispatch) => {

    console.log("createFirebasePlanner : " + JSON.stringify(payload))

    var totalProcess = 10
    await dispatch(createPlannerSuccess({
        fileNumber: 1,
        totalProcess: totalProcess,
    }))

    await setTimeout(async () => {
        await FirebaseCalendar.createFirebasePlanner(payload)
            .then(async (data) => {
                console.log("Firebase Calendar Created")
                await setTimeout(async () => {
                    await dispatch(createPlannerSuccess({
                        fileNumber: 10,
                        totalProcess: totalProcess,
                        progress_statements: 'Success',
                        error: false
                    }))
                }, 2000)
            })
    }, 2000)
}

///////////////////// Create Google Planner ///////////////////////////////////////////////////////////

export const createGooglePlannerSuccess = data => ({
    type: CREATE_GOOGLE_PLANNER,
    payload: data,
});

export const createGooglePlanner = (payload) => async (dispatch) => {

    //https://www.googleapis.com/calendar/v3/calendars/pattnaikdeeptiman@gmail.com/events?conferenceDataVersion=1

    //console.log("createGooglePlanner : payload == " + JSON.stringify(payload))

    if (payload.finish) {
        console.log(" Finish GooglePlanner >>>>")
        dispatch(createGooglePlannerSuccess({ finish: 'finished...' }))
    } else if (payload.invalidate) {
        console.log(" Invalidate GooglePlanner >>>>")
        dispatch(createGooglePlannerSuccess({ invalidate: 'invalidate...' }))
    } else if (payload.subject) {

        var totalProcess = 10
        await dispatch(createPlannerSuccess({
            fileNumber: 1,
            totalProcess: totalProcess,
        }))

        GoogleCalendar.uploadFilesGoogleDrive(payload)
            .then(async (res) => {

                var uploadRes = JSON.stringify(res)
                var parseAttachResponse = JSON.parse(uploadRes)
                console.log("uploadFilesGoogleDrive -- Res : " + uploadRes)
                if (parseAttachResponse.isCancelled == true) {
                    console.log("Cancelled uploadFilesGoogleDrive")
                }

                await dispatch(createPlannerSuccess({
                    fileNumber: 3,
                    totalProcess: totalProcess,
                }))

                GoogleCalendar.googleDrivePermission(uploadRes)
                    .then(async (res) => {

                        var grantRes = JSON.stringify(res)
                        var parseGrantResponse = JSON.parse(grantRes)
                        console.log("googleDrivePermission -- Res : " + grantRes)
                        if (parseGrantResponse.isCancelled == true) {
                            console.log("Cancelled googleDrivePermission")
                        }

                        await dispatch(createPlannerSuccess({
                            fileNumber: 4,
                            totalProcess: totalProcess,
                        }))

                        GoogleCalendar.createGooglePlanner(payload, uploadRes)
                            .then(async (res) => {
                                var msg = JSON.parse(JSON.stringify(res)).success
                                console.log("Success Calendar ---> " + JSON.stringify(res) + " :: " + msg)

                                await dispatch(createPlannerSuccess({
                                    fileNumber: 10,
                                    totalProcess: totalProcess,
                                    progress_statements: 'Success',
                                    error: false
                                }))

                                //dispatch(createGooglePlannerSuccess({ success: msg }))

                            }).catch(async (error) => {
                                var msg = JSON.parse(JSON.stringify(error)).progress_statements
                                console.log("Error Calendar ---> " + msg)
                                await dispatch(createPlannerSuccess({
                                    fileNumber: 10,
                                    totalProcess: totalProcess,
                                    error: true,
                                    progress_statements: msg
                                }))
                            })

                    }).catch(async (error) => {
                        var msg = JSON.parse(JSON.stringify(error)).progress_statements
                        console.log("Error Granting Permission ---> " + msg)
                        await dispatch(createPlannerSuccess({
                            fileNumber: 10,
                            totalProcess: totalProcess,
                            error: true,
                            progress_statements: msg
                        }))
                    })

            }).catch(async (error) => {
                var msg = JSON.parse(JSON.stringify(error)).progress_statements
                console.log("Error Uploading files to Google Drive ---> " + msg)
                await dispatch(createPlannerSuccess({
                    fileNumber: 10,
                    totalProcess: totalProcess,
                    error: true,
                    progress_statements: msg
                }))
            })
    }
};


//////////////////////////// Create Microsoft Planner /////////////////////////

export const createMicrosoftPlannerSuccess = data => ({
    type: CREATE_MICROSOFT_PLANNER,
    payload: data
});

export const createMicrosoftPlanner = (payload) => async (dispatch) => {

    if (payload.finish) {
        console.log(" Finish MicrosoftPlanner >>>>")
        dispatch(createMicrosoftPlannerSuccess({ finish: 'finished...' }))
    } else if (payload.invalidate) {
        console.log(" Invalidate GooglePlanner >>>>")
        dispatch(createMicrosoftPlannerSuccess({ invalidate: 'invalidate...' }))
    } else if (payload.subject) {

        var totalProcess = 10
        await dispatch(createPlannerSuccess({
            fileNumber: 1,
            totalProcess: totalProcess,
        }))

        MicrosoftCalendar.uploadFileOneDrive(payload)
            .then(async (res) => {

                var attachmentIds;

                var parseUploadRes = JSON.parse(JSON.stringify(res))
                var uploadRes = JSON.stringify(res)

                if (parseUploadRes.error === true) {
                    var msg = parseUploadRes.progress_statements
                    console.log("Upload Error ---> " + uploadRes + " === " + msg)
                    await dispatch(createPlannerSuccess({
                        fileNumber: 10,
                        totalProcess: totalProcess,
                        error: true,
                        progress_statements: msg
                    }))
                }

                var parseAttachResponse = JSON.parse(uploadRes)
                console.log("uploadFileOneDrive -- Res : " + uploadRes)
                if (parseAttachResponse.isCancelled == true) {
                    console.log("Cancelled uploadFileOneDrive")
                } else {
                    attachmentIds = parseAttachResponse.attachmentIds
                    console.log("Success uploadFileOneDrive ")
                }

                await dispatch(createPlannerSuccess({
                    fileNumber: 1,
                    totalProcess: totalProcess,
                }))

                MicrosoftCalendar.createShareLink(payload, uploadRes)
                    .then(async (res) => {

                        var oneDriveUrls

                        var shareLinkRes = JSON.stringify(res)
                        var parseShareLinkResponse = JSON.parse(shareLinkRes)
                        console.log("createShareLink -- Res : " + shareLinkRes)
                        if (parseShareLinkResponse.isCancelled == true) {
                            console.log("Cancelled createShareLink")
                        } else {
                            oneDriveUrls = parseShareLinkResponse.oneDriveUrls
                            console.log("Success createShareLink ")
                        }
                        await dispatch(createPlannerSuccess({
                            fileNumber: 1,
                            totalProcess: totalProcess,
                        }))
                        MicrosoftCalendar.createMicrosoftCalendar(payload)
                            .then(async (calendar) => {

                                var errorMsg = JSON.parse(JSON.stringify(calendar))
                                if (errorMsg.error) {
                                    console.log(" Create Calendar Error --> " + errorMsg.error.message)
                                    await dispatch(createPlannerSuccess({
                                        fileNumber: 10,
                                        totalProcess: totalProcess,
                                        error: true,
                                        progress_statements: "Error Creating Calendar : \n" + errorMsg.error.message
                                    }))
                                }

                                console.log("Success createMicrosoftCalendar ---> " + JSON.stringify(calendar))

                                MicrosoftCalendar.parseMicrosoftPlannerJSON(calendar, 0, 0).
                                    then(async (res) => {

                                        var eventId = JSON.parse(JSON.stringify(res)).eventId

                                        if (parseShareLinkResponse.isCancelled == true) {
                                            console.log("No Share Link to attach into Events")
                                            //dispatch(createMicrosoftPlannerSuccess({ success: 'Microsoft Calendar Created' }))
                                            await dispatch(createPlannerSuccess({
                                                fileNumber: 10,
                                                totalProcess: totalProcess,
                                            }))
                                        }

                                        await dispatch(createPlannerSuccess({
                                            fileNumber: 1,
                                            totalProcess: totalProcess,
                                        }))

                                        MicrosoftCalendar.addAttachmentsToEvent(payload, oneDriveUrls, eventId)
                                            .then(async (res) => {

                                                console.log("Success addAttachmentsToEvent ---> " + JSON.stringify(res))

                                                var errorMsg = JSON.parse(JSON.stringify(res))
                                                if (errorMsg.error === true) {
                                                    console.log(" Error adding attachment to the event --> " + errorMsg.error.message)
                                                    await dispatch(createPlannerSuccess({
                                                        fileNumber: 10,
                                                        totalProcess: totalProcess,
                                                        error: true,
                                                        progress_statements: errorMsg.progress_statements
                                                    }))
                                                }

                                                MicrosoftCalendar.sendInviteForAttachments(payload, attachmentIds)
                                                    .then(async (res) => {
                                                        console.log("Success sendInviteForAttachments --> " + JSON.stringify(res))

                                                        var errorMsg = JSON.parse(JSON.stringify(res))
                                                        if (errorMsg.error === true) {
                                                            console.log(" Error sending invite --> " + errorMsg.progress_statements)
                                                            await dispatch(createPlannerSuccess({
                                                                fileNumber: 10,
                                                                totalProcess: totalProcess,
                                                                error: true,
                                                                progress_statements: errorMsg.progress_statements
                                                            }))
                                                        }

                                                        await dispatch(createPlannerSuccess({
                                                            fileNumber: 1,
                                                            totalProcess: totalProcess,
                                                        }))

                                                        MicrosoftCalendar.getAttachmentsByEventId(payload, eventId)
                                                            .then(async (res) => {
                                                                var msg = JSON.parse(JSON.stringify(res)).success
                                                                console.log("getAttachmentsByEventId Success --> " + msg + " ::: " + JSON.stringify(res))
                                                                //dispatch(createMicrosoftPlannerSuccess({ success: msg }))
                                                                await dispatch(createPlannerSuccess({
                                                                    fileNumber: 10,
                                                                    totalProcess: totalProcess,
                                                                }))
                                                            }).catch(async (error) => {
                                                                var errorMsg = JSON.parse(JSON.stringify(error))
                                                                if (errorMsg.error === true) {
                                                                    console.log(" Error Creating Calendar --> " + errorMsg.progress_statements)
                                                                    await dispatch(createPlannerSuccess({
                                                                        fileNumber: 10,
                                                                        totalProcess: totalProcess,
                                                                        error: true,
                                                                        progress_statements: errorMsg.progress_statements
                                                                    }))
                                                                }
                                                            })

                                                    }).catch(async (error) => {
                                                        var errorMsg = JSON.parse(JSON.stringify(error))
                                                        if (errorMsg.error === true) {
                                                            console.log(" Error sending invite --> " + errorMsg.progress_statements)
                                                            await dispatch(createPlannerSuccess({
                                                                fileNumber: 10,
                                                                totalProcess: totalProcess,
                                                                error: true,
                                                                progress_statements: errorMsg.progress_statements
                                                            }))
                                                        }
                                                    })

                                            }).catch(async (error) => {
                                                var errorMsg = JSON.parse(JSON.stringify(error))
                                                if (errorMsg.error === true) {
                                                    console.log(" Error adding attachment to the event --> " + errorMsg.progress_statements)
                                                    await dispatch(createPlannerSuccess({
                                                        fileNumber: 10,
                                                        totalProcess: totalProcess,
                                                        error: true,
                                                        progress_statements: errorMsg.progress_statements
                                                    }))
                                                }
                                            })
                                    }).catch(async (error) => {
                                        var msg = JSON.parse(JSON.stringify(error)).error
                                        console.log("parseMicrosoftPlannerJSON  Error --> " + msg + " :: " + JSON.stringify(error))
                                        //dispatch(createMicrosoftPlannerSuccess({ error: msg }))
                                        await dispatch(createPlannerSuccess({
                                            fileNumber: 10,
                                            totalProcess: totalProcess,
                                        }))
                                    })

                            }).catch(async (error) => {
                                var errorMsg = JSON.parse(JSON.stringify(error))
                                console.log("Error Creating Calendar --> " + errorMsg.progress_statements + " :: " + JSON.stringify(error))
                                await dispatch(createPlannerSuccess({
                                    fileNumber: 10,
                                    totalProcess: totalProcess,
                                    error: true,
                                    progress_statements: errorMsg.progress_statements
                                }))
                            })

                    }).catch(async (error) => {
                        var errorMsg = JSON.parse(JSON.stringify(error))
                        console.log("Error Creating share link --> " + errorMsg.progress_statements + " :: " + JSON.stringify(error))
                        await dispatch(createPlannerSuccess({
                            fileNumber: 10,
                            totalProcess: totalProcess,
                            error: true,
                            progress_statements: errorMsg.progress_statements
                        }))
                    })

            }).catch(async (error) => {
                var errorMsg = JSON.parse(JSON.stringify(error))
                console.log("OneDrive Upload Error --> " + errorMsg.progress_statements + " :: " + JSON.stringify(error))
                await dispatch(createPlannerSuccess({
                    fileNumber: 10,
                    totalProcess: totalProcess,
                    error: true,
                    progress_statements: errorMsg.progress_statements
                }))
            })
    }
};


///////////////////// Fetch Planner List //////////////////////////////
export const fetchPlannerListSuccess = (data, events) => ({
    type: FETCH_PLANNERS,
    payload: data,
    events: events
});

export const fetchPlanners = (type) => dispatch => {
    //console.log("Action Fetch Planners >>> " + type)
    if (type === true) {

        let daysObject = {};
        var planners = PlannerRealmServices.findAll();
        planners.map((item, index) => {
            var obj = JSON.parse(JSON.stringify(item))
            daysObject[item.startDate] = {
                selected: true,
                marked: true,
                selectedColor: obj.hexCode,
            };
            dispatch(fetchPlannerListSuccess(daysObject, {}))
        })

        function listener(events, changes) {
            changes.insertions.forEach((index) => {

                let insertedEvent = events[index];
                console.log("Inserted Event --> " + insertedEvent.startDate)

                daysObject[insertedEvent.startDate] = {
                    selected: true,
                    marked: true,
                    selectedColor: insertedEvent.hexCode,
                };
                dispatch(fetchPlannerListSuccess(daysObject, {}))
            });

            // Update UI in response to modified objects
            changes.modifications.forEach((index) => {

            });

            // Update UI in response to deleted objects
            changes.deletions.forEach((index) => {
                // Deleted objects cannot be accessed directly
                // Support for accessing deleted objects coming soon...
            });
            //console.log("Realm Changes --> " + JSON.stringify(changes) + " === " + JSON.stringify(events))
        }
        planners.addListener(listener)

    } else {
        dispatch(fetchPlannerListSuccess({ empty: 'No calendar' }, []))
    }
};



///////////////////////////////////////FETCH NOTIIFICATION/////////////////////////////////////////////////////

export const loadAnnouncementFromFirebaseSuccess = (data) => ({
    type: FETCH_FIREBASE_ANNOUNCEMENT,
    payload: data
})

export const loadAnnouncementFromFirebase = (params) => dispatch => {

    var topicRef = database().ref('Users')
        .child(params.id)
        .child('topics');
    topicRef.once('value', snapShot => {

        snapShot.forEach(async (snap) => {

            var sn = JSON.parse(JSON.stringify(snap));

            //console.log("Firebase Topics --> " + JSON.stringify(snap) + " :: " + sn.tag)

            await database().ref('Topics').child(sn.tag)
                .once('value', querySnapshot => {

                    querySnapshot.forEach(async (topicSnap) => {

                        var snap = JSON.parse(JSON.stringify(topicSnap.val()))

                        if (snap.time && sn.subscribe === true) {

                            if (AnnouncementRealmServices.findByTime(snap.time).length == 0) {

                                var announcement = {
                                    title: snap.title,
                                    body: snap.body,
                                    topic: snap.topic,
                                    smallText: snap.smallText,
                                    bigText: snap.bigText,
                                    time: snap.time,
                                    image: snap.image
                                }
                                console.log("Insert Topics :: " + snap.title + " :: ")
                                AnnouncementRealmServices.save(announcement)

                                await dispatch(loadAnnouncementFromFirebaseSuccess(announcement))
                            }
                            //console.log("Firebase Topics >>> " + JSON.stringify(topicSnap.val()))
                        }
                    });
                });
        })
    })
}

export const fetchAnnouncementSuccess = (data) => ({
    type: FETCH_ANNOUNCEMENT,
    payload: data
});

export const fetchAnnouncement = () => dispatch => {

    console.log("fetchAnnouncement .... ")

	messaging().onMessage(async remoteMessage => {
		
		console.log("Remote Message --> "+JSON.stringify(remoteMessage.data))		
	})    
};


