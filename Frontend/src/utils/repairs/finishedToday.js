const finishedToday = (repairs) => {
    let totalPriceForLabor = 0;
    let totalPartsPriceDifference = 0;
    let today = []

    if (repairs.length > 0) {
        today = repairs.filter((repair) => {
            const endDate = new Date(repair.endDate);
            const today = new Date();
            return (
                repair.paied === true &&
                endDate.getDate() === today.getDate() &&
                endDate.getMonth() === today.getMonth() &&
                endDate.getFullYear() === today.getFullYear()
            );
        });
        if (today.length > 0) {
            today.forEach((repair) => {
                totalPriceForLabor += repair.priceForLabor;
            });
            today.forEach((repair) => {
                repair.parts.forEach((part) => {
                    totalPartsPriceDifference += part.clientPrice - part.servicePrice;
                });
            });
        }
    }

    return {
        totalProfitToday: totalPriceForLabor + totalPartsPriceDifference,
        finishedToday: today,
        totalPriceForLabor,
        totalPartsPriceDifference
    }
}

export default finishedToday