class NodeInfo {
    constructor(parent, role, unicast, uuid) {
        this.parent = parent;
        this.role = role;
        this.unicast = unicast;
        this.uuid = uuid;
    }

    getRole() {
        return this.role;
    }

    setRole(role) {
        this.role = role;
    }

    getUuid() {
        return this.uuid;
    }

    setUuid(uuid) {
        this.uuid = uuid;
    }

    getUnicast() {
        return this.unicast;
    }

    setUnicast(unicast) {
        this.unicast = unicast;
    }

    getParent() {
        return this.parent;
    }

    setParent(parent) {
        this.parent = parent;
    }
}

export default NodeInfo;