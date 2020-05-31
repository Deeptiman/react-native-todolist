# reac-native-todolist

The react-native-todolist application is a cross-platform mobile application developed using the React-Native framework with Redux implementation. The application has features to create a calendar in both Google & Microsoft cloud platforms, users can also receive a push notification from the server based on topic subscription.

# Features!
  - Social SignIn with Google, Microsoft, Facebook.
  - Google & Microsoft Calendar integration that user can create new events.
  - Upload attachements with Google Drive and One Drive. 
  - Share events to social apps.
  - Receive push-notification from server based on topic subscription.

# Installing dependencies
 There are few environment setups required to install the dependencies for the development of a cross-platform application using React-Native.
  
##### React-Native Cli Setup
- Download and Install Node.js
    - Windows & macOS - https://nodejs.org/en/download/
    - Linux - `sudo apt install nodejs npm`
- React-Native Cli can install using npm command
    `npm install -g react-native-cli`

##### Android Installation dependencies
- The Android development setup requires Android Studio and JDK (Java Development Kit).
- ###### Java Development Kit : https://www.oracle.com/java/technologies/javase-jdk8-downloads.html
- ###### Install Android Studio : 

    Download and Install Android Studio with the following link which can be used to install across all operating systems (Windows, Linux & macOS).
https://developer.android.com/studio/index.html
- Configure `ANDROID_HOME` environmental variable
    ###### Windows -
    - Right Click on `My Computer` .
    - Click on `Properties` then in the left panel Choose `Advanced system settings`.
    - In the dialog box Click on `Environment Variables` .
    - After that in the user variable click on `New` and create a new `ANDROID_HOME` variable and the value will the local installation path of Android SDK
    ###### Linux & Mac OS -
    - ###### Open the terminal and type
        `$nano ~/.bash_profile`
        `$ export ANDROID_HOME=/YOUR_PATH_TO/android-sdk`
        `$ export PATH=$ANDROID_HOME/platform-tools:$PATH`
        `$source ~/.bash_profile` 

##### iOS Installation dependencies
- The iOS installation depends on Xcode that can be installed via the mac AppStore.
- The latest version of `Xcode 9.4` or the latest has to be installed in the system
    ##### Xcode Command Line Tools
    There are a few Xcode command-line tools that need to be installed.
    - Open `Xcode` , then choose `Preference` from the Xcode menu.
    - Go to the `Location` panel and install the tools by selecting from the most recent version of the command-line tool from the dropdown.
    ##### Installing iOS simulator in Xcode
    Open `Xcode` -> Preference and then select a simulator that will be compatible with the installed `iOS` version.
    ##### CocoaPods
    This is a dependency manager that will install the required libraries for iOS development. The CocoaPods application is written in Ruby.

    `sudo gem install cocoapods`

    For more information on CocoaPods Guide -
    https://guides.cocoapods.org/using/getting-started.html

#### Running React-Native application
To start the application on both `Android` & `iOS` , there are two different command needs to be followed.
##### Android - `npx react- native run-android`
##### iOS - `npx react- native run-ios`

## Redux
Redux is an open-source JavaScript library for managing and organizing application state . There are major concepts like `actions` , `reducers` , and `stores` that Redux provides to implement a universal state for an entire application lifecycle.

> Official Documentation - https://redux.js.org/

##### Installation
``` sh
$ npm install redux
$ npm install react-redux
$ npm install redux-thunk
$ npm install redux-logger
```

# npm modules
- [react -native-google-signin](https://www.npmjs.com/package/react-native-google-signin)
- [react -native-app-auth](https://www.npmjs.com/package/react-native-app-auth)
- [react -native-fbsdk](https://www.npmjs.com/package/react-native-fbsdk)
- [@react -native-firebase/auth](https://www.npmjs.com/package/@react-native-firebase/auth)
- [@react -native-firebase/database](https://www.npmjs.com/package/@react-native-firebase/database)
- [@react -native-firebase/messaging](https://www.npmjs.com/package/@react-native-firebase/messaging)
- [react -native-google-drive-api-wrapper](https://www.npmjs.com/package/react-native-google-drive-api-wrapper)
- [react -native-share](https://www.npmjs.com/package/react-native-share)

# Social SignIn (Google, Microsoft, Facebook)
The application supports Social SignIn that users can authenticate into the app using `Google` , `Microsoft` , `Facebook`, and also normal email-based SignIn integrated Google `Firebase`.
    
##### Code Location
 ```sh
    - /src/components/login/LoginComponent.js
 ```

#### SignIn With Google
In the configuration initialization, there are required scopes that need to be defined. As these applications need `Google Calendar` , `Google Drive` integration of the APIs needs to be enabled in the `Google Cloud Platform`. And the API access scopes are required to mention in the scope array. So, that during User login it will show as a consent screen that what are access list is required from the user Google account.
#### Scope
```sh
GoogleSignin.configure({
scopes : [
'https://www.googleapis.com/auth/calendar.readonly',
'https://www.googleapis.com/auth/calendar' ,
'https://www.googleapis.com/auth/calendar.events' ,
'https://www.googleapis.com/auth/drive' ,
'https://www.googleapis.com/auth/drive.appdata' ,
'https://www.googleapis.com/auth/drive.file' ,
'https://www.googleapis.com/auth/drive.readonly' ,
'https://www.googleapis.com/auth/drive.metadata.readonly' ,
'https://www.googleapis.com/auth/drive.metadata' ,
'https://www.googleapis.com/auth/drive.photos.readonly' ],
webClientId :
'YOUR_WEB_CLIENT_ID' ,
forceConsentPrompt : true
});
```

#### SignIn With Microsoft
The `Microsoft SignIn` is integrated by using the `react-native-app-auth` module. This module provides an `OAuth` based client authentication the technique that the developer can pass the configuration details for any cloud platforms to integrate the authentication module.

##### Code location
```sh
- /src/components/auth/MSAuthManager.js
- /src/components/auth/MSGraphAuthProvider.js
- /src/components/auth/MSGraphManager.js
- /src/components/login/LoginComponent.js
```

#### Scope
```sh
const config = {
clientId : 'YOUR_MICROSOFT_AZURE_CLIENT_ID' ,
redirectUrl : Platform.OS === 'ios' ? 'YOUR_MICROSOFT_AZURE_IO_REDIRECT_URL' :
'graph-tutorial://react-native-auth' ,
scopes : [
'openid' ,
'offline_access' ,
'profile' ,
'user.read' ,
'Calendars.ReadWrite' ,
'Files.ReadWrite.All' ,
'Sites.ReadWrite.All' ,
'MailboxSettings.ReadWrite'
],
additionalParameters : { prompt : 'select_account' },
serviceConfiguration : {
authorizationEndpoint :
'https://login.microsoftonline.com/common/oauth2/v2.0/authorize' ,
tokenEndpoint :
'https://login.microsoftonline.com/common/oauth2/v2.0/token' ,
}
};
```

#### SignIn With Facebook
The `Facebook` SignIn integration requires the `react-native-fbsdk` module that provides several `Facebook Graph APIs` request.

```sh
_signInWithFacebook = async () => {
const result = await LoginManager.logInWithPermissions([ 'public_profile' ,
'email' ]);
if (result.isCancelled) {
console .log( 'User cancelled the login process' );
} else {
// Once signed in, get the users AccesToken
const data = await AccessToken.getCurrentAccessToken();
if (!data) {
console .log( 'Something went wrong obtaining access token' );
}
console .log( "FACEBOOK ACCESS TOKEN :::: " + data.accessToken)
const facebookCredential = auth.
FacebookAuthProvider.credential(data.accessToken);
await auth().signInWithCredential(facebookCredential);
const infoRequest = await new GraphRequest( '/me' , {
parameters : {
'fields' : {
'string' : 'email,first_name,last_name,picture'
}
}
}, (err, res) => {
});
await new GraphRequestManager().addRequest(infoRequest).start();
}
}
```

#### SignIn With Email
The application uses `Email` based SignIn with `Firebase` using the  `react-native-firebase` module. The implementation is simple that developers need to pass only `email` & `password` parameters without any other configuration requirements. However, the `Firebase` App needs to created in the `Firebase Cloud Platform` before integrating it into the application.
```sh
_signInWithEmail = () => {
auth()
.signInWithEmailAndPassword( this .state.email, this .state.password)
.then((data) => {
console .log( "Successful SignIn" )
})
.catch((error) => {
Alert.alert( 'Error' , 'Signin Error - ' + error.message);
})
}
```

# Calendar Integration
`Google Calendar` and `Microsoft Calendar` are the major cloud-based calendar
integration in the application. However, the application also allows creating a calendar for `Facebook` and `Firebase` SignIn users that the calendar data get stored in the `Firebase Database`.

### Google Calendar
In this application, users can create a `Google Calendar` with `attachments`, `event colors`, `Hangout Conference` , `Inviting Attendees` to an event. So, Google Calendar provides Cloud-based REST APIs that can be integrated into the application.

##### Code location
```sh
- /src/actions/GoogleCalendar.js
```
###### Google Calendar API : https://developers.google.com/calendar/v3/reference

### Google Drive
The `react-native-google-drive-api-wrapper` module has been integrated to upload a file into `Google Drive`. The request body contains the `base64` blob for the local storage file.

### Microsoft Calendar
In this application, user can create a `Microsoft calendar` with additional features like create `Team conference` , `event color`, `add attachments` to an event, `invite attendees` to an event.

##### Code location
```sh
- /src/actions/MicrosoftCalendar.js
```

###### Microsoft Graph API : https://docs.microsoft.com/en-us/graph/api/resources/calendar?view=graph-rest-beta

### One Drive
The attachments integration to an event requires several layers of `Microsoft Graph API` request. The feature requires to integrate `OneDrive` into the API request flow.
##### API request flow
- ##### Upload file
    In the first step, the files need to upload into the `OneDrive` cloud to receive the list of `OneDrive IDs` for each file. The `base64` blob will be sent in the request parameter.
- ##### Create a Share Link
   After uploading each file into the `OneDrive` , a `shareable link` needs to be created using `Microsoft Graph API`.
- ##### Add Shareable Link to the event
    The shareable link can be added to an event after the event creation. `Microsoft Graph API` doesn't include attachments request parameters in the event creation. So, there is a completely separate API to attach a link to the events using the created eventId.
- ##### Send Invite for access permission
    To access the attached link of the event, each attendee needs access permission from the `organizer`. So, in the request parameter the array of attendees email needs to be included.

### Firebase Calendar
The users that are signed-in via `Facebook` and `Firebase` can able to create a calendar with Firebase database but the features like adding attachments, online conference, invite attendees, set reminders will not be supported.

##### Code location
```sh
- /src/actions/FirebaseCalendar.js
```

## Share Events to Social Apps
In this application, the user can share an event in any `Social Apps`. However the sharing functionality will only work with `Google` & `Microsoft` created events that generates an event web link.

##### Code location
```sh
- /src/components/calendar/EventDetailsComponent.js
```

## Push Notification
This application has a feature that the user can receive a `push notification` via `Firebase Cloud Messaging` servie. User can subscribe to a topic to receive notification an alert.

### Sending Push Notification API
##### API endpoint
```sh
https://fcm.googleapis.com/fcm/send
```
##### Request Payload
```sh
{
	"notification": {
		"title": "Spacex successfully launched first crew to orbit",
		"body": "NASA astronauts Bob Behnken and Doug Hurley are on their way to the space station",
		"icon": "mipmap/ic_app_logo",
		"color": "#000",
		"tag": "Science",
		"local_only": true,
		"default_sound": true,
		"notification_priority": "high",
		"visibility": "public",
		"sound": "default",
		"channel_id": "test-channel",
		"image": "https://example.com/test.png"
	},
	"data": {
  "title": "Spacex successfully launched first crew to orbit",
  "body": "NASA astronauts Bob Behnken and Doug Hurley are on their way to the space station",
  "topic": "Science",
  "small_text": "hello",
  "big_text": "NASA astronauts Bob Behnken and Doug Hurley are on their way to the space station",
  "time": "273737",
  "image": "https://example.com/test.png",
  "foreground": true,
  "android_channel_id": "test-channel"
 },
	"priority": "high",
	"to": "/topics/Science"
}
```

## Screenshots
