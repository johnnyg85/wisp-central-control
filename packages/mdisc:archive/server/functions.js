MdArchive.addFileData = function (archiveId, files) {
  var data = {
    files: files,
    initDone: true
  };
  MdArchive.collection.update({_id: archiveId}, {$set: data});
}