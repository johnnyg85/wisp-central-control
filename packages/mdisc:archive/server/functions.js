MdArchive.addFileData = function (archiveId, files, estimatedSize) {
  var data = {
    files: files,
    estimatedSize: estimatedSize,
    initDone: true
  };
  MdArchive.collection.update({_id: archiveId}, {$set: data});
}