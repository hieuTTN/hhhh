var token = localStorage.getItem('token');
async function requestGet(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    return response;
};



async function uploadFile(filePath) {
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        var linkFile = await res.text();
        return linkFile;
    }
    else{
        return null;
    }
};


export {requestGet,uploadFile}