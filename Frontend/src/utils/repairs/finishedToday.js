const finishedToday = (repairs) => {
    const today = repairs.filter((repair) => {
        const endDate = new Date(repair.endDate);
        const today = new Date();
        return (
            endDate.getDate() === today.getDate() &&
            endDate.getMonth() === today.getMonth() &&
            endDate.getFullYear() === today.getFullYear()
        );
    });

    let totalPriceForLabor = 0;
    finishedToday.forEach((repair) => {
        totalPriceForLabor += repair.priceForLabor;
    });

    let totalPartsPriceDifference = 0;
    finishedToday.forEach((repair) => {
        repair.parts.forEach((part) => {
            totalPartsPriceDifference += part.clientPrice - part.servicePrice;
        });
    });

    return {
        finishedToday: today,
        totalPriceForLabor,
        totalPartsPriceDifference
    }
}

export default finishedToday