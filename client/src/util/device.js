const PERM = {
  IP_RO: 0,
  IP_WO: 1,
  IP_RW: 2,
};

const PROP_STATE = {
  IPS_IDLE: 0,
  IPS_OK: 1,
  IPS_BUSY: 2,
  IPS_ALERT: 3,
};

const RULE = {
  ISR_1OFMANY: 0,
  ISR_ATMOST1: 1,
  ISR_NOFMANY: 2,
};

const SWITCH_STATE = {
  ISS_OFF: 0,
  ISS_ON: 1,
};

const buildDevice = (properties) => {
  if (!properties) {
    return null;
  }

  let device = {
    name: null,
    groups: {},
  };

  properties.forEach(p => {
    if (!device.groups[p.group]) {
      device.groups[p.group] = { name: p.group, properties: [] };
    }

    device.groups[p.group].properties.push(p);

    if (p.name === "DRIVER_INFO") {
      device.name = p.texts.find(t => {
        return t.name === "DRIVER_NAME";
      }).value;
    }
  });

  return device;
};

export {
  PERM,
  PROP_STATE,
  RULE,
  SWITCH_STATE,
  buildDevice,
};
