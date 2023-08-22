import moment from "moment";

export function toDateOutput(str: string) {
    const date = moment(str).toDate();
    return `${date.getDay()}.${date.getMonth() + 1}.${date.getFullYear()}. ${date.getHours()}:${date.getMinutes()}`
}
