class ThingsBoardInfo {
    constructor(accessToken, deviceID) {
        this.accessToken = accessToken;
        this.deviceID = deviceID;
    }

    getAccessToken() {
        return this.accessToken;
    }

    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }

    getDeviceID() {
        return this.deviceID;
    }

    setDeviceID(deviceID) {
        this.deviceID = deviceID;
    }

    static getIndexThingsBoard(selectedElement) {
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
            case "Node7":
                return 7;
            default:
                return -1; // Giá trị mặc định hoặc xử lý lỗi
        }
    }
}

// export const THINGS_BOARD_INFOS = [
//     new ThingsBoardInfo("364srax1tbWMaZPNUpw6", "886bd7f0-3ef6-11ee-abb9-f718d8dc6e84"),
//     new ThingsBoardInfo("bycaxLyZqWkVFvjftYB7", "8de86ea0-3f14-11ee-abb9-f718d8dc6e84"),
//     new ThingsBoardInfo("mqR1QCsppX3gewAuZUON", "92eaa0d0-3f14-11ee-abb9-f718d8dc6e84"),
//     new ThingsBoardInfo("fJRDuiHLp95poFNSi8wn", "97515650-3f14-11ee-abb9-f718d8dc6e84"),
//     new ThingsBoardInfo("ek0sBgExgvIvLOg5YRJn", "9cf39910-3f14-11ee-92e0-eb0f2a9d5dee"),
//     new ThingsBoardInfo("m0JKobakOgLNYUS2g9l6", "a1c6a4f0-3f14-11ee-92e0-eb0f2a9d5dee"),
//     new ThingsBoardInfo("erD3L1x1M6KRequAVnaI", "ab05bd80-3f14-11ee-af4f-b7320cf3b43d"),
// ];

export const THINGS_BOARD_INFOS = [
    new ThingsBoardInfo("7ZvQBCNeQICxPQkSxlfh", "1c2f2e10-bcc4-11ee-a441-01b9c6b9277c"),
    new ThingsBoardInfo("wRYkjd8aLCnBejYhxPcz", "22781110-bcc4-11ee-862d-c1e0a53112a0"),
    new ThingsBoardInfo("DpX5Fc6ip4azNoyBhnnh", "a75fcf30-bcc4-11ee-a1be-053f95f9b401"),
    new ThingsBoardInfo("l4odG8CgyhSLW0CzsmsS", "ab700040-bcc4-11ee-a124-0d00bef77fcc"),
    new ThingsBoardInfo("eIpdTlv1I4ivvljJIrKd", "b4776700-bcc4-11ee-a441-01b9c6b9277c"),
];

export default ThingsBoardInfo;
