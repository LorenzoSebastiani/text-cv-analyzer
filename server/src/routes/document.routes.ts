import { Router } from "express";
import multer from 'multer'
import { getDocumentById, getDocuments, uploadDocument } from "../controllers/document.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', upload.single('document'), uploadDocument)
router.get('/documents', getDocuments)
router.get('/documents/:id', getDocumentById)

export default router;