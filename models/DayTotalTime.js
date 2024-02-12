class DayTotalTime {
    constructor(date) {
        this.date = date;
        this.totalTimeMillis = 0;
    }

    getDate() {
        return this.date;
    }

    getTotalTimeMillis() {
        return this.totalTimeMillis;
    }

    addTime(timeMillis) {
        this.totalTimeMillis += timeMillis;
    }
}

export default DayTotalTime;