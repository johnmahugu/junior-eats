function formatDate(date) {
    var d = new Date(date)

    if (isNaN(d)) {
        d = new Date(date._seconds*1000)
    }

    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export default formatDate;