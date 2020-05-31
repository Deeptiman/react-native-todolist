import AuthRealmServices from '../../Realm/AuthRealm';

export class Utils {

    static ALL_TOPIC = "all"
    static FIREBASE_LOGIN_TYPE = "firebase"
    static GOOGLE_LOGIN_TYPE = "google"
    static MICROSOFT_LOGIN_TYPE = "microsoft"
    static FACEBOOK_LOGIN_TYPE = "facebook"

    static APP_MIN_CALENDAR_DATE = '2020-01-01'

    static MAXIMUM_ATTACHMENT_FILE_SIZE = 2000000
    static MAXIMUM_ATTACHMENTS = 4
    static READ_ATTACHMENT_FILE_TYPE = 'base64'
    static ERROR_MSG_ATTACHMENTS_LIMIT = 'Maximum 4 attachments allowed for an event'

    static MAXIMUM_ATTENDEES = 4
    static ERROR_MSG_ATTENDEES_LIMIT = 'Maximum 5 attendees are allowed to an event'

    static MAXIMUM_RECORDING_TIME = 3600 //in seconds

    static SYNC_CALENDAR_MSG = "Calendar Synced successfully"

    //////////////////////////////////////// Screen Names /////////////////////////////////////

    static LOGIN_SCREEN = "Login"
    static SIGN_UP_SCREEN = "Signup"
    static SETUP_CALENDAR_SCREEN = "Setup"
    static DASHBOARD_SCREEN = "Dashboard"
    static CREATE_PLANNER_SCREEN = "CreatePlanner"
    static RECORD_AUDIO_SCREEN = "Record"
    static CHAT_MESSAGE_SCREEN = "Message"
    static SHOW_EVENT_SCREEN = "Event"
    static PLANNER_LIST_SCREEN = "Search"
    static ALL_PLANNERS = "All"
    static ANNOUNCEMENT_SCREEN = "Announcement"
    static SHOW_ANNOUNCEMENT_DETAIL_SCREEN = "AnnoucementDetails"

    ////////////////////////////////////////////////////////////////////////////////////////////


    static currentUser = () => {

        var user = AuthRealmServices.find();
        return AuthRealmServices.find();
    }

    static nonSocialLogin =  (loginType) => {
        return loginType === this.FACEBOOK_LOGIN_TYPE || loginType === this.FIREBASE_LOGIN_TYPE
    }

    static socialLogin =  (loginType) => {
        return loginType === this.GOOGLE_LOGIN_TYPE || loginType === this.MICROSOFT_LOGIN_TYPE
    }

    static totalMinutes = 120     // 120
    static totalHours = 120 * 60   // 7200
    static totalDays = 20 * 1440  // 28800
    static totalWeeks = 4 * 10080 // 40320

    static totalTimes = [this.totalMinutes, this.totalHours, this.totalDays, this.totalWeeks]
    static factors = [1, 60, 1440, 10080]
    static labels = ["minutes", "hours", "days", "weeks"]

    /*****************************CALENDAR API REQUEST ***********************************/

    static AUTH_REQUEST_TOKEN = 'Bearer '
    static SAMPLE_TIME_ZONE = 'Europe/Zurich'
    static SAMPLE_LOCATION = 'Nicosia, Cyprus'

    // Date & Time 
    static replaceAMPM = (time) => {
        return time.replace(" pm", "").replace(" am", "").replace(" AM", "").replace(" PM", "");
    }
    static DATE_FORMAT = "YYYY-MM-DD"
    static TIME_FORMAT = "hh:mm a"
    static UI_DATE_TIME_FORMART = "MMM dddd, YYYY"

    //Google Cloud
    static GOOGLE_CLOUD_APP = "YOUR_GOOGLE_CLOUD_APP";

    //Google Calendar
    static GOOGLE_CALENDAR_URL = "https://www.googleapis.com/calendar/v3/calendars/"
    static GOOLE_CALENDAR_GET_EVENTS_ENDPOINT = "/events?timeMin=2020-01-01T00:00:00Z&singleEvents=true"
    static GOOGLE_CALENDAR_POST_EVENT_WITH_HANGOUT_ENABLED_ENDPOINT = "/events?conferenceDataVersion=1&&sendUpdates=all&&supportsAttachments=true"
    static GOOGLE_CALENDAR_POST_EVENT_ENDPOINT = "/events?sendUpdates=all&&supportsAttachments=true"
    static GOOGLE_DRIVE_ENDPOINT = "https://drive.google.com/open?id="
    static GOOGLE_DRIVE_PERMISSION_TYPE = "anyone"
    static GOOGLE_DRIVE_USER_ROLE = "reader"
    static getDefaultGoogleColor =  (eventId) => {
        return {
            id: eventId,
            colorId: 1,
            value: "1",
            hexCode: "#6A89D7",
            label: "Lavender"
        }
    }
    static DEFAULT_HexCode_GOOGLE = "#6A89D7"

    //Microsoft Azure
    static MICROSOFT_AZURE_CLIENT_ID = "YOUR_MICROSOFT_AZURE_CLIENT_ID"
    static MICROSOFT_AZURE_REDIRECT_IOS_URL = "YOUR_MICROSOFT_AZURE_IO_REDIRECT_URL"
    static MICROSOFT_AZURE_REDIRECT_ANDROID_URL = "graph-tutorial://react-native-auth"

    //Microsoft Calendar
    static MICROSOFT_CALENDAR_URL = "https://graph.microsoft.com/beta/me";
    static ONEDRIVE_ATTACHMENT_HEADER = 'public-read'
    static MICROSOFT_GRAPH_DATA_TYPE = "#microsoft.graph.referenceAttachment"
    static MICROSOFT_CONFERENCE_PARTNER = "teamsForBusiness"
    static ONE_DRIVE_PROVIDER_TYPE = "oneDriveConsumer"
    static ONE_DRIVE_FILE_ACCESS_PERMISSION = "Edit"
    static ONE_DRIVE_REQUIRE_SIGNIN = false
    static ONE_DRIVE_SEND_INVITATION = true
    static ONE_DRIVE_ACCESS_ROLE = "read"
    static IS_FILE_SAVE_ONE_DRIVE_FOLDER = true
    static microsoftGetAttachmentUrl =  (fileName) => {
        return this.MICROSOFT_CALENDAR_URL + "/drive/items/root:/" + fileName + ":/content"
    }
    static createOneDriveLink =  (oneDriveId) => {
        return this.MICROSOFT_CALENDAR_URL + "/drive/items/" + oneDriveId + "/createLink"
    }
    static addAttachmentToEvent =  (eventId) => {
        return this.MICROSOFT_CALENDAR_URL + "/events/" + eventId + "/attachments"
    }
    static sendOneDriveInvite =  (oneDriveId) => {
        return this.MICROSOFT_CALENDAR_URL + "/drive/items/" + oneDriveId + "/invite"
    }
    static getAttachmentByEventId =  (eventId) => {
        return this.MICROSOFT_CALENDAR_URL + "/events/" + eventId + "/attachments"
    }
    static getDefaultMicrosoftColor =  (eventId) => {
        return {
            id: eventId,
            colorId: 1,
            value: "Preset5",
            hexCode: "#017474",
            label: "Teal"
        }
    }
    static DEFAULT_HexCode_Microsoft = "#017474"

    /////////////////////////////////////////////////////////////////////////////////////////////

    static getMinutes =  (type, time) => {

        if (type === 'Minutes') {
            return time;
        } else if (type === 'Hours') {
            return 60 * time;
        } else if (type === 'Days') {
            return 1440 * time;
        } else if (type === 'Weeks') {
            return 10080 * time;
        }
    }

    static needAction =  (response) => {
        return response === 'needsAction' || response === 'none'
    }

    static accepted =  (response) => {
        return response === 'accepted'
    }

    static declined =  (response) => {
        return response === 'declined'
    }

    static tentative =  (response) => {
        return response === 'tentative' || response === 'tentativelyAccepted'
    }

    static getColors =  (loginType) => {
        if (loginType === this.GOOGLE_LOGIN_TYPE) {
            return this.googleColors
        } else if (loginType === this.MICROSOFT_LOGIN_TYPE) {
            return this.microsoftColors
        } else if (this.nonSocialLogin(loginType)) {
            return this.firebaseColors
        }
    }

    static getDefaultColorCode =  (loginType) => {
        return (loginType === this.GOOGLE_LOGIN_TYPE || this.nonSocialLogin(loginType)) ? "1" : "Preset5"
    }

    static googleColors = [
        { id: 1, value: "1", color: "#6A89D7", label: "Lavender" },
        { id: 2, value: "2", color: "#42CA98", label: "Saga" },
        { id: 3, value: "3", color: "#A36CCF", label: "Mauve" },
        { id: 4, value: "4", color: "#D6685D", label: "Vivid Tangerine" },
        { id: 5, value: "5", color: "#E3B209", label: "Dandelion" },
        { id: 6, value: "6", color: "#E3944C", label: "Macaroni and Cheese" },
        { id: 7, value: "7", color: "#31BCC1", label: "Turquoise" },
        { id: 8, value: "8", color: "#8C8B8B", label: "Mercury" },
        { id: 9, value: "9", color: "#2158CF", label: "Cornflower Blue" },
        { id: 10, value: "10", color: "#1D8C15", label: "Apple" },
        { id: 11, value: "11", color: "#C1060C", label: "Alizarin Crimson" }]

    static firebaseColors = [
        { id: 1, value: "1", color: "#6A89D7", label: "Lavender" },
        { id: 2, value: "2", color: "#42CA98", label: "Saga" },
        { id: 3, value: "3", color: "#A36CCF", label: "Mauve" },
        { id: 4, value: "4", color: "#D6685D", label: "Vivid Tangerine" },
        { id: 5, value: "5", color: "#E3B209", label: "Dandelion" },
        { id: 6, value: "6", color: "#E3944C", label: "Macaroni and Cheese" },
        { id: 7, value: "7", color: "#31BCC1", label: "Turquoise" },
        { id: 8, value: "8", color: "#8C8B8B", label: "Mercury" },
        { id: 9, value: "9", color: "#2158CF", label: "Cornflower Blue" },
        { id: 10, value: "10", color: "#1D8C15", label: "Apple" },
        { id: 11, value: "11", color: "#C1060C", label: "Alizarin Crimson" }]

    static microsoftColors = [
        { value: "Preset0", id: 1, color: "#DF0000", label: "Red" },
        { value: "Preset1", id: 2, color: "#D69010", label: "Orange" },
        { value: "Preset2", id: 3, color: "#A11C1C", label: "Brown" },
        { value: "Preset3", id: 4, color: "#C9C910", label: "Yellow" },
        { value: "Preset4", id: 5, color: "#087608", label: "Green" },
        { value: "Preset5", id: 6, color: "#017474", label: "Teal" },
        { value: "Preset6", id: 7, color: "#797903", label: "Olive" },
        { value: "Preset7", id: 8, color: "#2424AE", label: "Blue" },
        { value: "Preset8", id: 9, color: "#641464", label: "Purple" },
        { value: "Preset9", id: 10, color: "#900613", label: "Cranberry" },
        { value: "Preset10", id: 11, color: "#41588B", label: "Steel" },
        { value: "Preset11", id: 12, color: "#5B71A3", label: "Dark Steel" },
        { value: "Preset12", id: 13, color: "#4C4748", label: "Gray" },
        { value: "Preset13", id: 14, color: "#4D4A4A", label: "Vampire Gray" },
        { value: "Preset14", id: 15, color: "#101010", label: "Black" },
        { value: "Preset15", id: 16, color: "#C0000B", label: "Ferrari Red" },
        { value: "Preset16", id: 17, color: "#CA5200", label: "Pumpkin Orange" },
        { value: "Preset17", id: 18, color: "#785131", label: "Brown Bear" },
        { value: "Preset18", id: 20, color: "#C2A503", label: "Rubber Ducky Yellow" },
        { value: "Preset19", id: 21, color: "#264615", label: "Dark Forest Green" },
        { value: "Preset20", id: 22, color: "#2C614E", label: "Medium Sea Green" },
        { value: "Preset21", id: 23, color: "#687E0C", label: "Venom Green" },
        { value: "Preset22", id: 24, color: "#010173", label: "Dark Blue" },
        { value: "Preset23", id: 25, color: "#5A0B92", label: "Purple Daffodil" },
        { value: "Preset24", id: 26, color: "#850F1D", label: "Dark Cranberry" }
    ]
}