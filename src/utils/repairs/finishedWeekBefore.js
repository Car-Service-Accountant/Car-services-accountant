const finishedLastWeek = (repairs) => {
    const today = new Date();
    const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);
    const lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()) - 7);

    const repairsLastWeek = repairs.filter(rep => {
        const endDate = new Date(rep.endDate);
        return rep.paied === true && endDate >= lastWeekStart && endDate <= lastWeekEnd;
    });

    const laborPriceLastWeek = repairsLastWeek.reduce((acc, rep) => acc + rep.priceForLabor, 0);
    const partsPriceLastWeek = repairsLastWeek.reduce((acc, rep) => {
        const partsDiff = rep.parts.reduce((pAcc, part) => pAcc + (part.clientPrice - part.servicePrice), 0);
        return acc + partsDiff;
    }, 0);

    return {
        totalProfitForMotnthBefore: laborPriceLastWeek + partsPriceLastWeek,
        repairsLastWeek,
        laborPriceLastWeek,
        partsPriceLastWeek,
    }
}

export default finishedLastWeek;
