import Realm from 'realm';

const AuthSchemas = {
    name: 'AuthSchemas',
    primaryKey: 'id',
    properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        photoURL: { type: 'string' },
        name: { type: 'string' },
        accessToken: { type: 'string' },
        loginType: { type: 'string' },
        isLoggedIn: { type: 'bool' },
        isSynced: { type: 'bool' },      
    },
};

const ReminderSchemas = {
    name: 'Reminders',
    properties: {
        id: { type: 'string' },
        method: { type: 'string' },
        minutes: { type: 'int' },
        timeLabel: { type: 'string' }
    }
}

const OnlineMeetings = {
    name: 'OnlineMeetings',
    properties: {
        id: { type: 'string' },
        videoLink: { type: 'string' },
        phoneNumber: { type: 'string' },
        conferenceId: { type: 'string' }
    }
}

const Attendees = {
    name: 'Attendees',
    properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        response: { type: 'string' }
    }
}

const Attachments = {
    name: 'Attachments',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        fileId: { type: 'string' },
        fileUrl: { type: 'string' }
    }
}

const UploadAttachments = {
    name: 'UploadAttachments',
    properties: {
        fileId: { type: 'string' },
        fileName: { type: 'string' },
        fileUrl: { type: 'string' }
    }
}

const Announcements = {
    name: 'Announcements',
    properties: {
        title: { type: 'string' },
        body: { type: 'string' },
        smallText: { type: 'string' },
        bigText: { type: 'string' },
        image: { type: 'string' },
        topic: { type: 'string' },
        time: { type: 'string' }
    }
}

const DotSchemas = {
    name: 'Dots',
    properties: {
        startDate: { type: 'string' },
        key: { type: 'string' },
        color: { type: 'string' }
    }
}

const ColorSchemas = {
    name: 'Colors',
    properties: {
        id: { type: 'string' },
        value: { type: 'string' },
        colorId: { type: 'int' },
        hexCode: { type: 'string' },
        label: { type: 'string' }
    }
}

const PlannerSchemas = {
    name: 'PlannerSchemas',
    primaryKey: 'id',
    properties: {
        id: { type: 'string' },
        subject: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string' },
        weblink: { type: 'string' },
        location: { type: 'string' },
        organizer: { type: 'string' },
        startDate: { type: 'string' },
        startTime: { type: 'string' },
        endDate: { type: 'string' },
        endTime: { type: 'string' },
        isOnlineMeeting: { type: 'bool' },
        color: { type: 'list', objectType: 'Colors' },
        hexCode: { type: 'string' },
        reminders: { type: 'list', objectType: 'Reminders' },
        onlineMeeting: { type: 'list', objectType: 'OnlineMeetings' },
        attendees: { type: 'list', objectType: 'Attendees' },
        attachments: { type: 'list', objectType: 'Attachments' },
        calType: { type: 'string' }
    },
};

const RecordSchemas = {
    name: 'RecordSchemas',
    primaryKey: 'path',
    properties: {
        id: { type: 'int' },
        path: { type: 'string' },
        fileName: { type: 'string' },
        timeStamp: { type: 'string' }
    }
}

let realmSchema = new Realm({
    schema: [AuthSchemas, PlannerSchemas, ReminderSchemas, OnlineMeetings, Announcements, Attendees, ColorSchemas, Attachments, UploadAttachments, RecordSchemas],
});
export default realmSchema