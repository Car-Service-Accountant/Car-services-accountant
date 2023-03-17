exports.timeNow = () => {
    return new Date();
}


// prepeared to be used in filter or map -- demo.filter(e => active(e , currentDate))
exports.active = (item, currentDate) => {
    const itemCreateDate = item.createDate;
    const itemEndDate = item.endDate;

    if (currentDate >= itemCreateDate && currentDate <= itemEndDate) {
        return true
    } else {
        return false
    }
}

exports.scheduled = (item, currentDate) => {
    const itemCreateDate = item.createDate;
    const itemEndDate = item.endDate;

    if (currentDate > itemCreateDate && currentDate > itemEndDate) {
        return true
    } else {
        return false
    }
}

exports.scheduled = (item, currentDate) => {
    const itemCreateDate = item.createDate;
    const itemEndDate = item.endDate;

    if (currentDate > itemCreateDate && currentDate > itemEndDate) {
        return true
    } else {
        return false
    }
}

