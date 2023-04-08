const sortByDateAndCalculateProfit = (repairs) => {

    const sortedRepairs = repairs.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

    const totalLabor = sortedRepairs.reduce((total, repair) => total + repair.priceForLabor, 0);

    const totalPartsDifference = sortedRepairs.reduce((total, repair) => {
        const partsDifference = repair.parts.reduce((total, part) => total + (part.clientPrice - part.servicePrice), 0);
        return total + partsDifference;
    }, 0);

    const calculatedRepairs = sortedRepairs.map(repair => ({
        ...repair,
        partsDifference: repair.parts.reduce((total, part) => total + (part.clientPrice - part.servicePrice), 0),
        laborPrice: repair.priceForLabor
    }));

    return {
        totalProfitForThisMonth: totalLabor + totalPartsDifference,
        totalLabor,
        totalPartsDifference,
        calculatedRepairs
    };
}

export default sortByDateAndCalculateProfit;