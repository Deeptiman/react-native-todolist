import moment from 'moment';
import PlannerRealmServices from '../Realm/PlannerRealm';
import { Buffer } from 'buffer'
import { Utils } from '../components/utils/Utils';

export class MicrosoftCalendar {


    ////////////////////////////////////// OneDrive Implementation /////////////////////////////////////

    static uploadFileOneDrive = async (payload) => {

        console.log("uploadFileOneDrive.... ")

        let res = new Promise((resolve, reject) => {

            if (payload.hasAttachments === false) {
                resolve({ isCancelled: true, attachmentIds: [] })
            }

            var total = payload.attachments.length
            var attachmentIds = []

            console.log("Upload to OneDrive -- " + JSON.stringify(payload.attachments))

            payload.attachments.map(async (attach, index) => {
                var url = Utils.microsoftGetAttachmentUrl(attach.name)
                const buffer = Buffer.from(attach.base64, Utils.READ_ATTACHMENT_FILE_TYPE)

                console.log("Upload File - " + attach.name)
                console.log("Upload Url - " + url)
                console.log("Content - Type :: " + attach.type)

                await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': attach.type,
                        'Authorization': Utils.AUTH_REQUEST_TOKEN + payload.accessToken,
                        'x-amz-acl': Utils.ONEDRIVE_ATTACHMENT_HEADER,
                    }, body: buffer
                }).then(response => response.json())
                    .then(async (res) => {
                        console.log("OneDrive Success -->>>> Response : " + JSON.stringify(res))

                        var upload = JSON.parse(JSON.stringify(res))

                        if (upload.error) {
                            await reject({
                                error: true,
                                fileNumber: index,
                                totalFiles: payload.attachments.length,
                                progress_statements: 'Error Uploading File.. ' + attach.name,
                                next_function_call: 'finish'
                            })
                        }

                        attachmentIds.push({
                            name: attach.name,
                            oneDriveId: upload.id
                        })

                        if (attachmentIds.length == total) {
                            console.log("Finished Upload >>>> " + index + " :: " + total)
                            await resolve({
                                success: 'Finshed upload to OneDrive',
                                attachmentIds: attachmentIds,
                                isCancelled: false,
                                error: false
                            })
                        }
                    }).catch(async (err) => {
                        //var error = JSON.parse(JSON.stringify(err))
                        console.log("OneDrive Error -->>>> " + JSON.stringify(err))
                        //reject({ error: error.message })
                        await reject({
                            error: true,
                            fileNumber: index,
                            totalFiles: payload.attachments.length,
                            progress_statements: 'Error Uploading File.. ' + attach.name,
                            next_function_call: 'finish'
                        })
                    })
            })
        })
        return res
    }


    static createShareLink = async (payload, uploadResponse) => {

        console.log("Create Share Link")
        let res = new Promise((resolve, reject) => {

            var parseResponse = JSON.parse(uploadResponse)

            if (parseResponse.isCancelled === true) {
                console.log("Empty Attachments")
                resolve({ isCancelled: true, oneDriveUrls: [] })
            }

            var attachmentIds = parseResponse.attachmentIds
            var total = attachmentIds.length

            var attachmentUrls = []
            attachmentIds.map(async (attach, index) => {
                var url = Utils.createOneDriveLink(attach.oneDriveId)
                console.log("OneDrive ID - " + url)
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Utils.AUTH_REQUEST_TOKEN + payload.accessToken,
                    }, body: JSON.stringify({
                        type: 'view'
                    })
                }).then(response => response.json())
                    .then(async (res) => {
                        var data = JSON.parse(JSON.stringify(res))
                        console.log("Link Url -- " + data.link.webUrl + " ::: " + JSON.stringify(res))
                        attachmentUrls.push({
                            name: attach.name,
                            url: data.link.webUrl
                        })

                        if (attachmentUrls.length == total) {
                            console.log("Finished Public Link >> " + index + " :: " + total)
                            await resolve({ oneDriveUrls: attachmentUrls, isCancelled: false })
                        }

                    }).catch(async (err) => {
                        var error = JSON.parse(JSON.stringify(err))
                        console.log("Error share link -->>>> " + JSON.stringify(err))
                        await reject({
                            error: true,
                            fileNumber: index,
                            totalFiles: total,
                            progress_statements: 'Error Creating Share Link.. ' + attach.name,
                            next_function_call: 'finish'
                        })
                    })
            })
        })
        return res
    }


    static addAttachmentsToEvent = async (payload, attachmentUrls, eventId) => {

        console.log("addAttachmentsToEvent -- " + JSON.stringify(attachmentUrls))

        let res = new Promise((resolve, reject) => {

            if (attachmentUrls === undefined) {
                console.log("No Attachments")
                resolve({ success: 'Microsoft Calendar Created' })
            }

            var total = attachmentUrls.length
            var success = []
            attachmentUrls.map(async (attach, index) => {

                var url = Utils.addAttachmentToEvent(eventId)
                console.log("Add Attachment Event - " + url)

                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Utils.AUTH_REQUEST_TOKEN + payload.accessToken,
                    }, body: JSON.stringify({
                        "@odata.type": Utils.MICROSOFT_GRAPH_DATA_TYPE,
                        "name": attach.name,
                        "sourceUrl": attach.url,
                        "providerType": Utils.ONE_DRIVE_PROVIDER_TYPE,
                        "permission": Utils.ONE_DRIVE_FILE_ACCESS_PERMISSION,
                        "isFolder": Utils.IS_FILE_SAVE_ONE_DRIVE_FOLDER
                    })
                }).then(response => response.json())
                    .then(async (res) => {

                        console.log("Attachment Response -- " + JSON.stringify(res))

                        var attachmentRes = JSON.parse(JSON.stringify(res))
                        if (attachmentRes.error) {
                            await reject({
                                error: true,
                                fileNumber: index,
                                totalFiles: total,
                                progress_statements: 'Error adding attachment to the event.. ' + attach.name,
                                next_function_call: 'finish'
                            })
                        }

                        success.push({
                            res: res
                        })

                        if (success.length == total) {
                            console.log("Finished Creating Attachments ::>>> " + index + " -- " + total)
                            await resolve({ success: 'Microsoft Calendar Created', error: false })
                        }

                    }).catch(async (err) => {
                        var attachmentRes = JSON.parse(JSON.stringify(err))
                        if (attachmentRes.error) {
                            await reject({
                                error: true,
                                fileNumber: index,
                                totalFiles: total,
                                progress_statements: 'Error adding attachment to the event.. ' + attach.name,
                                next_function_call: 'finish'
                            })
                        }
                    })
            })
        })
        return res
    }

    static sendInviteForAttachments = async (payload, attachmentIds) => {

        console.log("sendInviteForAttachments -- ")

        let res = new Promise((resolve, reject) => {

            if (payload.attendees === undefined) {
                console.log("Empty Attendees")
                resolve({ empty: 'no attendees' })
            }

            if (attachmentIds === undefined) {
                console.log("Empty Attachments")
                resolve({ empty: 'no link' })
            }
            var total = attachmentIds.length

            var attendees = []
            payload.attendees.map((student, index) => {
                attendees.push({
                    email: student.email
                })
            })
            var success = []
            attachmentIds.map(async (attach, index) => {

                console.log("OneDrive Invite Attendees --> " + JSON.stringify(attendees))

                var url = Utils.sendOneDriveInvite(attach.oneDriveId)
                console.log("OneDrive Invite Url - " + url)
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Utils.AUTH_REQUEST_TOKEN + payload.accessToken,
                    }, body: JSON.stringify(
                        {
                            "recipients": attendees,
                            "message": payload.email + " has shared " + attach.name + " with you",
                            "requireSignIn": Utils.ONE_DRIVE_REQUIRE_SIGNIN,
                            "sendInvitation": Utils.ONE_DRIVE_SEND_INVITATION,
                            "roles": [Utils.ONE_DRIVE_ACCESS_ROLE]
                        }
                    )
                }).then(response => response.json())
                    .then(async (res) => {

                        console.log("Invite Response -- " + JSON.stringify(res))

                        success.push({
                            res: res
                        })

                        if (success.length == total) {
                            console.log("Finished Sending Invites")
                            resolve({ success: 'Microsoft Calendar Created' })
                        }

                    }).catch((err) => {
                        var error = JSON.parse(JSON.stringify(err))
                        console.log("Invite Error -->>>> " + JSON.stringify(err))
                        reject({ error: error.message })
                    })
            })
        })
        return res
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////



    /////////////////////////////////// Microsoft Graph Beta API for Events ////////////////////////////

    static createMicrosoftCalendar = async (payload) => {

        var attendees = [];
        payload.attendees.map((student, index) => {
            attendees.push({
                emailAddress: {
                    address: student.email
                },
                type: "required"
            })
        });

        var notifyMin = 0;
        var isReminderOn = false;
        if (payload.reminders.length > 0) {
            notifyMin = payload.reminders[0].minutes
            isReminderOn = true
        }
       
        var startTime = Utils.replaceAMPM(payload.startTime)
        var endTime = Utils.replaceAMPM(payload.endTime)

        const planner = {
            subject: payload.subject,
            body: {
                contentType: "HTML",
                content: payload.description
            },
            start: {
                dateTime: payload.startDate + "T" + startTime + ":00+00:00",
                timeZone: Utils.SAMPLE_TIME_ZONE
            },
            end: {
                dateTime: payload.endDate + "T" + endTime + ":00+00:00",
                timeZone: Utils.SAMPLE_TIME_ZONE
            },
            location: {
                displayName: Utils.SAMPLE_LOCATION
            },
            categories: [payload.colorId],
            attendees: attendees,
            isReminderOn: isReminderOn,
            reminderMinutesBeforeStart: notifyMin,
            isOnlineMeeting: payload.isConferenceEnabled,
            onlineMeetingProvider: payload.isConferenceEnabled ? Utils.MICROSOFT_CONFERENCE_PARTNER : "unknown" //skypeForBusiness
        };

        console.log("POST REQUEST PLANNER --> " + payload.colorId)

        let res = await new Promise((resolve, reject) => {

            MicrosoftCalendar.postMicrosoftPlanner(payload, planner)
                .then((calendar) => {

                    console.log("Microsoft Created Calendar ---> " + JSON.stringify(calendar))
                    resolve(calendar)
                }).catch(async (error) => {
                    var err = JSON.parse(JSON.stringify(error))
                    console.log("Error in Microsoft create Calendar ---> " + JSON.stringify(error))
                    await reject({
                        error: true,
                        fileNumber: 1,
                        totalFiles: 1,
                        progress_statements: 'Error Creating Calendar.. ' + err.message,
                        next_function_call: 'finish'
                    })
                })
        })

        return res
    }

    static postMicrosoftPlanner = async (payload, planner) => {

        var url = Utils.MICROSOFT_CALENDAR_URL + "/events"
        console.log("Post Planner --> Request :: " + JSON.stringify(planner))
        console.log("Post Planner --> Access Token :: " + payload.accessToken)
        let res = await new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': Utils.AUTH_REQUEST_TOKEN + payload.accessToken,
                }, body: JSON.stringify(planner)
            }).then(response => response.json())
                .then(async (res) => {
                    console.log("Microsoft Add Cal -->>>> Response : " + JSON.stringify(res))
                    resolve(res)
                }).catch(async (err) => {
                    var error = JSON.parse(JSON.stringify(err))
                    console.log("Error in Microsoft create Calendar ---> " + JSON.stringify(error))
                    await reject({
                        error: true,
                        fileNumber: 1,
                        totalFiles: 1,
                        progress_statements: 'Error Creating Calendar.. ' + error.message,
                        next_function_call: 'finish'
                    })
                })
        })
        return res
    }


    static getAttachmentsByEventId = async (payload, eventId) => {
      
        var url = Utils.getAttachmentByEventId(eventId)

        let res = await new Promise(async (resolve, reject) => {

            await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Utils.AUTH_REQUEST_TOKEN + payload.accessToken,
                }
            }).then(response => response.json())
                .then(res => {

                    //console.log("Get Event Attachment Response -- " + JSON.stringify(res))
                    var data = JSON.parse(JSON.stringify(res))
                    if (data.value) {
                        var total = data.value.length - 1
                        data.value.map((attach, index) => {
                            var fileId = attach.id
                            var title = attach.name
                            var sourceUrl = attach.sourceUrl

                            var obj = {
                                id: eventId,
                                title: title,
                                fileId: fileId,
                                fileUrl: sourceUrl
                            }

                            var hasAttachment = PlannerRealmServices.findAttachmentByFileId(fileId)
                            if (hasAttachment.length == 0) {
                                //console.log("Add Attachment SourceUrl -- " + sourceUrl)
                                PlannerRealmServices.saveAttachment(obj)
                                PlannerRealmServices.updateAttachmentInPlanner(obj)
                            } else {
                                //console.log("Attachment exist - " + sourceUrl)
                            }

                            if (index == total) {
                                //console.log("Finish saving attachment --")
                                resolve({ success: 'Microsoft Calendar Created' })
                            }
                        })
                    } else {
                        resolve({ success: 'Microsoft Calendar Created' })
                    }

                }).catch((err) => {
                    var error = JSON.parse(JSON.stringify(err))
                    //console.log("Error Event Attachment -->>>> " + JSON.stringify(err))
                    reject({ error: error.message })
                })
        })
        return res
    }


    static parseMicrosoftPlannerJSON = async (calendar, parseId, totalPlanners) => {

        //console.log("Parse Microsoft Cal ---> " + JSON.stringify(calendar))
    
        let res = await new Promise((resolve, reject) => {
            var cal = JSON.parse(JSON.stringify(calendar))

            var id = cal.id;
            var subject = cal.subject;
            var description = cal.body.content;
            var status = cal.showAs;
            var weblink = cal.webLink;
            var location = JSON.parse(JSON.stringify(cal.location)).displayName;
            var organizer = JSON.parse(JSON.stringify(cal.organizer)).emailAddress.address;


            var startDate = moment(cal.start.dateTime).format(Utils.DATE_FORMAT);
            var startTime = moment(cal.start.dateTime).format(Utils.TIME_FORMAT);

            var endDate = moment(cal.end.dateTime).format(Utils.DATE_FORMAT);
            var endTime = moment(cal.end.dateTime).format(Utils.TIME_FORMAT);

            var index = Utils.totalTimes.findIndex(el => el >= cal.reminderMinutesBeforeStart)
            var minute = cal.reminderMinutesBeforeStart / Utils.factors[index]
            var timeLabel = minute + " " + Utils.labels[index]
            if (index == -1)
                timeLabel = cal.reminderMinutesBeforeStart + " minutes"

            var reminders = [];
            if (cal.isReminderOn === true) {
                reminders.push({
                    id: cal.id,
                    method: "noitification",
                    minutes: cal.reminderMinutesBeforeStart,
                    timeLabel: timeLabel
                })
            }

            var onlineMeeting = {};
            if (cal.onlineMeeting) {
                onlineMeeting = {
                    id: cal.id,
                    videoLink: cal.onlineMeeting.joinUrl ? cal.onlineMeeting.joinUrl : 'no video link',
                    phoneNumber: cal.onlineMeeting.tollNumber ? cal.onlineMeeting.tollNumber : 'no phone number',
                    conferenceId: cal.onlineMeeting.conferenceId ? cal.onlineMeeting.conferenceId : 'no conference id'
                }
            }
            var attendees = [];
            if (cal.attendees) {
                cal.attendees.map(function (attend) {
                    attendees.push({
                        id: cal.id,
                        email: attend.emailAddress.address,
                        response: attend.status.response
                    })
                });
            }

            var color = {}
            var hexCode;
            if (cal.categories && cal.categories.length != 0) {
                Utils.microsoftColors.map(function (item) {
                    if (cal.categories[0] === item.value) {
                        color = {
                            id: id,
                            colorId: item.id,
                            value: item.value,
                            hexCode: item.color,
                            label: item.label
                        }
                        //console.log("Microsoft :: Color Found ---> " + cal.categories[0] + " -- " + JSON.stringify(color))
                        hexCode = item.color
                    }
                })
            } else {
                color = Utils.getDefaultMicrosoftColor(id)
                hexCode = Utils.DEFAULT_HexCode_Microsoft
            }

            var attachments = [];

            //console.log("Microsoft Realm Insert --- " + id + " --- Color -> " + cal.categories[0])
            //console.log("Realm Reminder --- " + JSON.stringify(reminders))
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
                isOnlineMeeting: cal.onlineMeeting ? true : false,
                attendees: [],
                attachments: [],
                calType: Utils.MICROSOFT_LOGIN_TYPE
            }

            console.log("Insert into Realm -->>> " + cal.start.dateTime + " --- " + cal.end.dateTime + " >>> " + JSON.stringify(plannerEvent))


            var savedPlanner = PlannerRealmServices.findById(id)
            //console.log("Saved Planner ---> " + savedPlanner.length)
            if (savedPlanner.length === 0) {
                PlannerRealmServices.save(plannerEvent, color, reminders, onlineMeeting, attendees, attachments);
            } else {
                //console.log("Planners --- " + JSON.stringify(savedPlanner))
                PlannerRealmServices.update(id, plannerEvent, color, reminders, onlineMeeting, attendees, attachments)
            }
            resolve({ success: 'Microsoft Planner Created', eventId: id, parseId: parseId, totalPlanners: totalPlanners })

            //console.log("\n -------Microsoft Planner Created--------  "+parseId+" == "+totalPlanners)
        })

        return res
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////