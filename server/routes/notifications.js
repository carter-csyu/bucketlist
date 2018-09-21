import express from 'express';
import mongoose from 'mongoose';
import Account from '../models/account';
import Article from '../models/article';
import Notification from '../models/Notification';

const router = express.Router();

router.get('/', (req, res) => {
  let { read } = req.query;
  let conditions = {};

  read !== undefined && (conditions.read = read);

  // session check
  if (typeof req.session.userInfo === 'undefined') {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  const { userInfo } = req.session;

  Account.findById(mongoose.Types.ObjectId(userInfo._id), (err, account) => {
    if (err) throw err;
 
    if (!account) {
      res.session.destroy( err => {
        if (err) throw err;
      });

      return res.status(403).json({
        error: 2,
        message: '로그인 후 다시 시도 바랍니다'
      });
    }

    conditions.to = mongoose.Types.ObjectId(account._id);

    Notification.find(conditions)
    .populate({ path: 'from', select: 'profileImage fullname nickname'})
    .sort({created: -1})
    .exec((err, result) => {
      if (err) throw err;

      if (!result) {
        return res.status(404).json({
          code: 3,
          message: '알림이 없습니다'
        });
      }

      return res.json(result);
    })
  })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  // session check
  if (typeof req.session.userInfo === 'undefined') {
    return res.status(401).json({
      error: 2,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  Notification.findById(mongoose.Types.ObjectId(id))
  .populate({ path: 'from', select: 'profileImage fullname nickname'})
  .sort({created: -1})
  .exec((err, result) => {
    if (err) throw err;

    if (!result) {
      return res.status(404).json({
        code: 3,
        message: '알림이 없습니다'
      });
    }

    result.read = true;
    result.save( err => {
      if (err) throw err;

      return res.json(result);
    });
  })
});

export default router;