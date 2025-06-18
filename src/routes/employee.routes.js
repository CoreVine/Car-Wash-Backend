const { Router } = require("express");
const employeeController = require("../controllers/employee.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isCompanyMiddleware = require("../middlewares/isCompany.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");

// Define validation schema
const employeeSchema = Yup.object().shape({
  name: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required(),
  phone_number: Yup.string().required(),
  address: Yup.string().required(),
  role: Yup.string().oneOf(["super-admin", "manager", "employee"]).required(),
});

const companyIdParamSchema = Yup.object().shape({
  companyId: Yup.number().integer().positive().required(),
});

const employeeRoutes = Router();

// Removing /api prefix since it's added globally
employeeRoutes.post(
  "/companies/:companyId/employees",
  authMiddleware,
  isCompanyMiddleware,
  validate({
    body: employeeSchema,
    params: companyIdParamSchema,
  }),
  employeeController.addEmployee
);
employeeRoutes.put(
  "/companies/:companyId/employees", 
  authMiddleware, 
  isCompanyMiddleware, 
  validate({
    body: employeeSchema,
    params: companyIdParamSchema
  }),
  employeeController.updateEmployee
);

employeeRoutes.get(
  "/companies/:companyId/employees",
  authMiddleware,
  validate(companyIdParamSchema, "params"),
  employeeController.getEmployees
);

employeeRoutes.delete(
  "/companies/:companyId/employees/:employeeId",
  authMiddleware,
  isCompanyMiddleware,
  validate({
    params: {
      companyId: Yup.number().integer().positive().required(),
      employeeId: Yup.number().integer().positive().required(),
    },
  }),
  employeeController.deleteEmployee
);

module.exports = employeeRoutes;
