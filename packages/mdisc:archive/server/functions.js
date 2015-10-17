MdArchive.addFileData = function (archiveId, files, estimatedSize) {
  var data;

  // Add files
  data = {
    archiveId: archiveId,
    files: files
  };
  var filesId = MdArchive.files.insert(data);

  // Update 
  data = {
    filesId: filesId,
    estimatedSize: estimatedSize,
    initDone: true
  };
  MdArchive.collection.update({_id: archiveId}, {$set: data});
}