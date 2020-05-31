import RealmSchema from './RealmSchema';

let AuthRealmServices = {
    save: function (obj) {
        var saved = null;
        RealmSchema.write(() => {
            saved = RealmSchema.create('AuthSchemas', obj, true);
        });
        return saved;
    },
    updatePhoneNumber: function(phone, email) {
        RealmSchema.write(() => {
            let userObj = RealmSchema.objects('AuthSchemas').filtered(`email == "${email}"`)
            userObj[0].phone = phone
        });        
    },
    updateSyncStatus: function (email, status) {
        console.log("updateSyncStatus === "+email+" --- "+status)
        RealmSchema.write(() => {
            let userObj = RealmSchema.objects('AuthSchemas').filtered(`email == "${email}"`)
            console.log("userObj --> "+JSON.stringify(userObj))
            userObj[0].isSynced = status
        });
    },   
    delete: function (key) {
        console.log('AuthSchemas delete :>>>>> ' + key);
        RealmSchema.write(() => {
            RealmSchema.delete(
                RealmSchema.objects('AuthSchemas').filtered(`email == "${key}"`),
            );
        });
    },
    find: function () {
        return RealmSchema.objects('AuthSchemas')
    }
};
module.exports = AuthRealmServices;
