import { useState } from "react";

const URL = "http://localhost:3005/cashbox";

export const useAddTotalMonney = (id, monney) => {
    const [currentCashBox, setCurrentCashBox] = useState([]);

    const addTotalAmount = (id, monney) => {
        //TODO: work on it
        const cashBoxId = cashBox(id)
        console.log("current => ", currentCashBox);
        console.log("current id => ", cashBoxId);
        const updatedCashBox = currentCashBox.map((cb) => {
            return {
                ...cb,
                totalAmount: cb.totalAmount + monney,
            };
        });
        setCurrentCashBox(updatedCashBox)
        console.log("updated cashbox =>", currentCashBox);
        updateCashBox(cashBoxId);
    }
    const cashBox = (id) => {
        callCashBox(id);
        if (currentCashBox) {
            setCurrentCashBox(currentCashBox);
            return currentCashBox._id
        } else {
            throw new Error("something gones wrong")
        }
    }

    const updateCashBox = (id) => {
        return callUpdateCashBox(id, currentCashBox);
    }

    const callCashBox = (id) => {
        fetch(`${URL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setCurrentCashBox(data)
            })
            .catch((error) => {
                console.error(`Error fetching employers: ${error}`);
            });
    }

    const callUpdateCashBox = (id, data) => {
        fetch(`${URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error(`Error fetching employers: ${error}`);
            });
    }
    return {
        addTotalAmount
    };
}
