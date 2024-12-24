const {createColab, addContributor, getColab} = require('../controllers/colab.controllers.js');
const express = require('express');

const router = express.Router();

router.post('/createColab', async (req, res) => {
    const colab = await createColab(req.body);
    res.send(colab);
});

router.post('/addContributor', async (req, res) => {
    const colab = await addContributor(req.body);
    res.send(colab);
});

router.get('/getColab/:sessionId', async (req, res) => {
    const colab = await getColab(req.params.sessionId);
    res.send(colab);
});

module.exports = router;