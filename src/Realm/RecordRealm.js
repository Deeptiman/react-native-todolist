import RealmSchema from './RealmSchema';

let RecordRealmService = {
    save: function(obj){
        var saved = null;
        RealmSchema.write(() => {
            saved = RealmSchema.create('RecordSchemas', obj, true);
        });
        return saved;        
    },
    delete: function() {
        console.log('RecordSchemas delete :>>>>> ');
        RealmSchema.write(() => {
          RealmSchema.delete(
            RealmSchema.objects('RecordSchemas'),
          );
        });
    },
    findAll: function() {
        return RealmSchema.objects('RecordSchemas').sorted('id', 'descending');
    }
}
module.exports = RecordRealmService