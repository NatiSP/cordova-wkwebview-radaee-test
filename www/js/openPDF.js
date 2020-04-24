function getFileSystem(fok, error) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fok, ferror);
}

function getDirEntry(fs, dirName, fok, ferror) {
    try {
        fs.root.getDirectory(dirName, {create: true}, fok, ferror);
    } catch (ex) {
        ferror(ex);
    }
}

function initDownload(doc, fok, ferror) {
    getFileSystem(function (filesystem) {
        getDirEntry(fs, "/Downloads", function (dirEntry) {
            try {
                var fileName = "testPDF.pdf";
                var url = "http://www.radaeepdf.com/documentation/MRBrochoure.pdf";
                var path = dirEntry.toURL() + fileName;
                var ft = new FileTransfer();
                var trustAllHost = true;
                var options = {
                    headers: {"Accept-Encoding":"identity"}
                };
                ft.download(url, path, function(fileEntry) {
                    console.log("Doc content downloaded in " + fileEntry.toURL());
                    fok(fileEntry.toURL);
                }, ferror, trustAllHost, options);
            } catch (ex) {
                ferror(ex);
            }
        }, ferror);
    }, ferror);
}

function openPDF() {
    //initDownload(0, function(url) {
        openRadaeeDoc("http://www.radaeepdf.com/documentation/MRBrochoure.pdf");
    //})
}

function openRadaeeDoc(url) {
    RadaeePDFPlugin.open(
        {
            url: url,
            password: "",
            readOnlyMode: true
        },
        function (m) {
            console.log("Opened: " + m + ". URL: " + url);
        },
        function (err) {
            console.log("Error: " + err);
        }
    )
}
