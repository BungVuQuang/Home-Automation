import * as ThingsBoardHandle from './components/ThingsBoardHandle.js';
import * as ChartDataHandle from './utils/ChartDataHandle.js';
import * as ThingsBoardInfo from './models/ThingsBoardInfo.js';
import * as WebsocketHandle from './utils/WebsocketHandle.js';
import * as Toast from './utils/Dialog.js';
import DayTotalTime from './models/DayTotalTime.js';
import DayAverageValue from './models/DayAverageValue.js';
import Alarm from "./models/Alarm.js";

export var globalAccessToken;
export var isGatewayConnected;
// export var globalACValue;
// export var globalACState = 0;
// export var globalACMode = 0;
export const globalAC = {
    value: 0,
    state: 0,
    mode: 0
};


const statusBar = document.getElementById("status-bar");
const connectionStatus = document.getElementById("connection-status");

const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const clodeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler")

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';

});

clodeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
});

export function setTabItemSideBar() {
    const tabs = $$(".tab-item");
    const panes = $$(".tab-pane");
    tabs.forEach((tab, index) => {
        const pane = panes[index];
        tab.onclick = function () {
            $(".tab-item.active").classList.remove("active");
            $(".tab-pane.active").classList.remove("active");
            this.classList.add("active");
            pane.classList.add("active");
        };
    });
}

/*============================CREATE ALARM=================================*/
var searchAlarmButton = document.getElementById("search-button-alarm");
var dateAlarm = document.querySelector("#date-alarm");
var timeAlarm = document.querySelector("#time-alarm");
var selectNodeAlarm = document.querySelector("#select-node-alarm");
var typeNodeAlarm = document.querySelector("#type-alarm");
var typeStateAlarm = document.querySelector("#type-state");
searchAlarmButton.addEventListener("click", function () {
    var selectedDateTime = new Date(dateAlarm.value + "T" + timeAlarm.value);
    console.log(isGatewayConnected);
    if (isGatewayConnected == false) {
        Toast.toastActive("Create Alarm", `Disconnected to Gateway!!!`);
    } else {
        if (dateAlarm.value === "") {
            alert("Không định chọn ngày à?");
        } else if (timeAlarm.value === "") {
            alert("Không định chọn giờ à?");
        } if (selectedDateTime < new Date()) {
            alert("Định xuyên không à?");
        } else {
            let index = ThingsBoardHandle.getIndexThingsBoard(selectNodeAlarm.value);
            ThingsBoardHandle.getKeysAlarm(globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), (error3, data3) => {
                if (error3) {
                    console.error('An error occurred:', error3);
                } else {
                    let maxNumber = -1;
                    data3.forEach(item => {
                        const parts = item.split("_");
                        if (parts.length === 2) {
                            const number = parseInt(parts[1], 10);
                            if (!isNaN(number) && number > maxNumber) {
                                maxNumber = number;
                            }
                        }
                    });
                    maxNumber = maxNumber + 1;
                    const orderedID = `${selectNodeAlarm.value}_${maxNumber}`;
                    const parts = dateAlarm.value.split("-");
                    const dateAlarmConver = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    const dataAlarm = {
                        [orderedID]: {
                            "state": typeStateAlarm.value,
                            "date": dateAlarmConver,
                            "device": typeNodeAlarm.value,
                            "time": timeAlarm.value
                        }
                    };
                    const apiUrl = ThingsBoardHandle.THINGSBOARD_POST_ALARM_URL.replace("DEVICE_ID", ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID());
                    axios.post(apiUrl, dataAlarm, {
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-Authorization': 'Bearer ' + globalAccessToken
                        }
                    })
                }
            });
        }
    }
});

/*============================HISTORY DATA: GRAPHIC=================================*/
var searchGraphicButton = document.getElementById("search-button-graphic");
var fromDateGraphic = document.querySelector("#from-date-graphic");
var toDateGraphic = document.querySelector("#to-date-graphic");
var selectNodeGraphic = document.querySelector("#select-node-graphic");
var selectOption = document.querySelector("#select-option-graphic");
var typeNodeGraphic = document.querySelector("#type-graphic");
var myHightChart = document.querySelector("#chart-container");

searchGraphicButton.addEventListener("click", function () {

    searchGraphic();
});

var PreviousTimeStampActive = 0;
var CurrentTimeStampActive = 0;

function getActiveStatusThingsBoard() {
    ThingsBoardHandle.getActiveStatus(globalAccessToken, "lastActivityTime", (error2, data2) => {
        if (error2) {
            console.error('An error occurred:', error2);
        } else {
            for (const key in data2) {
                if (data2.hasOwnProperty(key)) {
                    if (PreviousTimeStampActive == 0) {
                        PreviousTimeStampActive = data2[key].value;
                    } else {
                        if (CurrentTimeStampActive != 0) {
                            PreviousTimeStampActive = CurrentTimeStampActive
                        }
                        CurrentTimeStampActive = data2[key].value;
                        if (CurrentTimeStampActive - PreviousTimeStampActive < 58000) {
                            isGatewayConnected = false;
                            connectionStatus.textContent = "Mất Kết nối đến Gateway !!!";
                            statusBar.style.display = "flex";

                        } else {
                            isGatewayConnected = true;
                            statusBar.style.display = "none";
                        }
                    }
                }
            }
        }
    });
}

//
setInterval(setTabItemSideBar, 3000);
setInterval(getActiveStatusThingsBoard, 61000);
isGatewayConnected = true;
ThingsBoardHandle.getJwtToken('bungvu50@gmail.com', '123456', (error, data) => {
    if (error) {
        console.error('Error:', error);
    } else {
        globalAccessToken = data.token;
        WebsocketHandle.WebSocketConnect(data.token);
        getActiveStatusThingsBoard();
        ThingsBoardHandle.getActiveStatus(globalAccessToken, "active", (error2, data2) => {
            if (error2) {
                console.error('An error occurred:', error2);
            } else {
                for (const key in data2) {
                    if (data2.hasOwnProperty(key)) {
                        isGatewayConnected = data2[key].value;
                        if (isGatewayConnected == false) {
                            connectionStatus.textContent = "Mất Kết nối đến Gateway !!!";
                            statusBar.style.display = "flex";
                        } else {
                            isGatewayConnected = true;
                            statusBar.style.display = "none";
                        }
                    }
                }
            }
        });
    }
});

function searchGraphic() {
    let fromDateValue = fromDateGraphic.value;
    let toDateValue = toDateGraphic.value;
    const extractedData = [];
    var dateArr = [];
    var timeArr = [];
    var value = [];
    var totalTimeDay = [];
    const field = typeNodeGraphic.value;
    const role = selectNodeGraphic.value;
    let indexField = ThingsBoardHandle.getIndexThingsBoard(role);
    if (selectOption.value == "date") {

        const timeStr = '00:01';
        const timeStr2 = '23:59';
        const timestamp = ThingsBoardHandle.convertDateTimeToTimestamp(fromDateValue, timeStr);
        const timestamp2 = ThingsBoardHandle.convertDateTimeToTimestamp(toDateValue, timeStr2);

        ThingsBoardHandle.getFieldData(globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[indexField].getDeviceID(), field, timestamp, timestamp2, (error, data) => {
            if (error) {
                console.error('An error occurred:', error);
            } else {
                const fieldData = data[field];
                var unit;
                // Kiểm tra nếu dữ liệu tồn tại
                if (field.includes("temperature") || field.includes("humidity") || field.includes("light")) {
                    if (field.includes("temperature")) {
                        unit = "°C";
                    } else if (field.includes("humidity")) {
                        unit = "%";
                    } else {
                        unit = "lm";
                    }
                    let valueAverage = [];
                    if (fieldData && Array.isArray(fieldData)) {
                        for (let i = fieldData.length - 1; i >= 0; i--) {
                            const item = fieldData[i];
                            const formattedDateTime = ThingsBoardHandle.extractDateFromTimestamp(item.ts);
                            const [date, time] = formattedDateTime.split(', ');
                            value[fieldData.length - i - 1] = item.value;
                            extractedData.push({
                                date: date,
                                time: time,
                                value: item.value
                            });
                        }

                        let currentDayAverageValue = null;
                        let averageValueList = [];
                        let index = 0;
                        for (let i = 0; i < extractedData.length; i++) {
                            if (currentDayAverageValue == null || currentDayAverageValue.getDate() !== extractedData[i].date) {
                                currentDayAverageValue = new DayAverageValue(extractedData[i].date, value[i]);
                                dateArr[index++] = extractedData[i].date;
                                averageValueList.push(currentDayAverageValue);
                            } else {
                                currentDayAverageValue.addValue(value[i]);

                            }
                        }

                        for (let i = 0; i < averageValueList.length; i++) {
                            valueAverage[i] = averageValueList[i].getAverageValue();
                        }

                    }
                    myHightChart.style.display = 'block';
                    Highcharts.chart('chart-container', {
                        chart: {
                            type: 'line'
                        },
                        accessibility: {
                            enabled: false
                        },
                        title: {
                            text: 'Đồ thị giá trị trung bình theo ngày về ' + field
                        },
                        xAxis: {
                            title: {
                                text: 'Thời gian '
                            },
                            categories: dateArr,
                            scrollbar: {
                                enabled: true
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Đơn vị ' + unit
                            }
                        },
                        series: [{
                            name: unit,
                            data: valueAverage

                        }]
                    });
                } else if (field.includes("led") || field.includes("fan") || field.includes("device") || field.includes("aOnOff")) {
                    var deviceName = field;
                    if (deviceName.includes('aOnOff')) {
                        deviceName = 'Air Conditioner'
                    }
                    if (fieldData && Array.isArray(fieldData)) {
                        for (let i = fieldData.length - 1; i >= 0; i--) {
                            const item = fieldData[i];
                            const formattedDateTime = ThingsBoardHandle.extractDateFromTimestamp(item.ts);
                            const [date, time] = formattedDateTime.split(', ');
                            value[fieldData.length - i - 1] = item.value;
                            extractedData.push({
                                date: date,
                                time: time,
                                value: item.value
                            });
                        }
                        let currentDayTotalTime = null;
                        let totalTimeList = [];
                        let index = 0;
                        for (let i = 1; i < extractedData.length; i++) {
                            let prevData = extractedData[i - 1];
                            let currentData = extractedData[i];
                            if (prevData.value == 1 && currentData.value == 0) {
                                let timeDiffMillis = ChartDataHandle.calculateTimeDifferenceMillis(prevData, currentData);
                                if (currentDayTotalTime == null || currentDayTotalTime.date !== currentData.date) {
                                    currentDayTotalTime = new DayTotalTime(currentData.date);
                                    dateArr[index++] = currentData.date;
                                    totalTimeList.push(currentDayTotalTime);
                                }

                                currentDayTotalTime.addTime(timeDiffMillis);
                            }
                        }


                        for (let i = 0; i < totalTimeList.length; i++) {
                            //console.log(totalTimeList[i].totalTimeMillis);
                            let hours = totalTimeList[i].totalTimeMillis / 3600000;
                            totalTimeDay[i] = hours;
                        }
                        //console.log(totalTimeDay);
                    }
                    myHightChart.style.display = 'block';
                    Highcharts.chart('chart-container', {
                        chart: {
                            type: 'line'
                        },
                        accessibility: {
                            enabled: false
                        },
                        title: {
                            text: 'Đồ thị thời gian sử dụng trong 1 ngày của ' + deviceName
                        },
                        subtitle: {
                            text: 'Giá trị 1: On, Giá trị 0: Off',
                        },
                        xAxis: {
                            title: {
                                text: 'Thời gian '
                            },
                            categories: dateArr,
                            scrollbar: {
                                enabled: true
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Đơn vị Hour'
                            }
                        },
                        series: [{
                            name: 'Hour',
                            data: totalTimeDay

                        }]
                    });
                }

            }
        });
    } else {
        const timeStr = '00:01';
        const timeStr2 = '23:59';
        const timestamp = ThingsBoardHandle.convertDateTimeToTimestamp(fromDateValue, timeStr);
        const timestamp2 = ThingsBoardHandle.convertDateTimeToTimestamp(fromDateValue, timeStr2);

        ThingsBoardHandle.getFieldData(globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[indexField].getDeviceID(), field, timestamp, timestamp2, (error, data) => {
            if (error) {
                console.error('An error occurred:', error);
            } else {
                var unit;
                if (field.includes("temperature")) {
                    unit = "°C";
                } else if (field.includes("humidity")) {
                    unit = "%";
                } else if (field.includes("light")) {
                    unit = "lm";
                } else {
                    unit = "State"
                }
                const fieldData = data[field];
                // Kiểm tra nếu dữ liệu tồn tại
                if (fieldData && Array.isArray(fieldData)) {
                    for (let i = fieldData.length - 1; i >= 0; i--) {
                        const item = fieldData[i];
                        const formattedDateTime = ThingsBoardHandle.extractDateFromTimestamp(item.ts);
                        const [date, time] = formattedDateTime.split(', ');
                        dateArr[fieldData.length - i - 1] = date;
                        timeArr[fieldData.length - i - 1] = time;
                        value[fieldData.length - i - 1] = item.value;
                        extractedData.push({
                            date: date,
                            time: time,
                            value: item.value
                        });
                    }
                }
                var deviceName = field;
                if (deviceName.includes('aOnOff')) {
                    deviceName = 'Air Conditioner'
                }
                myHightChart.style.display = 'block';
                Highcharts.chart('chart-container', {
                    chart: {
                        type: 'line'
                    },
                    accessibility: {
                        enabled: false
                    },
                    title: {
                        text: 'Đồ thị dữ liệu trong ngày ' + fromDateValue + ' về ' + deviceName
                    },
                    subtitle: {
                        text: 'Giá trị 1: On, Giá trị 0: Off',
                    },
                    xAxis: {
                        title: {
                            text: 'Thời gian '
                        },
                        categories: timeArr,
                        min: 0,
                        max: 15,
                        scrollbar: {
                            enabled: true
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Đơn vị là ' + unit
                        }
                    },
                    series: [{
                        name: unit,
                        data: value

                    }]
                });
            }
        });
    }
}
