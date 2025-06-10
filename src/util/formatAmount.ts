export default function formatAmount(amount: number, len?: number) {
    if (typeof amount !== 'number') {
        throw new Error("Input must be a number");
    }

    let formatted;

    if (amount >= 1e9) {
        formatted = (amount / 1e9).toFixed(1) + 'B'; // Billions  
    } else if (amount >= 1e6) {
        formatted = (amount / 1e6).toFixed(1) + 'M'; // Millions  
    } else if (amount >= 1e3) {
        formatted = (amount / 1e3).toFixed(1) + 'K'; // Thousands  
    } else {
        formatted = amount.toFixed(len || 4); // Return as is for less than 1000  
    }

    return formatted;
}  