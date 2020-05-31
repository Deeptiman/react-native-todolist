import database from '@react-native-firebase/database';
import PlannerRealmServices from '../Realm/PlannerRealm';
import { Utils } from '../components/utils/Utils';

export class FirebaseCalendar {

    static fetchFirebaseCalendar = async (snapShot, parseId, totalPlanners) => {

        console.log("fetchFirebaseCalendar :: " + parseId + " >>> " + totalPlanners)

        let res = await new Promise(async (resolve, reject) => {

            var id = snapShot.key

            console.log("Firebase Planners --> " + id + " --> " + JSON.stringify(snapShot.val()))

            var cal = snapShot.val()

            console.log("Subject -- " + cal.subject)
            console.log("Description -- " + cal.description)
            console.log("StartDate -- " + cal.start.startDate)
            console.log("StartTime -- " + cal.start.startTime)

            var color;
            var hexCode;
            if (cal.colorId) {
                Utils.firebaseColors.map(function (item) {
                    if (cal.colorId === item.value) {
                        color = {
                            id: id,
                            colorId: item.id,
                            value: item.value,
                            hexCode: item.color,
                            label: item.label
                        }
                        hexCode = item.color
                        console.log("Firebase Color Match ---> "+hexCode+" :: "+item.color)
                    }
                })
            } else {
                color = Utils.getDefaultGoogleColor(id)
                hexCode = Utils.DEFAULT_HexCode_GOOGLE
            }

            console.log("HexCode >>>>> "+hexCode)

            var plannerEvent = {
                id: id,
                subject: cal.subject,
                description: cal.description ? cal.description : 'No description',
                status: 'confirmed',
                weblink: 'no weblink',
                location: Utils.SAMPLE_LOCATION,
                organizer: cal.organizer,
                startDate: cal.start.startDate,
                startTime: cal.start.startTime,
                endDate: cal.end.endDate,
                endTime: cal.end.endTime,
                reminders: [],
                color: color,
                dots: [],
                hexCode: hexCode,
                onlineMeeting: '',
                isOnlineMeeting: false,
                attendees: [],
                attachments: [],
                calType: Utils.FIREBASE_LOGIN_TYPE
            }

            var savedPlanner = PlannerRealmServices.findById(id)
            if (savedPlanner.length === 0) {
                console.log("Insert Firebase Calendar into Realm -- " + JSON.stringify(plannerEvent))
                PlannerRealmServices.save(plannerEvent, color, [], '', [], []);
            } else {
                PlannerRealmServices.update(id, plannerEvent, color, [], '', [], [])
            }
            resolve({ success: 'Firebase Planner Created', eventId: id, parseId: parseId, totalPlanners: totalPlanners })
            console.log("\n ------- Firebase Planner Created -> parseId = " + parseId + " , totalPlanners = " + totalPlanners + "  ---------  ")
        })
        return res
    }

    static createFirebasePlanner = async (payload) => {

        var start = {
            startDate: payload.startDate,
            startTime: payload.startTime
        }

        var end = {
            endDate: payload.endDate,
            endTime: payload.endTime
        }

        var time = payload.endDate + "-" + payload.startTime + "-" + payload.endTime

        let res = await new Promise(async (resolve, reject) => {

            var calRef = await database().ref('Users')
                .child(payload.userId)
                .child('planners')
                .child(payload.startDate)
                .child(time);
            calRef.set({
                subject: payload.subject,
                description: payload.description,
                start: start,
                end: end,
                organizer: payload.email,
                colorId: payload.colorId,
                type: Utils.FIREBASE_LOGIN_TYPE,
            }).then(async (data) => {
                console.log(" Firebase Planner Created Success = " + data);

                await calRef.once('value', async (snap) => {
                    console.log(" Firebase Planner Inserted = " + JSON.stringify(snap));
                    await FirebaseCalendar.fetchFirebaseCalendar(snap, 1, 1)
                        .then(async (data) => {
                            await resolve({ success: 'Firebase Planner Created', eventId: time, parseId: 1, totalPlanners: 1 })
                        })
                })

            }).catch(async (error) => {
                console.log("Error Firebase Planner -> " + error);
                resolve({ success: 'Error Creating Firebase Planner', eventId: time, parseId: 1, totalPlanners: 1 })
            });
        })
        return res
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////