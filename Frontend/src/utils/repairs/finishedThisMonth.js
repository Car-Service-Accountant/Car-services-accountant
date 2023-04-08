const useFinishedThisMonth = (repairs) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const repairsThisMonth = repairs.filter(repair => {
        const createDate = new Date(repair.createDate);
        return createDate.getMonth() === currentMonth && createDate.getFullYear() === currentYear;
    });

    const totalLabor = repairsThisMonth.reduce((total, repair) => total + repair.priceForLabor, 0);

    const totalPartsDifference = repairsThisMonth.reduce((total, repair) => {
        const partsDifference = repair.parts.reduce((total, part) => total + (part.clientPrice - part.servicePrice), 0);
        return total + partsDifference;
    }, 0);

    return {
        repairsThisMonth,
        totalLabor,
        totalPartsDifference
    }
}

export default useFinishedThisMonth;