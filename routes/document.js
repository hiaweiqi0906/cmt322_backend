const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController')
const {requireAuth} = require('../middlewares/authMiddleware')

router.get('/', requireAuth, documentController.listDoc) // get list of documents
router.get('/:id', requireAuth, documentController.readDoc) // get only selected document
router.post('/', requireAuth, documentController.createDoc) // upload new document
router.put('/:id', requireAuth, documentController.updateDoc) // edit selected document
router.delete('/:id', requireAuth, documentController.deleteDoc) // delete a document

module.exports = router;