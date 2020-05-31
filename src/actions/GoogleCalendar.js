import moment from 'moment';
import PlannerRealmServices from '../Realm/PlannerRealm';
import GDrive from '../components/drive/GDrive';
import { Utils } from '../components/utils/Utils';

export class GoogleCalendar {


    ///////////////////////////////////// Google Drive Implementation /////////////////////////////////

    static uploadFilesGoogleDrive = async (payload) => {

        console.log("GoogleCalendar -  uploadFilesGoogleDrive")

        let res = new Promise((resolve, reject) => {
            var attachmentsUrls = [];

            if (payload.hasAttachments === false) {
                resolve({ isCancelled: true, driveAttachments: [] })
            }

            var total = payload.attachments.length

            payload.attachments.map(async (attach, index) => {

                await GDrive.files.createFileMultipart(
                    attach.base64,
                    attach.type, {
                    parents: ["root"], //or any path
                    name: attach.name,
                    description: payload.subject,
                    writersCanShare: true
                }, true).then(response => response.json())
                    .then(async (data) => {
                        console.log(" >>>>> GDrive Created Files --- " + JSON.stringify(data))
                        var fileId = JSON.parse(JSON.stringify(data)).id
                        console.log("File ID :: -- " + fileId)
                        var url = Utils.GOOGLE_DRIVE_ENDPOINT + fileId

                        attachmentsUrls.push({
                            title: attach.name,
                            fileUrl: url,
                            fileId: fileId
                        })

                        if (attachmentsUrls.length == total) {
                            console.log("Google Drive -- Return attached Urls -- " + JSON.stringify(attachmentsUrls))
                            resolve({
                                driveAttachments: attachmentsUrls,
                                isCancelled: false
                            })
                        }

                    }).catch(async (error) => {
                        //var msg = JSON.parse(JSON.stringify(error)).error
                        //console.log("Storage Error :: " + error)
                        //reject(error)
                        await reject({
                            error: true,
                            fileNumber: index,
                            totalFiles: total,
                            progress_statements: '\n\nError Uploading Files.. ' + attach.name,
                            next_function_call: 'finish'
                        })
                    });
            })
        })

        return res
    }

    static googleDrivePermission = async (uploadResponse) => {

        console.log("googleDrivePermission")

        let res = new Promise(async (resolve, reject) => {

            var parseResponse = JSON.parse(uploadResponse)

            if (parseResponse.isCancelled === true) {
                console.log("Empty Attachments")
                resolve({ isCancelled: true })
            }

            var attachments = parseResponse.driveAttachments
            var totalFileId = attachments ? attachments.length : 0

            console.log("totalFileId - " + totalFileId)
            var success = []
            attachments.map(async (attach, index) => {

                console.log("File Id == " + attach.fileId)
                await GDrive.permissions.create(attach.fileId, {
                    role: Utils.GOOGLE_DRIVE_USER_ROLE, type: Utils.GOOGLE_DRIVE_PERMISSION_TYPE
                }).then(response => response.json())
                    .then(async (data) => {

                        var response = JSON.parse(JSON.stringify(data))
                        if (response.error) {
                            console.log("Error GDRIVE Permission >>>> " + response.error.message)
                            await reject({
                                error: true,
                                fileNumber: index,
                                totalFiles: attachments.length,
                                progress_statements: 'Error Granting File Permission.. ' + attach.title,
                                next_function_call: 'finish'
                            })
                        }

                        console.log("GDRIVE Permission Get Res ::: " + JSON.stringify(data))
                        success.push({ res: res })
                        if (success.length == totalFileId) {
                            console.log("GDrive Permission Attachments Done")
                            resolve({ success: "Done", isCancelled: false })
                        }
                    }).catch(async (error) => {
                        var msg = JSON.parse(JSON.stringify(error)).error
                        console.log("Error GDrive Permission ---> " + msg + " :: " + JSON.stringify(error))
                        await reject({
                            error: true,
                            fileNumber: 1,
                            totalFiles: 1,
                            progress_statements: 'Error Granting File Permission.. ' + msg,
                            next_function_call: 'finish'
                        })
                        //reject({ error: msg })
                    });
            })
        })

        return res
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////



    ///////////////////////////////////////// Google Calendar V3 API for Events ///////////////////////////

    static createGooglePlanner = async (payload, uploadResponse) => {

        //console.log("GoogleCalendar - createGooglePlanner :: ")

        var startTime = Utils.replaceAMPM(payload.startTime)
        var endTime = Utils.replaceAMPM(payload.endTime)

        var attendees = [];
        if (payload.attendees) {
            await payload.attendees.map(async (student, index) => {
                await attendees.push({
                    email: student.email,
                })
            })
        }
        var parseResponse = JSON.parse(uploadResponse)       

        const planner = {

            end: {
                dateTime: payload.endDate + "T" + endTime + ":00+03:00",
                timeZone: Utils.SAMPLE_TIME_ZONE
            },
            start: {
                dateTime: payload.startDate + "T" + startTime + ":00+03:00",
                timeZone: Utils.SAMPLE_TIME_ZONE
            },
            status: "confirmed",
            summary: payload.subject,
            description: payload.description,
            colorId: payload.colorId,
            location: Utils.SAMPLE_LOCATION,
            reminders: {
                useDefault: false,
                overrides: payload.reminders
            },
            attendees: attendees,
            attachments: parseResponse.driveAttachments,
            conferenceData: {
                createRequest: {
                    requestId: payload.requestId
                }
            }
        }

        console.log("Planner ---> " + JSON.stringify(planner))

        let res = await new Promise(async (resolve, reject) => {
            await GoogleCalendar.postGooglePlanner(payload, planner)
                .then(async (calendar) => {
                    await GoogleCalendar.parseGoogleCalendarJSON(calendar, 0, 0).
                        then(async (res) => {
                            await resolve({
                                success: true,
                                fileNumber: 1,
                                totalFiles: 1,
                                progress_statements: 'Calendar created sucessfully',
                                next_function_call: 'finish'
                            })
                        })
                }).catch(async (error) => {
                    var msg = JSON.parse(JSON.stringify(error)).error
                    console.log("POST Google Calendar Error -> " + JSON.stringify(error))
                    await reject({
                        error: true,
                        fileNumber: 1,
                        totalFiles: 1,
                        progress_statements: 'Error Creating Calendar.. ' + msg,
                        next_function_call: 'finish'
                    })
                })
        })
        return res
    }

    static postGooglePlanner = async (payload, planner) => {

        var confUrl = payload.isConferenceEnabled ? Utils.GOOGLE_CALENDAR_POST_EVENT_WITH_HANGOUT_ENABLED_ENDPOINT : Utils.GOOGLE_CALENDAR_POST_EVENT_ENDPOINT;

        var url = Utils.GOOGLE_CALENDAR_URL + payload.email + confUrl

        console.log("POST Planner --> " + JSON.stringify(planner))

        let res = await new Promise((resolve, reject) => {

            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': Utils.AUTH_REQUEST_TOKEN + payload.accessToken,
                }, body: JSON.stringify(
                    planner
                ),
            }).then(response => response.json())
                .then(data => {
                    var error = JSON.parse(JSON.stringify(data)).error
                    if (error) {
                        console.log("Google Calendar --> Return Error - " + JSON.stringify(error))
                        reject({ error: error.message })
                    } else {
                        console.log("Return Calendar Res")
                        resolve(data)
                    }
                }).catch((error) => {
                    var error = JSON.parse(JSON.stringify(error)).error
                    console.log("postGooglePlanner Error : " + JSON.stringify(error))
                    reject({ error: 'Error in POST Planner' })
                })
        })

        return res
    }


    static parseGoogleCalendarJSON = async (data, parseId, totalPlanners) => {

        console.log("GoogleCalendar - parseGoogleCalendarJSON :: " + JSON.stringify(data))

        let res = await new Promise((resolve, reject) => {

            var cal = JSON.parse(JSON.stringify(data))

            var id = cal.id;
            var subject = cal.summary ? cal.summary : 'no subject';
            var description = cal.description;
            var status = cal.status;
            var weblink = cal.htmlLink;
            var location = cal.location;
            var organizer = cal.organizer.email;

            const utcStartTime = moment.utc(cal.start.dateTime);
            var startDate = utcStartTime.local().format(Utils.DATE_FORMAT);
            //var startTime = utcStartTime.local().format('H:mm a');
            var startTime = utcStartTime.local().format(Utils.TIME_FORMAT);

            const utcEndTime = moment.utc(cal.end.dateTime);
            var endDate = utcEndTime.local().format(Utils.DATE_FORMAT);
            //var endTime = utcEndTime.local().format('H:mm a');
            var endTime = utcStartTime.local().format(Utils.TIME_FORMAT);


            var reminders = [];
            if (cal.reminders.overrides) {
                var overrides = cal.reminders.overrides;
                overrides.map(function (data) {

                    var index = Utils.totalTimes.findIndex(el => el >= data.minutes)
                    var minute = data.minutes / Utils.factors[index]
                    var timeLabel = minute + " " + Utils.labels[index]
                    if (index == -1)
                        timeLabel = data.minutes + " minutes"

                    if (data.method === "email") {
                        reminders.push({
                            id: cal.id,
                            method: "email",
                            minutes: data.minutes,
                            timeLabel: timeLabel
                        })
                    } else if (data.method === "popup") {
                        reminders.push({
                            id: cal.id,
                            method: "popup",
                            minutes: data.minutes,
                            timeLabel: timeLabel
                        })
                    }
                });
            } else {
                reminders.push({
                    id: cal.id,
                    method: "email",
                    minutes: 30,
                    timeLabel: "30 minutes"
                }, {
                    id: cal.id,
                    method: "popup",
                    minutes: 10,
                    timeLabel: "10 minutes"
                })
            }

            var onlineMeeting = {}
            var isOnlineMeeting = false
            var conferenceData = cal.conferenceData;
            if (conferenceData) {
                var entryPoints = conferenceData.entryPoints;
                var joinUrl, tollNumber;
                entryPoints.map(function (entryPoint) {

                    if (entryPoint.entryPointType === "video") {
                        joinUrl = entryPoint.uri
                    } else if (entryPoint.entryPointType === "phone") {
                        tollNumber = entryPoint.uri
                    }
                    //console.log("Entry: Type = " + entryPoint.entryPointType + " - Uri = " + entryPoint.uri);
                });

                isOnlineMeeting = true
                onlineMeeting = {
                    id: cal.id,
                    videoLink: joinUrl ? joinUrl : 'no video link',
                    phoneNumber: tollNumber ? tollNumber : 'no phone number',
                    conferenceId: conferenceData.conferenceId ? conferenceData.conferenceId : 'no conference id'
                }
            }
            var attendees = [];
            if (cal.attendees) {
                cal.attendees.map(function (attend) {
                    //console.log(" Email - " + attend.email + " , response - " + attend.responseStatus);
                    attendees.push({
                        id: cal.id,
                        email: attend.email,
                        response: attend.responseStatus
                    })
                });
            }

            var attachments = [];
            if (cal.attachments) {
                cal.attachments.map(function (attach) {
                    attachments.push({
                        id: cal.id,
                        title: attach.title,
                        fileId: attach.fileId,
                        fileUrl: attach.fileUrl
                    })
                });
            }

            var color;
            var hexCode;
            if (cal.colorId) {
                Utils.googleColors.map(function (item) {
                    if (cal.colorId === item.value) {
                        color = {
                            id: cal.id,
                            colorId: item.id,
                            value: item.value,
                            hexCode: item.color,
                            label: item.label
                        }
                        //console.log("Color Found ---> "+cal.colorId+" -- "+JSON.stringify(color))
                        hexCode = item.color
                    }
                })
            } else {
                color = Utils.getDefaultGoogleColor(cal.id)
                hexCode = Utils.DEFAULT_HexCode_GOOGLE
            }

            var plannerEvent = {
                id: id,
                subject: subject,
                description: description ? description : 'No description',
                status: status,
                weblink: weblink,
                location: location ? location : 'No location',
                organizer: organizer,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
                reminders: [],
                color: '',
                dots: [],
                hexCode: hexCode,
                onlineMeeting: '',
                isOnlineMeeting: conferenceData ? true : false,
                attendees: [],
                attachments: [],
                calType: Utils.GOOGLE_LOGIN_TYPE
            }
            var savedPlanner = PlannerRealmServices.findById(id)
            if (savedPlanner.length === 0) {
                //console.log("Insert into Realm -- " + JSON.stringify(plannerEvent))
                PlannerRealmServices.save(plannerEvent, color, reminders, onlineMeeting, attendees, attachments);
            } else {
                //console.log("Planners --- " + JSON.stringify(savedPlanner))
                PlannerRealmServices.update(id, plannerEvent, color, reminders, onlineMeeting, attendees, attachments)
            }
            resolve({ success: 'Google Planner Created', eventId: id, parseId: parseId, totalPlanners: totalPlanners })
            console.log("\n --------------------  ")
        })

        return res
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
