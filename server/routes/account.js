import express from 'express';
import mongoose from 'mongoose';
import Account from '../models/account';

const router = express.Router();

/*
  ACCOUNT SIGNIN: POST /auth/signin
  REQUEST BODY: { email, password }
  ERROR CODES:
    1. ACCOUNT NOT EXISTS
    2. WRONG PASSWORD
*/
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  Account.findOne({ $and: [{email}, {deprecated: {$exists: false}}]}, (err, account) => {
    if (err) throw err;
    
    if (!account) {
      return res.status(401).json({
        code: 1,
        message: 'ACCOUNT NOT EXISTS'
      });
    }

    if (!account.validateHash(password)) {
      return res.status(401).json({
        code: 2,
        message: 'WRONG PASSWORD'
      });
    }

    let session = req.session;
    session.userInfo = {
      _id: account._id,
      email: account.email,
      fullname: account.fullname,
      nickname: account.nickname,
      bio: account.bio,
      profileImage: account.profileImage
    };

    return res.json({
      success: true,
      info: session.userInfo
    });

  });

});

/*
  ACCOUNT SIGNUP: POST /auth/signup
  REQUEST BODY: { email, password, nickname }
  ERROR CODES:
    1: EMAIL FORMAT ERROR
    2: BAD PASSWORD
    3: EXISTING EMAIL ADDRESS
*/
router.post('/signup', (req, res) => {
  const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const { email, password, nickname} = req.body;

  if (re.exec(email) === null) {
    return res.status(400).json({
      code: 1,
      message: "EMAIL FORMAT ERROR"
    });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      code: 2,
      message: "BAD PASSWORD"
    });
  }

  Account.findOne({email}, (err, exists) => {
    if (err) throw err;
    if (exists) {
      return res.status(400).json({
        code: 3,
        message: "EXISTING EMAIL ADDRESS"
      });
    }

    // create account
    let account = new Account({
      email,
      password,
      nickname
    });

    account.password = account.generateHash(account.password);

    // save in the database
    account.save( err => {
      if (err) throw err;
      return res.json({
        success: true
      });
    })
  });
});

/*
  ACCOUNT CHECK_NICKNAME: POST /auth/checkNickname
  REQUEST BODY: { nickname }
  ERROR CODES:
    1: INVALID NICKNAME
    2: DUPLICATED NICKNAME
*/
router.post('/checkNickname', (req, res) => {
  const { nickname } = req.body;

  if (nickname.length < 4) {
    return res.status(400).json({
      code: 1,
      message: "INVALID NICKNAME"
    });
  }

  Account.findOne({nickname}, (err, exists) => {
    if (err) throw err;
    if (exists) {
      return res.status(400).json({
        code: 2,
        message: "DUPLICATED NICKNAME"
      });
    } else {
      return res.json({
        success: true
      });
    }
  });
});

/*
  ACCOUNT CHECK_NICKNAME: GET /auth/getUserinfo
  REQUEST BODY: { }
  ERROR CODES:
    1: 사용자 정보를 찾을 수 없습니다
*/
router.get('/getUserinfo', (req, res) => {
  if (typeof req.session.userInfo === "undefined") {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  return res.json({
    user: req.session.userInfo
  });
});

export default router;