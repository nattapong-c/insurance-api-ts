export const convertToThaiDate = (dateObj: Date): string => {
    return new Intl.DateTimeFormat("th-TH", { month: "long", day: "numeric", year: "numeric" }).format(dateObj);
}