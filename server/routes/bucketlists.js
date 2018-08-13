import express from 'express';
import mongoose from 'mongoose';
import Account from '../models/account';
import BucketList from '../models/bucketlist';

const router = express.Router(); 

/*
  CREATE BUCKETLIST: POST /api/bucketlists/
  REQUEST BODY: { title, items, dueDate, openRange }
  ERROR CODES:
    1. 사용자 정보를 찾을 수 없습니다
    2. 로그인 후 다시 시도 바랍니다
*/
router.post('/', (req, res) => {
  const { title, items, dueDate, openRange } = req.body;
  
  // session check
  if (typeof req.session.userInfo === "undefined") {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  const { userInfo } = req.session;

  // validate check request body

  Account.findOne({ email: userInfo.email}, (err, account) => {
    if (err) throw err;

    if (!account) {
      req.session.destroy( destroyErr => {
        if (destroyErr) throw destroyErr;
      });
      
      return res.status(403).json({
        code: 2,
        message: "로그인 후 다시 시도 바랍니다",
      });
    }

    const bucketlist = new BucketList({
      writer: {
        _id: account._id,
      },
      title,
      items,
      dueDate,
      openRange
    });

    bucketlist.save( saveErr => {
      if (saveErr) throw saveErr;

      return res.json({
        success: true
      });
    });
  });
});

/*
  EDIT BUCKETLIST: PUT /api/bucketlists/:id
  REQUEST BODY: { id, title, items, dueDate, openRange }
  ERROR CODES:
    1. 유효하지 않은 접근입니다
    2. 존재하지 않는 버킷리스트 입니다
*/
router.put('/:id', (req, res) => {
  const { title, items, dueDate, openRange } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  BucketList.findOne( { _id: mongoose.Types.ObjectId(id)}, (err, bucketlist) => {
    if (err) throw err;

    if (!bucketlist) {
      return res.status(416).json({
        code: 2,
        message: '존재하지 않는 버킷리스트 입니다'
      });
    }
    
    bucketlist.title = title;
    bucketlist.items = items;
    bucketlist.dueDate = dueDate,
    bucketlist.openRange = openRange; 
    bucketlist.modified = new Date();

    bucketlist.save( saveErr => {
      if (saveErr) throw saveErr;

      return res.json({
        success: true
      });
    });
  });
});

/*
  EDIT BUCKETLIST: GET api/bucketlists/:id
  REQUEST BODY: {}
  ERROR CODES:
    1. 유효하지 않은 접근입니다
    2. 존재하지 않는 버킷리스트 입니다
*/
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: "유효하지 않은 접근입니다"
    });
  }

  BucketList.findOne({ _id: mongoose.Types.ObjectId(id) }, (err, bucketlist) => {
    if (err) {
      throw err
    };

    if (!bucketlist) {
      return res.status(416).json({
        code: 2,
        message: "존재하지 않는 버킷리스트 입니다"
      });
    }

    return res.json(bucketlist);
  })
});

/*
  GET POSTS: GET /bucketlists/
  REQUEST BODY: {}
  ERROR CODES:
    1. 사용자 정보를 찾을 수 없습니다
    2. 로그인 후 다시 시도 바랍니다
    3. 등록된 버킷리스트가 없습니다
*/
router.get('/', (req, res) => {
  
  // session check
  if (typeof req.session.userInfo === "undefined") {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  const { userInfo } = req.session;

  // validate check request body

  Account.findOne({ email: userInfo.email}, (err, account) => {
    if (err) throw err;

    if (!account) {
      req.session.destroy( destroyErr => {
        if (destroyErr) throw destroyErr;
      });
      
      return res.status(403).json({
        code: 2,
        message: "로그인 후 다시 시도 바랍니다",
      });
    }

    BucketList.find({
      writer: {
        _id: mongoose.Types.ObjectId(account._id)
      }
    }, (err, bucketlist) => {
      if (err) throw err;
  
      if (!bucketlist) {
        return res.status(416).json({
          code: 1,
          message: '등록된 버킷리스트가 없습니다'
        });
      }
  
      return res.json(bucketlist);
    });
  });
})

export default router;