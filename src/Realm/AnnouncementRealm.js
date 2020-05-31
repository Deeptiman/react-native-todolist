import RealmSchema from './RealmSchema';

let AnnouncementRealmServices = {
    save: function(obj){
        var saved = null;
        RealmSchema.write(() => {
            saved = RealmSchema.create('Announcements', obj, true);
        });
        return saved;        
    },    
    delete: function () {
        console.log('AnnouncementSchemas delete :>>>>> ');
        RealmSchema.write(() => {
            RealmSchema.delete(
                RealmSchema.objects('Announcements'),
            );            
        });
    },
    findAll: function(){
        return RealmSchema.objects('Announcements').sorted('time', 'descending');
    },
    findByTime: function (time) {
        return RealmSchema.objects('Announcements').filtered(`time == "${time}"`);
    }
};
module.exports = AnnouncementRealmServices;
