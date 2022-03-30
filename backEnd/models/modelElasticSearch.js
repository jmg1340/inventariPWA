const mongoose = require('mongoose');
const {Schema} = mongoose;

const shcES = new Schema ({
		// _id: "Object",
    FECHAHORA: 'String',
    HARDWARE_NAME: 'String',
    MONITOR_1_SN: 'String',
    LLDP_RID1_SWITCH_PORTDESCR: 'String',
    LLDP_RID1_SWITCH_SYSNAME: 'String',
    p4k_FREQUENT_USERS: 'String'
}, { collection : 'ES_registres' })

module.exports = mongoose.model('ES_registre', shcES)