const { Router } = require("express");
const companyController = require("../controllers/company.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");
const { createUploader } = require("../config/multer.config");
const isCompanyMiddleware = require("../middlewares/isCompany.middleware");
const multerErrorHandler = require("../middlewares/multerErrorHandler.middleware");

// Define validation schemas
const companyUpdateSchema = Yup.object().shape({
  company_name: Yup.string(),
  email: Yup.string().email(),
  phone_number: Yup.string(),
  location: Yup.string(),
  logo_url: Yup.string(),
});

const companyIdParamSchema = Yup.object().shape({
  companyId: Yup.number().integer().positive().required(),
});

const documentUploadSchema = {
  params: Yup.object().shape({
    companyId: Yup.number().integer().positive().required(),
  }),
  body: Yup.object().shape({
    document_type: Yup.string().required(),
  }),
};

// Configure uploader for company documents
const documentUploader = createUploader({
  storageType: process.env.STORAGE_TYPE || "cloudinary",
  uploadPath: "uploads/company-documents",
  fileFilter: "documents",
  fileSize: 5 * 1024 * 1024, // 5MB limit
  fileNamePrefix: "doc",
});

const companyRoutes = Router();

companyRoutes.get("/companies", companyController.getAllCompanies);

companyRoutes.get(
  "/companies/:companyId",
  authMiddleware,
  // isAdminMiddleware,
  validate(companyIdParamSchema, "params"),
  companyController.getCompany
);

// Update the route path to follow the naming pattern
companyRoutes.get(
  "/companies/:companyId/with-wash-types",
  validate(companyIdParamSchema, "params"),
  companyController.getCompanyWithWashTypes
);

companyRoutes.put(
  "/companies/:companyId",
  authMiddleware,
  isAdminMiddleware,
  validate({
    body: companyUpdateSchema,
    params: companyIdParamSchema,
  }),
  companyController.updateCompany
);

companyRoutes.put(
  "/companies/:companyId/approve",
  authMiddleware,
  isAdminMiddleware,
  validate(companyIdParamSchema, "params"),
  companyController.approveCompany
);

companyRoutes.post(
  "/companies/:companyId/documents",
  authMiddleware,
  isCompanyMiddleware,
  ...(Array.isArray(documentUploader.single("document"))
    ? documentUploader.single("document")
    : [documentUploader.single("document")]),
  multerErrorHandler,
  validate(documentUploadSchema),
  companyController.uploadDocument
);

companyRoutes.get(
  "/companies/:companyId/documents",
  authMiddleware,
  // isCompanyMiddleware,
  validate(companyIdParamSchema, "params"),
  companyController.getDocuments
);

module.exports = companyRoutes;
