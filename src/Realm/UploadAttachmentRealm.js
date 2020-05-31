import RealmSchema from './RealmSchema';

let UploadAttachmentRealmServices = {
    save: function (obj) {
        var saved = null;
        RealmSchema.write(() => {
            saved = RealmSchema.create('UploadAttachments', obj, true);
        });
        return saved;
    },
    updateFileUrl: function (fileId, fileUrl) {
        RealmSchema.write(() => {
            let fileObj = RealmSchema.objects('UploadAttachments').filtered(`fileId == "${fileId}"`)
            fileObj[0].fileUrl = fileUrl
        });
    },
    delete: function () {
        console.log('UploadAttachments delete :>>>>> ');
        RealmSchema.write(() => {
            RealmSchema.delete(
                RealmSchema.objects('UploadAttachments')
            );
        });
    },
    findAll: function () {
        return RealmSchema.objects('UploadAttachments')
    }
};
module.exports = UploadAttachmentRealmServices;
