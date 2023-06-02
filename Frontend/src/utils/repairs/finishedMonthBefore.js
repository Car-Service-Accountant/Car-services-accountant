const finishedMonthBefore = (repairs) => {
    const today = new Date();
    const startOfMonthBefore = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfMonthBefore = new Date(today.getFullYear(), today.getMonth(), 0);
    const repairsInMonthBefore = repairs.filter((repair) => {
        const repairDate = new Date(repair.endDate);
        return repair.paied === true && repairDate >= startOfMonthBefore && repairDate <= endOfMonthBefore;
    });

    let laborSum = 0;
    let priceDiffSum = 0;
    for (const repair of repairsInMonthBefore) {
        laborSum += repair.priceForLabor;
        for (const part of repair.parts) {
            priceDiffSum += part.clientPrice - part.servicePrice;
        }
    }

    return {
        totalProfitForMotnthBefore: laborSum, priceDiffSum,
        repairsInMonthBefore: repairsInMonthBefore.length,
        laborSum,
        // eslint-disable-next-line no-dupe-keys
        priceDiffSum,
    }
}

export default finishedMonthBefore 