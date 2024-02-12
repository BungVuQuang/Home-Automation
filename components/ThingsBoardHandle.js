const THINGSBOARD_POST_API = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/timeseries/ANY?scope=ANY";
const THINGSBOARD_URL_LOGIN = "https://thingsboard.cloud:443/api/auth/login";
const THINGSBOARD_GET_LASTDATA_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/values/timeseries?useStrictDataTypes=true";
export const THINGSBOARD_GET_LASTDATA_BYKEYS_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/values/timeseries?keys=KEY&useStrictDataTypes=true";
const THINGSBOARD_GET_TIMESERIES_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/values/timeseries?keys=FIELD&startTs=TIME_START&endTs=TIME_END&limit=10000&useStrictDataTypes=true";
const THINGSBOARD_GET_MESH_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/values/attributes/SHARED_SCOPE"
const THINGSBOARD_GET_ALARM_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/values/attributes/SHARED_SCOPE"
const THINGSBOARD_GETKEYS_ALARM_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/keys/attributes/SHARED_SCOPE"
export const THINGSBOARD_POST_ALARM_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/SHARED_SCOPE"
const THINGSBOARD_DELETE_AlARM_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/SHARED_SCOPE?keys=KEY"
const THINGSBOARD_DELETE_ALL_AlARM_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/SHARED_SCOPE?keys=Node2_0,Node2_1,Node2_2,Node2_3,Node2_4,Node2_5,Node2_6,Node2_7,Node2_8,Node2_9"
const THINGSBOARD_DELETE_ALL_ELEMENT_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/timeseries/delete?keys=led,fan,device1,device2,device3,temperature,humidity,light,tPeriod,hPeriod,lPeriod&deleteAllDataForKeys=true"
const THINGSBOARD_DELETE_MESH_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/DEVICE_ID/SHARED_SCOPE?keys=KEY"
const THINGSBOARD_GET_ACTIVE_URL = "https://thingsboard.cloud:443/api/plugins/telemetry/DEVICE/1c2f2e10-bcc4-11ee-a441-01b9c6b9277c/values/attributes/SERVER_SCOPE?keys=KEY"
//const THINGSBOARD_GET_UPDATE_MESH_URL = "http://thingsboard.cloud/api/v1/CbKAIXsZ7sD1ty2grTMO/attributes/updates?timeout=20000"
const THINGSBOARD_GET_UPDATE_MESH_URL = "https://web-production-e849.up.railway.app/https://thingsboard.cloud:443/api/v1/ACCESS_TOKEN/attributes/updates?timeout=40000"
const THINGSBOARD_GET_UPDATE_AlARM_URL = "https://web-production-e849.up.railway.app/https://thingsboard.cloud:443/api/v1/ACCESS_TOKEN/attributes/updates?timeout=40000"


//const THINGSBOARD_GET_UPDATE_MESH_URL = "https://thingsboard.cloud:443/api/v1/bycaxLyZqWkVFvjftYB7/attributes/updates?timeout=20000"

export function getIndexThingsBoard(selectedElement) {
    switch (selectedElement) {
        case "Gateway":
            return 0;
        case "Node1":
            return 1;
        case "Node2":
            return 2;
        case "Node3":
            return 3;
        case "Node4":
            return 4;
        case "Node5":
            return 5;
        case "Node6":
            return 6;
        default:
            return -1;
    }
}

export function getJwtToken(userTB, passwordTB, callback) {
    const requestBody = {
        username: userTB,
        password: passwordTB
    };

    axios.post(THINGSBOARD_URL_LOGIN, requestBody, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function extractDateFromTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Ho_Chi_Minh' // Thiết lập múi giờ Asia/Ho_Chi_Minh (GMT+07:00)
        };
        const dateFormat = new Intl.DateTimeFormat('en-US', options);
        return dateFormat.format(date);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function convertDateTimeToTimestamp(dateStr, timeStr) {
    try {
        const dateTimeStr = `${dateStr} ${timeStr}:01`;
        const dateFormat = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh' // Thiết lập múi giờ Asia/Ho_Chi_Minh
        });

        const formattedDate = new Date(dateTimeStr);
        const formattedDateString = dateFormat.format(formattedDate);

        const date = new Date(formattedDateString);
        return date.getTime();
    } catch (error) {
        console.error(error);
        return -1;
    }
}

export function getActiveStatus(jwtToken, key, callback) {

    const apiUrl = THINGSBOARD_GET_ACTIVE_URL.replace("KEY", key);

    axios.get(apiUrl, {
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken
        }
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function getMeshInfo(jwtToken, deviceID, callback) {

    const apiUrl = THINGSBOARD_GET_MESH_URL.replace("DEVICE_ID", deviceID);

    axios.get(apiUrl, {
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken
        }
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function getUpdateMesh(accessToken, callback) {
    const apiUrl = THINGSBOARD_GET_UPDATE_MESH_URL.replace("ACCESS_TOKEN", accessToken);

    axios({
        method: 'GET',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function getUpdateAlarm(accessToken, callback) {
    const apiUrl = THINGSBOARD_GET_UPDATE_AlARM_URL.replace("ACCESS_TOKEN", accessToken);

    axios({
        method: 'GET',
        url: apiUrl,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function DeleteAlarm(jwtToken, deviceID, keys, callback) {
    const apiUrl = THINGSBOARD_DELETE_AlARM_URL.replace("DEVICE_ID", deviceID)
        .replace("KEY", keys);

    axios({
        method: 'DELETE',
        url: apiUrl,
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken,
            'accept': 'application/json',
        },
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function DeleteAllAlarm(jwtToken, deviceID, index, callback) {
    const apiUrl = THINGSBOARD_DELETE_ALL_AlARM_URL.replace("DEVICE_ID", deviceID).replace(/Node2/g, "Node" + index);
    console.log(apiUrl);
    axios({
        method: 'DELETE',
        url: apiUrl,
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken,
            'accept': 'application/json',
        },
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function DeleteAllElementData(jwtToken, deviceID, callback) {
    const apiUrl = THINGSBOARD_DELETE_ALL_ELEMENT_URL.replace("DEVICE_ID", deviceID);

    axios({
        method: 'DELETE',
        url: apiUrl,
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken,
            'accept': 'application/json',
        },
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function DeleteMesh(jwtToken, deviceID, keys, callback) {
    const apiUrl = THINGSBOARD_DELETE_MESH_URL.replace("DEVICE_ID", deviceID)
        .replace("KEY", keys);

    axios({
        method: 'DELETE',
        url: apiUrl,
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken,
            'accept': 'application/json',
        },
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function getAlarm(jwtToken, deviceID, callback) {
    const apiUrl = THINGSBOARD_GET_ALARM_URL.replace("DEVICE_ID", deviceID);

    axios.get(apiUrl, {
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken,
        }
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}

export function getKeysAlarm(jwtToken, deviceID, callback) {
    const apiUrl = THINGSBOARD_GETKEYS_ALARM_URL.replace("DEVICE_ID", deviceID);

    axios.get(apiUrl, {
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken,
        }
    })
        .then(response => {
            callback(null, response.data);
        })
        .catch(error => {
            callback(error);
        });
}


export function getFieldData(jwtToken, deviceID, field, startTS, endTS, callback) {
    const apiUrl = THINGSBOARD_GET_TIMESERIES_URL.replace("DEVICE_ID", deviceID)
        .replace("FIELD", field)
        .replace("TIME_START", startTS)
        .replace("TIME_END", endTS);

    axios.get(apiUrl, {
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken
        }
    })
        .then(response => {
            // Handle the successful response here
            callback(null, response.data);
        })
        .catch(error => {
            // Handle errors here
            callback(error);
        });
}

export function getLastData(jwtToken, deviceID, callback) {
    const apiUrl = THINGSBOARD_GET_LASTDATA_URL.replace("DEVICE_ID", deviceID);

    axios.get(apiUrl, {
        headers: {
            'X-Authorization': 'Bearer ' + jwtToken
        }
    })
        .then(response => {
            // Xử lý phản hồi thành công
            callback(null, response.data);
        })
        .catch(error => {
            // Xử lý lỗi
            callback(error);
        });
}


export function httpPostTelemetryData(jwtToken, deviceID, deviceName, value, callback) {
    const apiUrl = THINGSBOARD_POST_API.replace("DEVICE_ID", String(deviceID));
    const json = JSON.stringify({ [deviceName]: value });

    axios.post(apiUrl, json, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Authorization': 'Bearer ' + jwtToken
        }
    })
        .then(response => {
            // Handle the successful response here
            callback(null, response.data);
        })
        .catch(error => {
            // Handle errors here
            callback(error);
        });
}
