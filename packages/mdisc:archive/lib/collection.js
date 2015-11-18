MdArchive = {};
MdArchive.collection = WtCollection('md_archive');
MdArchive.subscription = WtCollection('md_subscription');
MdArchive.files = new Mongo.Collection('md_archive_files'); // this is not published data
