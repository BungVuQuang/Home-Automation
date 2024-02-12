class Alarm {
    constructor(role, id, device, date, time, state) {
        this.role = role;
        this.id = id;
        this.device = device;
        this.date = date;
        this.time = time;
        this.state = state;
    }

    getRole() {
        return this.role;
    }

    setRole(role) {
        this.role = role;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getDevice() {
        return this.device;
    }

    setDevice(device) {
        this.device = device;
    }

    getDate() {
        return this.date;
    }

    setDate(date) {
        this.date = date;
    }

    getTime() {
        return this.time;
    }

    setTime(time) {
        this.time = time;
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
    }
}

export default Alarm;