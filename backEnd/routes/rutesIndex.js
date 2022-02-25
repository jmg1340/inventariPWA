const express = require("express");
const router = express.Router();

const contrInvHosp = require("../controllers/controllerInventariHospital")
const contrInvAsep = require("../controllers/controllerInventariAsepeyo")
const contrDadesExt = require("../controllers/controllerDadesExternes")



/* INVENTARI HOSPITAL */

router.get("/hospital", contrInvHosp.llistaTots)
router.get("/hospital/:id", contrInvHosp.llistaUn)
router.put("/hospital/:id", contrInvHosp.actualitzaUn)
router.post("/hospital", contrInvHosp.insertaUn)
router.delete("/hospital/:id", contrInvHosp.eliminaUn)


/* INVENTARI ASEPEYO */
router.get("/asepeyo", contrInvAsep.llistaTots)


/* DADES EXTERNES */
router.get("/dadesExternes/:fitxer", contrDadesExt.llista)
router.get("/eliminarColeccio/:coleccio", contrDadesExt.eliminarColeccio)
router.get("/crearColeccio/:coleccio", contrDadesExt.crearColeccio)


module.exports = router;
