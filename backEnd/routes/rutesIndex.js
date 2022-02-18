const express = require("express");
const router = express.Router();

const contrInvHosp = require("../controllers/controllerInventariHospital")
const contrInvAsep = require("../controllers/controllerInventariAsepeyo")



/* INVENTARI HOSPITAL */

router.get("/hospital", contrInvHosp.llistaTots)
router.get("/hospital/:id", contrInvHosp.llistaUn)
router.put("/hospital/:id", contrInvHosp.actualitzaUn)
router.post("/hospital", contrInvHosp.insertaUn)
router.delete("/hospital/:id", contrInvHosp.eliminaUn)


/* INVENTARI ASEPEYO */
router.get("/asepeyo", contrInvAsep.llistaTots)



module.exports = router;
