function getCurrentTimeUTC()
{
    //RETURN:
    //      = number of milliseconds between current UTC time and midnight of January 1, 1970
    var tmLoc = new Date();
    //The offset is in minutes -- convert it to ms
    return tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
}


console.log(Date(getCurrentTimeUTC()).toString())