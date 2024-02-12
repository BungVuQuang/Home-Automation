export function calculateTimeDifferenceMillis(startTime, endTime) {
    const dateFormat = 'yyyy-MM-dd HH:mm';
    const startDate = new Date(startTime.date + ' ' + startTime.time);
    const endDate = new Date(endTime.date + ' ' + endTime.time);
    const timeDifference = endDate.getTime() - startDate.getTime();
    if (isNaN(timeDifference)) {
        return 0;
    }

    return timeDifference;
}