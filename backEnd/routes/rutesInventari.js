const express = require("express");
const router = express.Router();

const modelInv = require('../models/modelInventari')

// llistat de tots els documents
router.get("/", async (req, res) => {
    // res.send("L'API de l'inventari va aqui");
    const resultatInv = await modelInv.find()
    res.json(resultatInv)
});

// llista un sol document
router.get("/:id", async (req, res) => {
    const resultatInv = await modelInv.findById(req.params.id)
    res.json(resultatInv)
});

// inserta nou document
router.post("/", async (req, res) => {
    const nouDocument = new modelInv(req.body)
    await nouDocument.save()
    res.json({status: "S'ha insertit nou document"})
});

// actualitza un document
router.put("/:id", async (req, res) => {
    const resultatInv = await modelInv.findByIdAndUpdate(req.params.id, req.body)
    res.json({status: "S'ha actualitzat document"})
});

// actualitza un document
router.delete("/:id", async (req, res) => {
    const resultatInv = await modelInv.findByIdAndRemove(req.params.id)
    res.json({status: "S'ha eliminat document"})
});




module.exports = router;
