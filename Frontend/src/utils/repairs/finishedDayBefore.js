const finishedDayBefore = (repairs) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const repairsFinishedYesterday = repairs.filter((repair) => {
        const endDate = new Date(repair.endDate);
        return endDate.toDateString() === yesterday.toDateString() && repair.finished;
    });

    let priceForLaborYesterday = 0;
    let partsPriceYesterday = 0;

    repairsFinishedYesterday.forEach((repair) => {
        priceForLaborYesterday += repair.priceForLabor;
        repair.parts.forEach((part) => {
            partsPriceYesterday += part.clientPrice = part.servicePrice;
        });
    });


    return {
        repairsFinishedYesterday,
        priceForLaborYesterday,
        partsPriceYesterday
    }

}

export default finishedDayBefore;