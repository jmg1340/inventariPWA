const express = require("express");
const router = express.Router();

const contrInvHosp = require("../controllers/controllerInventariHospital")
const contrInvAsep = require("../controllers/controllerInventariAsepeyo")
const contrDadesES = require("../controllers/controllerDadesElasticSearch")
const contrDadesTelf = require("../controllers/controllerDadesTelefons")



/* INVENTARI HOSPITAL */

router.get("/hospital", contrInvHosp.llistaTots)
router.get("/hospital/:id", contrInvHosp.llistaUn)
router.put("/hospital/:id", contrInvHosp.actualitzaUn)
router.post("/hospital", contrInvHosp.insertaUn)
router.delete("/hospital/:id", contrInvHosp.eliminaUn)


/* INVENTARI ASEPEYO */
router.get("/asepeyo", contrInvAsep.llistaTots)


/* pujar / eliminar / importar un fitxer al servidor */
router.post("/upload", contrDadesES.pujarFitxer)
router.get("/eliminarFitxerCSV/:fitxer", contrDadesES.eliminarFitxerCSV)
router.get("/importarDadesFitxer/:fitxer", contrDadesES.importar)   // importa el contingut del fitxer


/* DADES ELASTIC SEARCH */

router.delete("/eliminarRegistresES", contrDadesES.eliminarRegistresES)
router.post("/inserirRegistresES", contrDadesES.inserirRegistresES)
router.get("/llistarRegistresES", contrDadesES.llistaTots)


/* DADES TELEFONS */
router.delete("/eliminarRegistresTelefons/:model", contrDadesTelf.eliminarRegistresTelefons)
router.post("/inserirRegistresTelefons", contrDadesTelf.inserirRegistresTelefons)
router.get("/llistarRegistresTelefons", contrDadesTelf.llistaTots)


module.exports = router;
