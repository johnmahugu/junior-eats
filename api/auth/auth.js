const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Load input validation
const validateRegisterInput = require("../../../helpers/validation/register");
const validateLoginInput = require("../../../helpers/validation/login");