const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const convertToIndianWords = (number) => {
    if (number === 0)
        return "Zero";

    if (number < 0)
        return "Minus " + convertToIndianWords(Math.abs(number));

    if (number < 10)
        return ones[number];
    if (number < 20)
        return teens[number - 10];
    if (number < 100)
        return tens[Math.floor(number / 10)] + ((number % 10 !== 0) ? " " + ones[number % 10] : "");
    if (number < 1000)
        return ones[Math.floor(number / 100)] + " Hundred" + ((number % 100 !== 0) ? " " + convertToIndianWords(number % 100) : "");
    if (number < 100000)
        return convertToIndianWords(Math.floor(number / 1000)) + " Thousand" + ((number % 1000 !== 0) ? " " + convertToIndianWords(number % 1000) : "");
    if (number < 10000000)
        return convertToIndianWords(Math.floor(number / 100000)) + " Lakh" + ((number % 100000 !== 0) ? " " + convertToIndianWords(number % 100000) : "");
    return convertToIndianWords(Math.floor(number / 10000000)) + " Crore" + ((number % 10000000 !== 0) ? " " + convertToIndianWords(number % 10000000) : "");
}

const formatIndianCurrency = (num) => {
    // Convert number to string
    if(num===null){
        return ''
    }
    let strNum = String( num)
    
    // Separate integer part from decimal part if present
    let parts = strNum.split(".");
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? "." + parts[1] : "";
    
    // Add commas to integer part
    let formattedIntegerPart = "";
    for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
        if (j > 0 && j % 3 === 0) {
            formattedIntegerPart = "," + formattedIntegerPart;
        }
        formattedIntegerPart = integerPart[i] + formattedIntegerPart;
    }
    
    // Return the formatted number
    return '₹ '+formattedIntegerPart + decimalPart;
}

module.exports = {convertToIndianWords, formatIndianCurrency}