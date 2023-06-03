const finishedThisWeek = (repairs) => {
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const weekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

    const repairsThisWeek = repairs.filter(rep => {
        const endDate = new Date(rep.endDate);
        return rep.paied === true && endDate >= weekStart && endDate <= weekEnd;
    });

    const laborPriceThisWeek = repairsThisWeek.reduce((acc, rep) => acc + rep.priceForLabor, 0);
    const partsPriceThisWeek = repairsThisWeek.reduce((acc, rep) => {
        const partsDiff = rep.parts.reduce((pAcc, part) => pAcc + (part.clientPrice - part.servicePrice), 0);
        return acc + partsDiff;
    }, 0);

    return {
        totalProfitForThisWeek: laborPriceThisWeek + partsPriceThisWeek,
        repairsThisWeek,
        laborPriceThisWeek,
        partsPriceThisWeek,
    }
}

export default finishedThisWeek;