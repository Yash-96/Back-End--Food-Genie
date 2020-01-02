const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Promos = require('../models/promotions');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get((req,res,next) => {
    Promos.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.create(req.body)
  .then((promotion) => {
      console.log('promotion Created ', promotion);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.remove({})
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

promotionRouter.route('/:promotionId')
.get((req,res,next) => {
  Promos.findById(req.params.promotionId)
  .then((promotion) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
  }, (err) => next(err))
  .catch((err) => next(err));
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promotionId);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.findByIdAndUpdate(req.params.promotionId, {
      $set: req.body
  }, { new: true })
  .then((promotion) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
  }, (err) => next(err))
  .catch((err) => next(err));
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.findByIdAndRemove(req.params.promotionId)
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = promotionRouter;
