const finishedDayBefore = (repairs) => {
    let priceForLaborYesterday = 0;
    let partsPriceYesterday = 0;
    let repairsFinishedYesterday = []
    if (repairs.length > 0) {

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        repairsFinishedYesterday = repairs.filter((repair) => {
            const endDate = new Date(repair.endDate);
            return repair.paied === true && endDate.toDateString() === yesterday.toDateString() && repair.finished;
        });



        repairsFinishedYesterday.forEach((repair) => {
            priceForLaborYesterday += repair.priceForLabor;
            repair.parts.forEach((part) => {
                partsPriceYesterday += part.clientPrice = part.servicePrice;
            });
        });


    }
    return {
        totalYestardayProfit: priceForLaborYesterday + partsPriceYesterday,
        repairsFinishedYesterday,
        priceForLaborYesterday,
        partsPriceYesterday
    }
}

export default finishedDayBefore;