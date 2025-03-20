import express from 'express';
import { CreateUser, UpdateUser } from '../controllers/UserController.js';  
import {requireAuth } from '@clerk/express'
export const UserRoute = express.Router();

UserRoute.post('/create', CreateUser);
UserRoute.get('/update/:uid',requireAuth(),UpdateUser)
