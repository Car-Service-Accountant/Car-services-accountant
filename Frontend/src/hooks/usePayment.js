import { useState } from "react";

const URL = "http://localhost:3005/cashbox";

export const useCashBox = (id, monney) => {
    const [currentCashBox, setCurrentCashBox] = useState([]);
    const addTotalAmount = (id, monney) => {
        console.log(id);
        cashBox(id);

        const updatedCashBox = {
            additionalCosts: currentCashBox.additionalCosts,
            cost: currentCashBox.cost,
            employersSellary: currentCashBox.employersSellary,
            profit: currentCashBox.profit,
            totalAmount: currentCashBox.totalAmount += monney,
            totalForMonth: currentCashBox.totalForMonth
        };
        return updateCashBox(currentCashBox._id, updatedCashBox);
    };

    const cashBox = (id) => {
        callCashBox(id);
        if (currentCashBox) {
            setCurrentCashBox(currentCashBox);
            return currentCashBox._id;
        } else {
            throw new Error("something gones wrong");
        }
    };

    const updateCashBox = async (id, data) => {
        try {
            const response = await fetch(`${URL}/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error(`Error updating cashbox: ${error}`);
            return false
        }
    };

    const callCashBox = async (id) => {
        try {
            const response = await fetch(`${URL}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCurrentCashBox(data);
        } catch (error) {
            console.error(`Error fetching cashbox: ${error}`);
        }
    };
    return {
        addTotalAmount,
        cashBox,
    };
};
