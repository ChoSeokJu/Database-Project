const multer = require('multer');

exports.csvSanityCheck = function(data) {
    /* check if the submitted csv file has headers that fit the mapping information in og_data_type */
    console.log(data)
    return true
}

exports.nowDate = function (x) {
    /* for current date/time/datetime to be input in db */
    /* x: "Date"|"Time"|"DateTime" */
    var date = new Date();
    var parts = date.toLocaleDateString().split("/");
    var formattedDate = parts[2] + "-" + parts[0] + "-" + parts[1];
    if(x == "Date"){
      return formattedDate;
    }else if(x.includes("Time")){
        var unformattedTime = date.toLocaleTimeString();
        var formattedTime = unformattedTime.replace(/ (AM)|(PM)/i, "").replace(" ","");
        if(unformattedTime.substring(unformattedTime.length-2, unformattedTime.length) == "PM"){
            var n = formattedTime.length;
            if(formattedTime.length % 2 == 0){
                formattedTime = (parseInt(formattedTime.substring(0,1)) + 12).toString() 
                                + formattedTime.substring(2,n);
            } else {
                formattedTime = (parseInt(formattedTime.charAt(0)) + 12).toString()
                                + formattedTime.substring(1,n);
            }
        } else {
            if(formattedTime.length % 2 != 0){
                formattedTime = '0' + formattedTime;
            }
        }
        if(x == "DateTime"){
            return formattedDate + " " + formattedTime;
        } else if(x=="Time"){
            return formattedTime;
        }
    }
}

exports.upload = multer({ dest: 'uploads/',
                          fileFilter: function (req, file, cb) {
                            file.mimetype === 'text/csv' ? cb(null, true) : cb(null, false)
}})