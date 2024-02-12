class DayAverageValue {
    constructor(date, averageValue) {
        this.date = date;
        this.averageValue = averageValue;
        this.count = 1;
    }

    getDate() {
        return this.date;
    }

    getAverageValue() {
        return this.averageValue;
    }

    addValue(value) {
        this.averageValue = (this.averageValue * this.count + value) / (this.count + 1);
        this.count++;
    }
}

export default DayAverageValue;