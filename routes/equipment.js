import express from 'express'
import _ from 'lodash'
import {helloWorld, getAllEquipments, getEquipmentById, createEquipment} from '../controllers/equipmentController.js'

const router  = express.Router(); 

router.get('/equipment', helloWorld);

router.get('/equipment/search', getAllEquipments);
router.get('/equipment/:equipmentNumber', getEquipmentById)
router.post('/equipment', createEquipment)


export default router