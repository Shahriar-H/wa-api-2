const { Router } = require('express');
const { addMultipleNumbers, addNumbers, addUser, checkScedule, deleteNumber, deleteschedule, getanuser, getHistory, getImages, getNumbers, insertHistory, makeScadual, updateUser,deleteImage, addSectors, getSectors, deleteItem, addItems, getItems, updateItem, saveMessage, getConverSation, updateMessageStatus, getItemsFromCrm, updateItemCrm } = require('../services/dbServices.js');

const routes = Router()

routes.post('/add-phone',addNumbers)
routes.post('/add-multiple-phone',addMultipleNumbers)
routes.post('/numbers',getNumbers)
routes.post('/history',getHistory)
routes.post('/delete-number',deleteNumber)
routes.post('/create-schedule',makeScadual)
routes.post('/check-schedule',checkScedule)
routes.post('/delete-schedule',deleteschedule)
routes.post('/insert-history',insertHistory)
routes.post('/add-user',addUser)
routes.post('/update-user',updateUser)
routes.post('/find-user',getanuser)
routes.post('/images-are',getImages)
routes.post('/delete-image',deleteImage)
routes.post('/addsector',addSectors)
routes.post('/getsector',getSectors)
routes.post('/delete-item',deleteItem)
routes.post('/add-item',addItems)
routes.post('/get-item',getItems)
routes.post('/get-itemcrm',getItemsFromCrm)
routes.post('/update-item',updateItem)
routes.post('/update-itemerm',updateItemCrm)
routes.post('/saveMessage',saveMessage)
routes.post('/getconversations',getConverSation)
routes.post('/updatemessage',updateMessageStatus)

module.exports= routes;