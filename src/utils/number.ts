export const formatNumber2Decimal = (rawNumber: number): string => {
    return new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(rawNumber);
}

export const formatNumber = (rawNumber: number): string => {
    return new Intl.NumberFormat("th-TH").format(rawNumber);
}