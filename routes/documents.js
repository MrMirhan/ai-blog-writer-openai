var express = require('express');
var router = express.Router();
const fs = require('fs');

function getDirs(path) {
    files = fs.readdirSync(path, { withFileTypes: true });
    const directoriesInDirectory = files.filter((item) => item.isDirectory()).map((item) => item.name);
    return directoriesInDirectory
}

function getFiles(path) {
    files = fs.readdirSync(path, { withFileTypes: true });
    const filesInDirectory = files.filter((item) => item['name'].split('.')[1] == "txt" && item['name'].split('.')[0] != '').map((item) => item['name'].split('.')[0]);
    return filesInDirectory
}

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('documents', { documentFolders: getDirs('./apiServer/documents/').sort((a, b) => b - a) })
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    folderId = req.params.id
    res.render('documents_id', { subFolders: getFiles('./apiServer/documents/' + folderId), directoryId: folderId })
});

router.get('/:folderId/:documentId', function(req, res, next) {
    folderId = req.params.folderId
    documentId = req.params.documentId
    res.render('document', { documentTitle: titleCase(documentId.split('_').join(" ")), documentContent: fs.readFileSync('./apiServer/documents/' + folderId + '/' + documentId + '.txt', { encoding: 'utf8', flag: 'r' }).toString(), directoryId: folderId })
});

module.exports = router;