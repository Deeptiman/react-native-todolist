import { Client } from '@microsoft/microsoft-graph-client';
import { GraphAuthProvider } from './MSGraphAuthProvider';

// Set the authProvider to an instance
// of GraphAuthProvider
const clientOptions = {
  authProvider: new GraphAuthProvider()
};

// Initialize the client
const graphClient = Client.initWithMiddleware(clientOptions);

export class MSGraphManager {
  static getUserAsync = async () => {
    // GET /me
    return graphClient.api('/me').get();
  }
  static getUserPhotoAsync = async () => {
    // GET /me
    return graphClient.api('/me/photos/48x48/$value').get();
  }

  static getUserCalendarAsync = async () => {
    // GET /me
    return graphClient.api('/me/events').select('id,subject,body,bodyPreview,organizer,start,end,attendees,location,onlineMeeting,reminderMinutesBeforeStart,isReminderOn,webLink,showAs').orderby('createdDateTime DESC').get();
  }

  static addCalendarAsync = async (id, event) => {
    console.log("addCalendarAsync >> " + id + " :::: " + event.subject)
    graphClient.api('/me/events').post(event, (err, res) => {
      console.log("Add Microsoft Calendar >>> res = " + JSON.stringify(res) + " , err = " + JSON.stringify(err));
      if (res === null) {
        return err
      } else {
        return res
      }
    })
  }
}