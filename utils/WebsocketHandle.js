import * as CardView from './CardView.js';
import * as ThingsBoardInfo from '../models/ThingsBoardInfo.js';
import * as MainHandle from '../main.js';
import Alarm from "../models/Alarm.js";
//========================
var alarmCurrent = [];

function getRoleFromIndex(index) {
    switch (index) {
        case 0:
            return "Gateway";
        case 1:
            return "Node1";
        case 2:
            return "Node2";
        case 3:
            return "Node3";
        case 4:
            return "Node4";
        case 5:
            return "Node5";
        case 6:
            return "Node6";
        case 7:
            return "Node7";
        default:
            return -1; // Giá trị mặc định hoặc xử lý lỗi
    }
}

var checkCardCreated = new Array(7).fill(0);
export function WebSocketConnect(token) {
    const ws = new WebSocket('wss://thingsboard.cloud:443/api/ws/plugins/telemetry?token=' + token);

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
        for (let index = 0; index < ThingsBoardInfo.THINGS_BOARD_INFOS.length; index++) {
            registerListen(ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), index);
        }

    }

    // Xử lý sự kiện khi nhận dữ liệu từ server
    ws.onmessage = (event) => {
        const cleanedString = event.data;
        const parsedData = JSON.parse(cleanedString);
        const subscriptionId = parsedData.subscriptionId;

        if (subscriptionId < 10) {
            const extractedKeyValues = extractKeyValues(cleanedString);
            if (checkCardCreated[subscriptionId] == 0) {
                checkCardCreated[subscriptionId] = 1;
                for (const item of extractedKeyValues) {
                    let role = getRoleFromIndex(subscriptionId);
                    if (item.key.includes("temperature") || item.key.includes("humidity") || item.key.includes("light")) {
                        CardView.createDeviceTemperatureCardView(role, item.key, item.value);
                    } else if (item.key.includes("led") || item.key.includes("fan") || item.key.includes("device")) {
                        CardView.createDeviceCardView(role, item.key, item.value);
                    } else if (item.key.includes("aOnOff")) {
                        console.log('aOnOff');
                        MainHandle.globalAC.state = Number(item.value);
                        CardView.createAirConditionerCardView(role, 'Air Conditioner', item.value);
                    } else if (item.key.includes("aChange")) {
                        MainHandle.globalAC.value = Number(item.value);
                    } else if (item.key.includes("aMode")) {
                        MainHandle.globalAC.mode = Number(item.value);
                    } else if (item.key.includes("zlife")) {
                        let card2;
                        if (item.value == 0) {
                            card2 = document.querySelectorAll(".card." + role);
                            card2.forEach(function (element) {
                                element.style.backgroundColor = 'red'; // Thay đổi màu nền thành màu xanh
                            });

                        } else if (item.value == 1) {
                            card2 = document.querySelectorAll(".card." + role + ':not(.active)');
                            card2.forEach(function (element) {
                                //element.style.backgroundColor = 'var(--color-card-white)'; // Thay đổi màu nền thành màu xanh
                                element.style.removeProperty('background-color');
                            });
                        }
                    }
                }
            } else {
                for (const item of extractedKeyValues) {
                    let role = getRoleFromIndex(subscriptionId);
                    const latestValues = parsedData.latestValues;
                    const keys = Object.keys(latestValues);
                    if (keys.length > 0) {
                        const firstKey = keys[0];
                        const firstValue = latestValues[firstKey];
                        if (firstValue != 0) {
                            if (item.key.includes("zlife")) {
                                let card2;
                                if (item.value == 0) {
                                    card2 = document.querySelectorAll(".card." + role);
                                    card2.forEach(function (element) {
                                        element.style.backgroundColor = 'red'; // Thay đổi màu nền thành màu xanh
                                    });
                                } else if (item.value == 1) {
                                    card2 = document.querySelectorAll(".card." + role + ':not(.active)');
                                    card2.forEach(function (element) {
                                        element.style.removeProperty('background-color');
                                        //element.style.backgroundColor = 'var(--color-card-white)'; // Thay đổi màu nền thành màu xanh
                                    });
                                }
                            }
                            if (item.key.includes("temperature") || item.key.includes("humidity") || item.key.includes("light")) {
                                let valueText = document.querySelector(".value-card." + role + item.key);
                                if (item.key.includes("temperature")) {
                                    valueText.textContent = item.value + "°";
                                } else if (item.key.includes("humidity")) {
                                    valueText.textContent = item.value + "%";
                                } else if (item.key.includes("light")) {
                                    valueText.textContent = item.value + "lm";
                                }
                            } else if (item.key.includes("fan") || item.key.includes("led") || item.key.includes("aOnOff")) {
                                let card;
                                if (item.key.includes("aOnOff")) {
                                    item.key = 'Air.Conditioner';
                                    card = document.querySelector(".card." + role + '.' + item.key);

                                } else {
                                    card = document.querySelector(".card." + role + '.' + item.key);
                                    console.log(".card." + role + '.' + item.key);
                                }
                                if (card != null) {
                                    console.log("card != null");
                                    let toggle = document.querySelector('.toggle-button.' + role + item.key);
                                    let textValue = document.querySelector('.device-status.' + role + item.key);
                                    let input = document.querySelector('.input.' + role + item.key);

                                    if (item.value == 1) {
                                        card.classList.add('active');
                                        textValue.textContent = 'ON';
                                        toggle.classList.add('active');
                                        input.checked = true;
                                    } else {
                                        card.classList.remove('active');
                                        textValue.textContent = 'OFF';
                                        toggle.classList.remove('active');
                                        input.checked = false;
                                    }
                                } else {
                                    console.log("card == null");
                                    CardView.createDeviceCardView(role, item.key, item.value);
                                }
                            } else {
                                if (item.key.includes("tPeriod")) {
                                    let periodText = document.querySelector(".text-period." + role + "temperature");
                                    periodText.textContent = item.value + "p/lần";
                                } else if (item.key.includes("hPeriod")) {
                                    let periodText = document.querySelector(".text-period." + role + "humidity");
                                    periodText.textContent = item.value + "p/lần";
                                } else if (item.key.includes("lPeriod")) {
                                    let periodText = document.querySelector(".text-period." + role + "light");
                                    periodText.textContent = item.value + "p/lần";
                                };
                            }
                        } else if (firstValue == 0) {
                            let card = document.querySelector(".card." + role + ' ' + item.key);
                            if (card == null) {

                            } else {
                                card.remove();
                            }
                        }
                    }
                }
            }
        } else {
            const data = parsedData.data;
            if (subscriptionId == 10) {
                const latestValues = parsedData.latestValues;
                const keys = Object.keys(latestValues);
                if (keys.length > 0) {
                    const firstKey = keys[0];
                    const firstValue = latestValues[firstKey];
                    if (firstValue != 0) {
                        for (const key in data) {
                            if (Array.isArray(data[key])) {
                                data[key].forEach(item => {
                                    const jsonStr = item[1];
                                    const jsonObject = JSON.parse(jsonStr);
                                    alarmCurrent.push(jsonObject.role);
                                    CardView.addMeshCardView(jsonObject.role, jsonObject.uuid, jsonObject.unicast, jsonObject.parent, jsonObject.role);

                                });
                            }
                        }
                        MainHandle.setTabItemSideBar();
                    } else if (firstValue == 0) {
                        const index = alarmCurrent.indexOf(firstKey);
                        if (index !== -1) {
                            alarmCurrent.splice(index, 1);
                            const card = document.querySelector('.card.' + firstKey);
                            if (card == null) {

                            } else {
                                card.remove();
                            }
                        }
                    }
                }
            } else {
                const latestValues = parsedData.latestValues;
                const keys = Object.keys(latestValues);
                if (keys.length > 0) {
                    const firstKey = keys[0];
                    const firstValue = latestValues[firstKey];
                    if (firstValue != 0) {
                        for (const key in data) {
                            if (Array.isArray(data[key])) {
                                data[key].forEach(item => {
                                    const jsonStr = item[1];
                                    const jsonObject = JSON.parse(jsonStr);
                                    let alarmObj = new Alarm(
                                        key.split("_")[0],
                                        key,
                                        jsonObject.device,
                                        jsonObject.date,
                                        jsonObject.time,
                                        jsonObject.state
                                    );
                                    CardView.addListAlarmCardView(alarmObj);

                                });
                            }
                        }
                    } else if (firstValue == 0) {
                        const card = document.querySelector('.card.' + firstKey);
                        if (card == null) {

                        } else {
                            card.remove();
                        }
                    }
                }
            }
        }
    };

    // Xử lý sự kiện khi đóng kết nối
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
    function registerListen(entityId, cmdId) {
        var object = {
            tsSubCmds: [
                {
                    entityType: 'DEVICE',
                    entityId: entityId,
                    scope: 'LASTEST_TELEMETRY',
                    cmdId: cmdId,
                    keys: ''
                }
            ],
            historyCmds: [],
            attrSubCmds: [
                {
                    entityType: 'DEVICE',
                    entityId: entityId,
                    scope: 'SHARED_SCOPE',
                    cmdId: 10 + cmdId,
                    unsubscribe: false,
                    keys: ''
                }
            ]
        };
        var data = JSON.stringify(object);
        ws.send(data);
    }
}

function getSubscriptionId(dataString) {
    const data = JSON.parse(dataString);
    return data.subscriptionId;
}

function extractKeyValues(receivedMessage) {
    const keyValues = [];
    try {
        const jsonObject = JSON.parse(receivedMessage);
        const dataObject = jsonObject.data;
        const keys = Object.keys(dataObject);
        if (keys) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const valueArray = dataObject[key];
                if (valueArray.length > 0) {
                    const dataPoint = valueArray[0];
                    const value = dataPoint[1];
                    keyValues.push({ key: key, value: value });
                }
            }
        }
    } catch (e) {
        console.log(receivedMessage);
    }
    return keyValues;
}
