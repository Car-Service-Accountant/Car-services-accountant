const finishedThisMonth = (repairs) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const repairsThisMonth = repairs.filter(repair => {
        const endDate = new Date(repair.endDate);
        return repair.paied === true && endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
    });

    const totalLabor = repairsThisMonth.reduce((total, repair) => total + repair.priceForLabor, 0);

    const totalPartsDifference = repairsThisMonth.reduce((total, repair) => {
        const partsDifference = repair.parts.reduce((total, part) => total + (part.clientPrice - part.servicePrice), 0);
        return total + partsDifference;
    }, 0);

    return {
        totalProfitForThisMonth: totalLabor + totalPartsDifference,
        repairsThisMonth: repairsThisMonth.length,
        totalLabor,
        totalPartsDifference
    }
}

export default finishedThisMonth;