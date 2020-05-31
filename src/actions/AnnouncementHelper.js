export class AnnouncementHelper {

    static processNotification = async (data) => {

        var payload = []
        JSON.stringify(data, function (key, val) {
            if (val != null && typeof val == "object") {
                if (payload.indexOf(val) >= 0) {
                    return;
                }
                payload.push(val);
            }
            return val;
        })

        var data = payload[0]
        var title = data.title
        var body = data.body
        var smallText = data.small_text
        var bigText = data.big_text
        var image = data.image ? data.image : 'no image'
        var topic = data.topic
        var time = data.time
    
        var announcement = {
            title: title,
            body: body,
            smallText: smallText,
            bigText: bigText,
            image: image,
            topic: topic,
            time: time
        }

        console.log("fetchAnnouncement : " + JSON.stringify(announcement))

        return announcement
    }

    static triggerNotification = async(announcement) => {

        console.log("triggerNotification :: "+announcement)

    }

}