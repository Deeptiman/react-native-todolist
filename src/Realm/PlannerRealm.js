import RealmSchema from './RealmSchema';

let PlannerRealmService = {
    save: function (obj, color, reminders, onlineMeeting, attendees, attachments) {
        var saved = null;
        RealmSchema.write(() => {

            //console.log("Planner Schemas -- Reminders :: " + JSON.stringify(reminders))
            reminders.map((reminder) => {
                //console.log("Insert into Reminder ::: " + JSON.stringify(reminder))
                RealmSchema.create('Reminders', reminder, true);
            })

            //console.log("Color >>>> " + JSON.stringify(color))
            if (color) {
                RealmSchema.create('Colors', color, true);
                /*var dot = {
                    startDate: obj.startDate,
                    key: color.id,
                    color: color.hexCode
                }
                RealmSchema.create('Dots', dot, true);*/
            }

            if (obj.isOnlineMeeting) {
                //console.log("OnlineMeetings >>>> " + JSON.stringify(onlineMeeting))
                RealmSchema.create('OnlineMeetings', onlineMeeting, true);
            }

            if (attendees.length != 0) {
                attendees.map((attend) => {
                    RealmSchema.create('Attendees', attend, true);
                });
            }

            if (attachments.length != 0) {
                attachments.map((attach) => {
                    RealmSchema.create('Attachments', attach, true);
                });
            }

            obj.reminders = RealmSchema.objects('Reminders').filtered(`id == "${obj.id}"`);
            obj.color = RealmSchema.objects('Colors').filtered(`id == "${obj.id}"`);
            //obj.dots = RealmSchema.objects('Dots').filtered(`startDate == "${obj.startDate}"`);
            obj.attendees = RealmSchema.objects('Attendees').filtered(`id == "${obj.id}"`);
            obj.attachments = RealmSchema.objects('Attachments').filtered(`id == "${obj.id}"`);
            obj.onlineMeeting = RealmSchema.objects('OnlineMeetings').filtered(`id == "${obj.id}"`);
            saved = RealmSchema.create('PlannerSchemas', obj, true);
        });
        return saved;
    },
    update: function (id, updatedEvents, color, reminders, onlineMeeting, attendees, attachments) {
        //console.log('PlannerSchema update :>>>> ' + updatedEvents.startDate + " == " + JSON.stringify(color))
        RealmSchema.write(() => {

            var colorObj = RealmSchema.objects('Colors').filtered(`id == "${id}"`);

            colorObj[0].value = color.value
            colorObj[0].colorId = color.colorId
            colorObj[0].hexCode = color.hexCode
            colorObj[0].label = color.label

            RealmSchema.delete(
                RealmSchema.objects('Attendees').filtered(`id == "${id}"`),
            )

            if (attendees.length != 0) {
                attendees.map((attend) => {
                    RealmSchema.create('Attendees', attend, true);
                });
            }

            RealmSchema.delete(
                RealmSchema.objects('Attachments').filtered(`id == "${id}"`),
            )

            if (attachments.length != 0) {
                attachments.map((attach) => {
                    RealmSchema.create('Attachments', attach, true);
                });
            }

            RealmSchema.delete(
                RealmSchema.objects('Reminders').filtered(`id == "${id}"`),
            )

            reminders.map((reminder) => {
                RealmSchema.create('Reminders', reminder, true);
            })

            RealmSchema.delete(
                RealmSchema.objects('OnlineMeetings').filtered(`id == "${id}"`),
            )

            if (updatedEvents.isOnlineMeeting) {
                RealmSchema.create('OnlineMeetings', onlineMeeting, true);
            }


            let events = RealmSchema.objects('PlannerSchemas').filtered(`id == "${id}"`);
            events[0].subject = updatedEvents.subject
            events[0].description = updatedEvents.description
            events[0].startDate = updatedEvents.startDate
            events[0].startTime = updatedEvents.startTime
            events[0].endDate = updatedEvents.endDate
            events[0].endTime = updatedEvents.endTime
            /*events[0].isOnlineMeeting = updatedEvents.isOnlineMeeting
            evetns[0].location = updatedEvents.location*/
            events[0].hexCode = color.hexCode
            events[0].color = RealmSchema.objects('Colors').filtered(`id == "${id}"`);
            events[0].reminders = RealmSchema.objects('Reminders').filtered(`id == "${id}"`);          
            events[0].attachments = RealmSchema.objects('Attachments').filtered(`id == "${id}"`);
            events[0].attendees = RealmSchema.objects('Attendees').filtered(`id == "${id}"`);
            events[0].onlineMeeting = RealmSchema.objects('OnlineMeetings').filtered(`id == "${id}"`);

        })
    },
    delete: function () {
        //console.log('PlannerSchemas delete :>>>>> ');
        RealmSchema.write(() => {
            RealmSchema.delete(
                RealmSchema.objects('PlannerSchemas'),
            );
            RealmSchema.delete(
                RealmSchema.objects('Reminders'),
            );
            
            RealmSchema.delete(
                RealmSchema.objects('Colors'),
            );             
            RealmSchema.delete(
                RealmSchema.objects('Attendees'),
            );
            RealmSchema.delete(
                RealmSchema.objects('OnlineMeetings'),
            );
            RealmSchema.delete(
                RealmSchema.objects('Attachments'),
            );
        });
    },
    saveAttachment: function (attach) {
        RealmSchema.write(() => {
            //console.log("Inserting Attachments -- " + JSON.stringify(attach))
            RealmSchema.create('Attachments', attach, true);
        })
    },
    updateAttachmentInPlanner: function (attach) {
        RealmSchema.write(() => {
            let events = RealmSchema.objects('PlannerSchemas').filtered(`id == "${attach.id}"`);
            //console.log("Update Attachments in Event -- " + JSON.stringify(events[0]))
            let attachments = RealmSchema.objects('Attachments').filtered(`id == "${attach.id}"`);
            //console.log("Get Attachments  -- " + JSON.stringify(attachments))
            events[0].attachments = attachments
        })
    },
    findAllByStartDate: function (startDate) {
        return RealmSchema.objects('PlannerSchemas').sorted('startDate', false).filtered(`startDate == "${startDate}"`);
    },
    findAllByEndDate: function (endDate) {
        return RealmSchema.objects('PlannerSchemas').filtered(`endDate == "${endDate}"`);
    },
    findAllByDistinctStartDate: function () {
        return RealmSchema.objects('PlannerSchemas').sorted('startDate', true).filtered(`TRUEPREDICATE  DISTINCT(startDate)`);
    },
    findById: function (id) {
        return RealmSchema.objects('PlannerSchemas').filtered(`id == "${id}"`);
    },
    findAttachmentByFileId: function (fileId) {
        return RealmSchema.objects('Attachments').filtered(`fileId == "${fileId}"`);
    },
    findAttachmentById: function (id) {
        return RealmSchema.objects('Attachments').filtered(`id == "${id}"`);
    },
    findAll: function () {
        return RealmSchema.objects('PlannerSchemas').sorted('startDate', false);
    },
}
module.exports = PlannerRealmService