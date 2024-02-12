import * as MainHandle from '../main.js';
import * as ThingsBoardHandle from '../components/ThingsBoardHandle.js';
import Alarm from "../models/Alarm.js";
import * as Toast from './Dialog.js';
import * as ThingsBoardInfo from '../models/ThingsBoardInfo.js';
//============================MESH CARD VIEW========================
export function addMeshCardView(roleName, uuid, unicast, lpn, role) {
    const cardContainer = document.querySelector('.grid-container.mesh');

    // Tạo các phần tử HTML cho cardview
    const card = document.createElement('div');
    card.className = 'card ' + roleName;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const meshHeader = document.createElement('div');
    meshHeader.className = 'mesh-header';

    const roleNameElement = document.createElement('h4');
    roleNameElement.className = 'role-name';
    roleNameElement.textContent = roleName;

    const cancelMesh = document.createElement('div');
    cancelMesh.className = 'cancel-mesh';

    cancelMesh.addEventListener('click', function () {
        const clickedRoleName = roleName;
        const clickedUnicast = unicast;
        const card = this.closest('.card');
        if (MainHandle.isGatewayConnected == true) {
            ThingsBoardHandle.DeleteMesh(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[0].getDeviceID(), clickedRoleName, (error, data) => {
                if (error) {
                    console.error('An error occurred:', error);
                } else {
                    card.remove();
                    Toast.toastActive("Mesh", `Delete ${clickedRoleName} Complete!!!`);
                    console.log('Delete Complete:', data);
                }
            });
            let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
            ThingsBoardHandle.DeleteAllAlarm(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), index, (error, data) => {

            });
            ThingsBoardHandle.DeleteAllElementData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), (error, data) => {

            });
        } else {
            Toast.toastActive("Cancel Mesh", `Disconnected to Gateway!!!`);
        }
        // var payload = `Delete ${clickedUnicast}`;
        // MqttHandle.client.publish('web/home/mesh', payload);
        // const myMessageCallback = function (topic, message) {
        //     if (card) {
        //         Toast.toastActive("Mesh", `Delete ${clickedRoleName} Complete!!!`);
        //         const url = 'https://project1-99aca-default-rtdb.firebaseio.com/Mesh/' + clickedRoleName + '.json';
        //         axios.delete(url);
        //         card.remove();
        //     }
        //     MqttHandle.client.removeListener('message', myMessageCallback);
        //     clearTimeout(timeoutId);
        // };
        // MqttHandle.client.on('message', myMessageCallback);
        // const timeoutId = setTimeout(() => {
        //     MqttHandle.client.removeListener('message', myMessageCallback);
        // }, 3000);
    });
    const cancelImg = document.createElement('img');
    cancelImg.src = 'assets/img/cancel.png';
    cancelImg.alt = 'cancel';
    cancelImg.classList.add('effect');
    cancelImg.addEventListener('hover', function () {
        cancelImg.style.transform = 'scale(1.05)';
    });
    cancelMesh.appendChild(cancelImg);

    meshHeader.appendChild(roleNameElement);
    meshHeader.appendChild(cancelMesh);

    const uuidElement = document.createElement('p');
    uuidElement.className = 'device-status';
    uuidElement.textContent = 'UUID: ' + uuid;

    const unicastElement = document.createElement('p');
    unicastElement.className = 'device-status';
    unicastElement.textContent = 'Unicast: ' + unicast;

    const lpnElement = document.createElement('p');
    lpnElement.className = 'device-status';
    lpnElement.textContent = 'LPN: ' + lpn;

    const roleElement = document.createElement('p');
    roleElement.className = 'device-status';
    roleElement.textContent = 'Role: ' + role;

    cardBody.appendChild(meshHeader);
    cardBody.appendChild(uuidElement);
    cardBody.appendChild(unicastElement);
    cardBody.appendChild(lpnElement);
    cardBody.appendChild(roleElement);

    card.appendChild(cardBody);
    cardContainer.appendChild(card);

    //ADD SIDEBAR
    const newTabItem = document.createElement('div');
    newTabItem.className = 'tab-item';

    const spanSymbol = document.createElement('span');
    spanSymbol.className = 'material-symbols-outlined';
    spanSymbol.textContent = 'home_iot_device';

    const h3Text = document.createElement('h3');
    h3Text.textContent = roleName;

    newTabItem.appendChild(spanSymbol);
    newTabItem.appendChild(h3Text);

    // Thêm newTabItem vào phần sidebar
    const sideBar = document.querySelector('.side-bar');
    sideBar.appendChild(newTabItem);

    // ADD tab-pane
    const cardContainerDevice = document.querySelector('.app-content');
    const newLabel = document.createElement('h1');
    newLabel.className = 'label-tab-pane';
    newLabel.textContent = "Dashboard ";

    const newTabPane = document.createElement('div');
    newTabPane.className = 'tab-pane';

    // Tạo button Open AlertDialog
    const openButtonAdd = document.createElement('button');
    openButtonAdd.id = 'openButtonAdd' + roleName;
    openButtonAdd.className = 'button';
    openButtonAdd.textContent = 'Add Device';
    openButtonAdd.addEventListener('click', () => {
        overlayAdd.style.display = 'flex';
    });

    // Tạo button Delete AlertDialog
    const openButtonDelete = document.createElement('button');
    openButtonDelete.id = 'openButtonDelete' + roleName;
    openButtonDelete.className = 'button';
    openButtonDelete.textContent = 'Delete Device';
    openButtonDelete.addEventListener('click', () => {
        overlayDelete.style.display = 'flex';
    });

    // Tạo button Sync AlertDialog
    const openButtonSync = document.createElement('button');
    openButtonSync.id = 'openButtonSynchronization' + roleName;
    openButtonSync.className = 'button';
    openButtonSync.textContent = 'Synchronize Device';
    openButtonSync.addEventListener('click', () => {
        let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
        ThingsBoardHandle.httpPostTelemetryData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), 'Sync', Number(1), (error, data) => {
            if (error) {
                console.error("An error occurred:", error);
            } else {
                Toast.toastActive("Control Device", `Synchronize successfully!!!`);
                console.log("Đã gửi Post thành công !!!" + data);
            }
        });
    });

    // Tạo overlayAdd
    const overlayAdd = document.createElement('div');
    overlayAdd.className = 'overlay';
    overlayAdd.id = 'overlayAdd' + roleName;

    const dialogAdd = document.createElement('div');
    dialogAdd.className = 'dialog';
    overlayAdd.appendChild(dialogAdd);

    const h2Add = document.createElement('h2');
    h2Add.textContent = 'Add Device';
    dialogAdd.appendChild(h2Add);

    const selectRoleAdd = document.createElement('select');
    selectRoleAdd.id = 'select-role-add' + roleName;
    const optionAdd = document.createElement('option');
    optionAdd.value = roleName;
    optionAdd.textContent = roleName;
    selectRoleAdd.appendChild(optionAdd);

    const selectDeviceAdd = document.createElement('select');
    selectDeviceAdd.id = 'select-device-add' + roleName;
    // Thêm các option vào selectDeviceAdd từ mảng role
    const deviceOptions = ['led1', 'led2', 'led3', 'led4', 'light', 'temperature', 'humidity', 'air conditioner'];
    for (const optionValue of deviceOptions) {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
        selectDeviceAdd.appendChild(option);
    }

    const buttonContainerAdd = document.createElement('div');
    buttonContainerAdd.className = 'button-container';

    const cancelButtonAdd = document.createElement('button');
    cancelButtonAdd.id = 'cancelButtonAdd' + roleName;
    cancelButtonAdd.className = 'button';
    cancelButtonAdd.textContent = 'Cancel';
    cancelButtonAdd.addEventListener('click', () => {
        overlayAdd.style.display = 'none';
    });

    const confirmButtonAdd = document.createElement('button');
    confirmButtonAdd.id = 'confirmButtonAdd' + roleName;
    confirmButtonAdd.className = 'button';
    confirmButtonAdd.textContent = 'Confirm';
    confirmButtonAdd.addEventListener('click', () => {
        const element = document.querySelector('.card.' + roleName + '.' + selectDeviceAdd.value);
        if (element) {
            alert("Đã Có Card rồi thêm lzi? " + roleName + " " + selectDeviceAdd.value);
        } else {
            if (selectDeviceAdd.value.includes("temperature") || selectDeviceAdd.value.includes("humidity") || selectDeviceAdd.value.includes("light")) {
                createDeviceTemperatureCardView(roleName, selectDeviceAdd.value, 0);
            } else if (selectDeviceAdd.value.includes("air conditioner")) {
                createAirConditionerCardView(roleName, selectDeviceAdd.value, 0);
            } else {
                createDeviceCardView(roleName, selectDeviceAdd.value, 0);
            }
        }
    });


    buttonContainerAdd.appendChild(cancelButtonAdd);
    buttonContainerAdd.appendChild(confirmButtonAdd);

    dialogAdd.appendChild(selectRoleAdd);
    dialogAdd.appendChild(selectDeviceAdd);
    dialogAdd.appendChild(buttonContainerAdd);


    // Tạo Delete AlertDialog
    // Tạo overlayAdd
    const overlayDelete = document.createElement('div');
    overlayDelete.className = 'overlay';
    overlayDelete.id = 'overlayDelete' + roleName;

    const dialogDelete = document.createElement('div');
    dialogDelete.className = 'dialog';

    const h2Delete = document.createElement('h2');
    h2Delete.textContent = 'Delete Device';
    dialogDelete.appendChild(h2Delete);

    const selectRoleDelete = document.createElement('select');
    selectRoleDelete.id = 'select-role-delete' + roleName;
    // Thêm các option vào selectRoleDelete từ mảng role
    const optionDelete = document.createElement('option');
    optionDelete.value = roleName;
    optionDelete.textContent = roleName;
    selectRoleDelete.appendChild(optionDelete);

    const selectDeviceDelete = document.createElement('select');
    selectDeviceDelete.id = 'select-device-delete' + roleName;
    // Thêm các option vào selectDeviceDelete từ mảng role
    const deviceOptionsDelete = ['led1', 'led2', 'led3', 'led4', 'light', 'temperature', 'humidity', 'air conditioner'];
    for (const optionValue of deviceOptionsDelete) {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
        selectDeviceDelete.appendChild(option);
    }

    const buttonContainerDelete = document.createElement('div');
    buttonContainerDelete.className = 'button-container';

    const cancelButtonDelete = document.createElement('button');
    cancelButtonDelete.id = 'cancelButtonDelete' + roleName;
    cancelButtonDelete.className = 'button';
    cancelButtonDelete.textContent = 'Cancel';
    cancelButtonDelete.addEventListener('click', () => {
        overlayDelete.style.display = 'none';
    });
    const confirmButtonDelete = document.createElement('button');
    confirmButtonDelete.id = 'confirmButtonDelete' + roleName;
    confirmButtonDelete.className = 'button';
    confirmButtonDelete.textContent = 'Confirm';
    confirmButtonDelete.addEventListener('click', () => {
        const element = document.querySelector('.card.' + roleName + '.' + selectDeviceDelete.value);
        if (element) {
            const index = ThingsBoardHandle.getIndexThingsBoard(roleName);
            const url = 'https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/' + ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID() + '/timeseries/delete?keys=' + selectDeviceDelete.value + '&deleteAllDataForKeys=true&rewriteLatestIfDeleted=true';
            axios.delete(url, {
                headers: {
                    'X-Authorization': 'Bearer ' + MainHandle.globalAccessToken
                }
            });
            element.remove();
        } else {
            alert("Có Card đâu mà Xoá? " + roleName + " " + selectDeviceAdd.value);
        }
    });
    buttonContainerDelete.appendChild(cancelButtonDelete);
    buttonContainerDelete.appendChild(confirmButtonDelete);

    dialogDelete.appendChild(selectRoleDelete);
    dialogDelete.appendChild(selectDeviceDelete);
    dialogDelete.appendChild(buttonContainerDelete);
    overlayDelete.appendChild(dialogDelete);

    //
    const newGrid = document.createElement('div');
    newGrid.className = 'grid-container ' + roleName;
    newTabPane.appendChild(newLabel)
    newTabPane.appendChild(openButtonAdd);
    newTabPane.appendChild(openButtonDelete);
    newTabPane.appendChild(openButtonSync);
    newTabPane.appendChild(overlayAdd);
    newTabPane.appendChild(overlayDelete);
    newTabPane.appendChild(newGrid);
    cardContainerDevice.appendChild(newTabPane);
}

//============================LIST ALARM CARD VIEW========================
export function addListAlarmCardView(alarm) {
    const cardContainer = document.querySelector('.grid-container.list');
    // Tạo các phần tử HTML cho cardview
    const card = document.createElement('div');
    card.className = 'card ' + alarm.getId();

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const alarmHeader = document.createElement('div');
    alarmHeader.className = 'alarm-header';

    const roleNameElement = document.createElement('h4');
    roleNameElement.className = 'role-name';
    roleNameElement.textContent = alarm.getRole();

    const cancelalarm = document.createElement('div');
    cancelalarm.className = 'cancel-alarm';

    cancelalarm.addEventListener('click', function () {
        const clickedRoleName = alarm.getRole();
        const clickedId = alarm.getId();
        const card = this.closest('.card'); // Lấy ra thẻ Cardview cha gần nhất
        const index = parseInt(ThingsBoardHandle.getIndexThingsBoard(clickedRoleName));
        if (MainHandle.isGatewayConnected == true) {
            ThingsBoardHandle.DeleteAlarm(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), clickedId, (error, data) => {
                if (error) {
                    console.error('An error occurred:', error);
                } else {
                    card.remove();
                    Toast.toastActive("Alarm", `Delete ${clickedRoleName} Complete!!!`);
                    console.log('Delete Complete:', data);
                }
            });
        } else {
            Toast.toastActive("Cancel Alarm", `Disconnected to Gateway!!!`);
        }
    });
    const cancelImg = document.createElement('img');
    cancelImg.src = 'assets/img/cancel.png';
    cancelImg.alt = 'cancel';
    cancelImg.classList.add('effect');
    cancelImg.addEventListener('hover', function () {
        cancelImg.style.transform = 'scale(1.05)';
    });
    cancelalarm.appendChild(cancelImg);

    alarmHeader.appendChild(roleNameElement);
    alarmHeader.appendChild(cancelalarm);

    const idElement = document.createElement('p');
    idElement.className = 'device-status';
    idElement.textContent = 'ID: ' + alarm.getId();

    const deviceElement = document.createElement('p');
    deviceElement.className = 'device-status';
    deviceElement.textContent = 'Device: ' + alarm.getDevice();

    const StateElement = document.createElement('p');
    StateElement.className = 'device-status';
    if (alarm.getState().includes("1")) {
        StateElement.textContent = 'State: ON';
    } else {
        StateElement.textContent = 'State: OFF';
    }

    const DateElement = document.createElement('p');
    DateElement.className = 'device-status';
    DateElement.textContent = 'Date: ' + alarm.getDate();

    const timeElement = document.createElement('p');
    timeElement.className = 'device-status';
    timeElement.textContent = 'Time: ' + alarm.getTime();

    cardBody.appendChild(alarmHeader);
    cardBody.appendChild(idElement);
    cardBody.appendChild(deviceElement);
    cardBody.appendChild(StateElement);
    cardBody.appendChild(DateElement);
    cardBody.appendChild(timeElement);

    card.appendChild(cardBody);
    // Thêm cardview mới vào vùng chứa
    cardContainer.appendChild(card);
}

//============================DEVICE CARD VIEW========================
export function createAirConditionerCardView(role, deviceName, deviceStatus) {
    var cardContainer = document.querySelector('.grid-container.' + role);

    var card = document.createElement('div');
    card.className = 'card ' + role + ' ' + deviceName;


    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';


    var deviceHeader = document.createElement('div');
    deviceHeader.className = 'device-header';


    var img = document.createElement('img');
    if (deviceName.includes("Air Conditioner")) {
        img.src = './assets/img/airconditioneroff.png';
        img.alt = 'Air';
    }

    var toggleButton = document.createElement('div');
    toggleButton.className = 'toggle-button ' + role + deviceName;


    var input = document.createElement('input');
    input.className = 'input ' + role + deviceName;
    input.type = 'checkbox';
    var inputId = `lightSwitch${Math.floor(Math.random() * 100)}`; // Tạo ID ngẫu nhiên để tránh trùng lặp
    input.id = inputId;


    const p = document.createElement('p');
    p.className = 'device-status ' + role + deviceName;

    var isToggleOn
    if (deviceName.includes("Air Conditioner")) {
        isToggleOn = parseInt(deviceStatus, 10);
        if (isToggleOn == 1) {
            card.classList.add('active');
            p.textContent = 'ON';
            toggleButton.classList.add('active'); // Add 'active' class for 'ON' state
            input.checked = true;
            img.src = './assets/img/airconditioneron.png';
        } else {
            card.classList.remove('active');
            toggleButton.classList.remove('active'); // Add 'active' class for 'ON' state
            input.checked = false;
            p.textContent = 'OFF';
            img.src = './assets/img/airconditioneron.png';
        }
    } else {
        p.textContent = deviceStatus;
    }

    // Tạo overlayAdd
    const airTemContain = document.createElement('div');
    airTemContain.className = 'airTemContain';
    airTemContain.id = 'airTemContain' + role;

    var addImageButton = document.createElement('img');
    addImageButton.src = '../assets/img/plus.png'; // Đặt đường dẫn của ảnh
    addImageButton.alt = 'add button'; // Thay thế bằng mô tả của ảnh
    addImageButton.className = 'addButton'; // Thêm lớp CSS nếu cần thiết

    const pTemValue = document.createElement('p');
    pTemValue.className = 'value-tem ' + role + deviceName;
    pTemValue.textContent = `${MainHandle.globalAC.value} °C`;

    var minusImageButton = document.createElement('img');
    minusImageButton.src = '../assets/img/minus.png'; // Đặt đường dẫn của ảnh
    minusImageButton.alt = 'minus button'; // Thay thế bằng mô tả của ảnh
    minusImageButton.className = 'minusButton'; // Thêm lớp CSS nếu cần thiết

    addImageButton.addEventListener('click', function () {
        const clickedDeviceName = 'air';
        const roleName = role;
        const card = this.closest('.card'); // Tìm cardview cha gần nhất
        if (MainHandle.isGatewayConnected == true) {
            if (deviceName.includes("Air Conditioner")) {
                if (Number(isToggleOn) == 1) {
                    if (MainHandle.globalAC.value < 30) {
                        MainHandle.globalAC.value = MainHandle.globalAC.value + 1;
                        pTemValue.textContent = `${MainHandle.globalAC.value}°C`
                        Toast.toastActive("Control Device", `Increase the temperature successfully!!!`);
                        let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
                        ThingsBoardHandle.httpPostTelemetryData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), 'aChange', Number(MainHandle.globalAC.value), (error, data) => {
                            if (error) {
                                console.error("An error occurred:", error);
                            } else {
                                console.log("Đã gửi Post thành công !!!" + data);
                            }
                        });
                        card.classList.add('active'); // Thêm lớp active khi toggle bật
                        p.textContent = 'ON';
                    } else {
                        Toast.toastActive("AC Control", `Exceeding the allowed temperature (30oC)!!!`);
                    }
                } else {
                    Toast.toastActive("AC Control", `Air Condition not turn on yet!!!`);
                }
            }
        } else {
            Toast.toastActive("Device Control", `Disconnected to Gateway!!!`);
        }
    });

    minusImageButton.addEventListener('click', function () {
        const clickedDeviceName = 'air';
        const roleName = role;
        const card = this.closest('.card'); // Tìm cardview cha gần nhất
        if (MainHandle.isGatewayConnected == true) {
            if (deviceName.includes("Air Conditioner")) {
                if (Number(isToggleOn) == 1) {
                    if (MainHandle.globalAC.value > 16) {
                        MainHandle.globalAC.value--;
                        pTemValue.textContent = `${MainHandle.globalAC.value}°C`
                        Toast.toastActive("Control Device", `Increase the temperature successfully!!!`);
                        let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
                        ThingsBoardHandle.httpPostTelemetryData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), 'aChange', Number(MainHandle.globalAC.value), (error, data) => {
                            if (error) {
                                console.error("An error occurred:", error);
                            } else {
                                console.log("Đã gửi Post thành công !!!" + data);
                            }
                        });
                        card.classList.add('active'); // Thêm lớp active khi toggle bật
                        p.textContent = 'ON';
                    } else {
                        Toast.toastActive("AC Control", `Decrease exceed the allowed temperature (>=16oC)!!!`);
                    }
                } else {
                    Toast.toastActive("AC Control", `Air Condition not turn on yet!!!`);
                }
            }
        } else {
            Toast.toastActive("Device Control", `Disconnected to Gateway!!!`);
        }
    });

    airTemContain.appendChild(minusImageButton);
    airTemContain.appendChild(pTemValue);
    airTemContain.appendChild(addImageButton);

    // Tạo một mảng các chế độ điều hòa
    const modes = [
        { name: 'Cool', imageSrc: '../assets/img/cool.png' },
        { name: 'Heat', imageSrc: '../assets/img/heat.png' },
        { name: 'Wind', imageSrc: '../assets/img/wind.png' },
        { name: 'Dry', imageSrc: '../assets/img/dry.png' }
    ];

    // Chọn phần tử chứa các chế độ điều hòa
    const modesContainer = document.createElement('div');
    modesContainer.className = 'modes-container';

    // Duyệt qua mảng chế độ và tạo các phần tử HTML tương ứng
    modes.forEach(mode => {
        // Tạo div chứa hình ảnh và chữ
        const modeOption = document.createElement('div');
        modeOption.classList.add('mode-option');

        // Tạo hình ảnh
        const img = document.createElement('img');
        img.src = mode.imageSrc;
        img.alt = mode.name;

        // Tạo chữ liên quan đến chế độ
        const p = document.createElement('p');
        p.textContent = mode.name;

        // Thêm hình ảnh và chữ vào div chứa
        modeOption.appendChild(img);
        modeOption.appendChild(p);

        // Thêm sự kiện khi click để hiển thị chế độ đang chọn
        modeOption.addEventListener('click', () => {
            // Xóa class 'selected' khỏi tất cả các phần tử
            document.querySelectorAll('.mode-option').forEach(option => {
                option.classList.remove('selected');
            });

            // Thêm class 'selected' cho phần tử được click
            modeOption.classList.add('selected');
            // const card = this.closest('.card'); // Tìm cardview cha gần nhất
            if (MainHandle.isGatewayConnected == true) {
                if (deviceName.includes("Air Conditioner")) {
                    if (Number(isToggleOn) == 1) {
                        const roleName = role;
                        const selectedMode = modeOption.querySelector('p').textContent;
                        if (selectedMode === 'Cool') {
                            MainHandle.globalAC.mode = 2;
                        } else if (selectedMode === 'Heat') {
                            MainHandle.globalAC.mode = 3;
                        } else if (selectedMode === 'Wind') {
                            MainHandle.globalAC.mode = 4;
                        } else if (selectedMode === 'Dry') {
                            MainHandle.globalAC.mode = 1;
                        }
                        Toast.toastActive("Control Device", `Select Mode ${selectedMode} temperature successfully!!!`);
                        let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
                        ThingsBoardHandle.httpPostTelemetryData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), 'aMode', Number(MainHandle.globalAC.mode), (error, data) => {
                            if (error) {
                                console.error("An error occurred:", error);
                            } else {
                                console.log("Đã gửi Post thành công !!!" + data);
                            }
                        });
                    } else {
                        Toast.toastActive("AC Control", `Air Condition not turn on yet!!!`);
                    }
                }
            } else {
                Toast.toastActive("Device Control", `Disconnected to Gateway!!!`);
            }
        });

        // Thêm div chứa hình ảnh và chữ vào container chính
        modesContainer.appendChild(modeOption);
    });

    toggleButton.addEventListener('change', function () {
        const clickedDeviceName = 'air';
        const roleName = role;
        const card = this.closest('.card'); // Tìm cardview cha gần nhất
        if (MainHandle.isGatewayConnected == true) {
            if (deviceName.includes("Air Conditioner")) {
                isToggleOn = !isToggleOn; // Toggle trạng thái
                var value = Number(isToggleOn);
                if (isToggleOn) {
                    Toast.toastActive("Control Device", `Turn ON ${deviceName} Complete!!!`);
                    let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
                    ThingsBoardHandle.httpPostTelemetryData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), 'aOnOff', Number(isToggleOn), (error, data) => {
                        if (error) {
                            console.error("An error occurred:", error);
                        } else {
                            console.log("Đã gửi Post thành công !!!" + data);
                        }
                    });
                    card.classList.add('active'); // Thêm lớp active khi toggle bật
                    p.textContent = 'ON';
                } else {
                    Toast.toastActive("Control Device", `Turn OFF ${deviceName} Complete!!!`);
                    let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
                    ThingsBoardHandle.httpPostTelemetryData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), 'aOnOff', Number(isToggleOn), (error, data) => {
                        if (error) {
                            console.error("An error occurred:", error);
                        } else {
                            console.log("Đã gửi Post thành công !!!" + data);
                        }
                    });
                    card.classList.remove('active'); // Xóa lớp active khi toggle tắt
                    p.textContent = 'OFF';
                }
            }
        } else {
            Toast.toastActive("Device Control", `Disconnected to Gateway!!!`);
        }
    });


    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.className = 'switch';


    toggleButton.appendChild(input);
    toggleButton.appendChild(label);


    deviceHeader.appendChild(img);
    deviceHeader.appendChild(toggleButton);


    const h3 = document.createElement('h3');
    h3.className = 'device-name';
    h3.textContent = deviceName.charAt(0).toUpperCase() + deviceName.slice(1);

    // Thêm deviceHeader, h3 và p vào card-body
    cardBody.appendChild(deviceHeader);
    cardBody.appendChild(h3);
    cardBody.appendChild(p);
    cardBody.appendChild(airTemContain);
    cardBody.appendChild(modesContainer);
    // Thêm card-body vào card
    card.appendChild(cardBody);
    cardContainer.appendChild(card);

    if (MainHandle.globalAC.mode == 2) {
        const divWithCoolAlt = document.querySelector('div.mode-option img[alt="Cool"]').closest('.mode-option');
        divWithCoolAlt.classList.add('selected');

    } else if (MainHandle.globalAC.mode == 3) {
        const divWithCoolAlt = document.querySelector('div.mode-option img[alt="Heat"]').closest('.mode-option');
        divWithCoolAlt.classList.add('selected');

    } else if (MainHandle.globalAC.mode == 4) {
        const divWithCoolAlt = document.querySelector('div.mode-option img[alt="Wind"]').closest('.mode-option');
        divWithCoolAlt.classList.add('selected');

    }
    else if (MainHandle.globalAC.mode == 6) {
        const divWithCoolAlt = document.querySelector('div.mode-option img[alt="Dry"]').closest('.mode-option');
        divWithCoolAlt.classList.add('selected');
    }
}

export function createDeviceCardView(role, deviceName, deviceStatus) {
    var cardContainer = document.querySelector('.grid-container.' + role);

    var card = document.createElement('div');
    card.className = 'card ' + role + ' ' + deviceName;


    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';


    var deviceHeader = document.createElement('div');
    deviceHeader.className = 'device-header';


    var img = document.createElement('img');
    if (deviceName.includes("led")) {
        img.src = './assets/img/light_icon.png';
        img.alt = 'Light';
    } else if (deviceName.includes("fan")) {
        img.src = './assets/img/fan.png';
        img.alt = 'fan';
    } else {
        img.src = './assets/img/device.png';
        img.alt = 'device';
    }



    var toggleButton = document.createElement('div');
    toggleButton.className = 'toggle-button ' + role + deviceName;


    var input = document.createElement('input');
    input.className = 'input ' + role + deviceName;
    input.type = 'checkbox';
    var inputId = `lightSwitch${Math.floor(Math.random() * 100)}`; // Tạo ID ngẫu nhiên để tránh trùng lặp
    input.id = inputId;


    const p = document.createElement('p');
    p.className = 'device-status ' + role + deviceName;

    var isToggleOn
    if (deviceName.includes("led") || deviceName.includes("fan") || deviceName.includes("device")) {
        isToggleOn = parseInt(deviceStatus, 10);
        if (isToggleOn == 1) {
            card.classList.add('active');
            toggleButton.classList.add('active'); // Add 'active' class for 'ON' state
            input.checked = true;
            p.textContent = 'ON';
        } else {
            card.classList.remove('active');
            toggleButton.classList.remove('active'); // Add 'active' class for 'ON' state
            input.checked = false;
            p.textContent = 'OFF';
        }
    } else {
        p.textContent = deviceStatus;
    }

    toggleButton.addEventListener('change', function () {
        const clickedDeviceName = deviceName;
        const roleName = role;
        const card = this.closest('.card'); // Tìm cardview cha gần nhất
        if (MainHandle.isGatewayConnected == true) {
            if (deviceName.includes("led") || deviceName.includes("fan") || deviceName.includes("device")) {
                isToggleOn = !isToggleOn; // Toggle trạng thái
                var value = Number(isToggleOn);
                if (isToggleOn) {
                    Toast.toastActive("Control Device", `Turn ON ${clickedDeviceName} Complete!!!`);
                    let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
                    ThingsBoardHandle.httpPostTelemetryData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), clickedDeviceName, Number(isToggleOn), (error, data) => {
                        if (error) {
                            console.error("An error occurred:", error);
                        } else {
                            console.log("Đã gửi Post thành công !!!" + data);
                        }
                    });
                    card.classList.add('active'); // Thêm lớp active khi toggle bật
                    p.textContent = 'ON';
                } else {
                    Toast.toastActive("Control Device", `Turn OFF ${clickedDeviceName} Complete!!!`);
                    let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
                    ThingsBoardHandle.httpPostTelemetryData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), clickedDeviceName, Number(isToggleOn), (error, data) => {
                        if (error) {
                            console.error("An error occurred:", error);
                        } else {
                            console.log("Đã gửi Post thành công !!!" + data);
                        }
                    });
                    card.classList.remove('active'); // Xóa lớp active khi toggle tắt
                    p.textContent = 'OFF';
                }
            }
        } else {
            Toast.toastActive("Device Control", `Disconnected to Gateway!!!`);
        }
    });


    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.className = 'switch';


    toggleButton.appendChild(input);
    toggleButton.appendChild(label);


    deviceHeader.appendChild(img);
    deviceHeader.appendChild(toggleButton);


    const h3 = document.createElement('h3');
    h3.className = 'device-name';
    h3.textContent = deviceName.charAt(0).toUpperCase() + deviceName.slice(1);


    // Thêm deviceHeader, h3 và p vào card-body
    cardBody.appendChild(deviceHeader);
    cardBody.appendChild(h3);
    cardBody.appendChild(p);

    // Thêm card-body vào card
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
}

export function createDeviceTemperatureCardView(role, deviceName, deviceStatus) {
    var cardContainer = document.querySelector('.grid-container.' + role);

    const card = document.createElement('div');
    card.className = 'card ' + role + ' ' + deviceName;


    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';


    const deviceHeader = document.createElement('div');
    deviceHeader.className = 'device-header';
    const pDeviceInfo = document.createElement('p');
    const pValueCard = document.createElement('p');
    if (deviceName.includes("temperature")) {

        const imgThermometer = document.createElement('img');
        imgThermometer.src = './assets/img/thermometer.png';
        imgThermometer.alt = 'Thermometer';
        deviceHeader.appendChild(imgThermometer);

        pValueCard.className = 'value-card ' + role + deviceName;
        pValueCard.textContent = `${deviceStatus}°`;


        pDeviceInfo.className = 'device-info';
        pDeviceInfo.textContent = 'Temperature,°C';
    } else if (deviceName.includes("humidity")) {

        const imgHumidity = document.createElement('img');
        imgHumidity.src = './assets/img/humidity.png';
        imgHumidity.alt = 'humidity';
        deviceHeader.appendChild(imgHumidity);


        pValueCard.className = 'value-card ' + role + deviceName;
        pValueCard.textContent = `${deviceStatus} %`;



        pDeviceInfo.className = 'device-info';
        pDeviceInfo.textContent = 'Humidity,%';
    } else {

        const imgLight = document.createElement('img');
        imgLight.src = './assets/img/sun.png';
        imgLight.alt = 'sun';
        deviceHeader.appendChild(imgLight);

        pValueCard.className = 'value-card ' + role + deviceName;
        pValueCard.textContent = `${deviceStatus} lm`;



        pDeviceInfo.className = 'device-info';
        pDeviceInfo.textContent = 'Light ,lm';
    }

    const pTextPeriod = document.createElement('p');
    pTextPeriod.className = 'text-period ' + role + deviceName;
    pTextPeriod.textContent = `NANp/lần`;


    const imgSync = document.createElement('img');
    imgSync.src = './assets/img/sync.png';
    imgSync.alt = 'Sync';
    imgSync.classList.add('effect');
    imgSync.addEventListener('hover', function () {
        imgSync.style.transform = 'scale(1.05)'; // Tăng kích thước khi hover
    });
    imgSync.addEventListener('click', function () {
        const clickedDeviceName = deviceName;
        const roleName = role;
        let periodName;
        if (clickedDeviceName.includes("temperature")) {
            periodName = "tPeriod";
        } else if (clickedDeviceName.includes("humidity")) {
            periodName = "hPeriod";
        } else if (clickedDeviceName.includes("light")) {
            periodName = "lPeriod";
        }
        let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
        const apiUrl = ThingsBoardHandle.THINGSBOARD_GET_LASTDATA_BYKEYS_URL.replace("DEVICE_ID", ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID())
            .replace("KEY", periodName);

        axios.get(apiUrl, {
            headers: {
                'X-Authorization': 'Bearer ' + MainHandle.globalAccessToken
            }
        })
            .then(response => {
                if (clickedDeviceName.includes("temperature")) {
                    pTextPeriod.textContent = response.data.tPeriod[0].value + 'p/lần'
                } else if (clickedDeviceName.includes("humidity")) {
                    pTextPeriod.textContent = response.data.hPeriod[0].value + 'p/lần'
                } else if (clickedDeviceName.includes("light")) {
                    pTextPeriod.textContent = response.data.lPeriod[0].value + 'p/lần'
                }
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    });


    deviceHeader.appendChild(pTextPeriod);
    deviceHeader.appendChild(imgSync);



    const periodContainer = document.createElement('div');
    periodContainer.className = 'period-container';


    const inputSetPeriod = document.createElement('input');
    inputSetPeriod.type = 'text';
    inputSetPeriod.className = 'edittext-set-period';
    inputSetPeriod.name = 'userInput';
    inputSetPeriod.placeholder = 'Enter Period';


    const imgSendMessage = document.createElement('img');
    imgSendMessage.src = 'assets/img/send-message.png';
    imgSendMessage.alt = 'Send Message';
    imgSendMessage.classList.add('effect');
    imgSendMessage.addEventListener('hover', function () {
        imgSendMessage.style.transform = 'scale(1.05)';
    });

    imgSendMessage.addEventListener('click', function () {
        const clickedDeviceName = deviceName;
        const roleName = role;
        const userInputValue = inputSetPeriod.value; // Lấy giá trị từ inputSetPeriod
        if (userInputValue.trim() === '') {
            alert('Please enter a Period value.'); // Hiển thị cảnh báo nếu giá trị trống hoặc chỉ chứa khoảng trắng
        } else {
            let periodName;
            if (clickedDeviceName.includes("temperature")) {
                periodName = "tPeriod";
            } else if (clickedDeviceName.includes("humidity")) {
                periodName = "hPeriod";
            } else if (clickedDeviceName.includes("light")) {
                periodName = "lPeriod";
            }
            if (MainHandle.isGatewayConnected == true) {
                let index = ThingsBoardHandle.getIndexThingsBoard(roleName);
                ThingsBoardHandle.httpPostTelemetryData(MainHandle.globalAccessToken, ThingsBoardInfo.THINGS_BOARD_INFOS[index].getDeviceID(), periodName, Number(userInputValue), (error, data) => {
                    if (error) {
                        console.error("An error occurred:", error);
                    } else {
                        Toast.toastActive("Set Period", `Set Period ${clickedDeviceName} Complete!!!`);
                    }
                });
            } else {
                Toast.toastActive("Device Control", `Disconnected to Gateway!!!`);
            }
        }
    });

    // Thêm input và img vào period-container
    periodContainer.appendChild(inputSetPeriod);
    periodContainer.appendChild(imgSendMessage);

    // Thêm các phần tử vào card-body
    cardBody.appendChild(deviceHeader);
    cardBody.appendChild(pValueCard);
    cardBody.appendChild(pDeviceInfo);
    cardBody.appendChild(periodContainer);

    // Thêm card-body vào card
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
}