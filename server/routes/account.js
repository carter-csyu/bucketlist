import express from 'express';
import mongoose from 'mongoose';
import Account from '../models/account';
import File from '../models/file';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/dev/github/bucketlist/server/uploads/profiles');
  },
  filename: (req, file, cb) => {
    const { _id: id } = req.session.userInfo;
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, id + Date.now() + ext);
  }
});

const upload = multer({
  storage: storage
});

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

router.get('/signout', (req, res) => {
  req.session.destroy( err => {
    if (err) throw err;
  });

  return res.json({
    success: true
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

  if (nickname.length < 2) {
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

router.get('/', (req, res) => {
  if (typeof req.session.userInfo === "undefined") {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  const { userInfo: user } = req.session;

  Account.findById(mongoose.Types.ObjectId(user._id), (err, account) => {
    if (err) throw err;

    if (!account) {
      return res.status(401).json({
        error: 2,
        message: '사용자 정보를 찾을 수 없습니다'
      });
    }

    const session = req.session;
    session.userInfo = {
      _id: account._id,
      email: account.email,
      fullname: account.fullname,
      nickname: account.nickname,
      bio: account.bio,
      profileImage: account.profileImage,
      posts: account.posts,
      bucketlists: account.bucketlists
    };

    return res.json({
      user: session.userInfo
    });
  });
});

router.get('/:nickname', (req, res) => {
  const { nickname } = req.params;

  Account.findOne({nickname}) 
  .select('_id email fullname nickname bio profileImage posts bucketlists')
  .then(account => {
    if (!account) {
      return res.status(404).json({
        code: 1,
        message: '대상이 존재하지 않습니다'
      });
    }

    return res.json(account);
  })
  .catch(err => {
    if (err) throw err;
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { fullname, nickname, bio } = req.body;

  if (typeof req.session.userInfo === 'undefined') {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }
  const { userInfo } = req.session;

  if (userInfo._id !== id) {
    return res.status(400).json({
      error: 2,
      message: '잘못된 접근입니다'
    });
  }

  Account.findById(mongoose.Types.ObjectId(id), (err, account) => {
    if (err) throw err;
    
    if (!account) {
      return res.status(401).json({
        code: 3,
        message: 'ACCOUNT NOT EXISTS'
      });
    }

    account.fullname !== fullname ? account.fullname = fullname : null;
    account.nickname !== nickname ? account.nickname = nickname : null;
    account.bio !== bio ? account.bio = bio : null;

    let session = req.session;
    session.userInfo.fullname = account.fullname,
    session.userInfo.nickname = account.nickname,
    session.userInfo.bio = account.bio,

    account.save( err => {
      if (err) throw err;

      return res.json(session.userInfo);
    })
  });
});

router.post('/profile', upload.any(), (req, res) => {
  // session check
  if (typeof req.session.userInfo === 'undefined') {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  const { userInfo } = req.session;

  const file = {
    writer: mongoose.Types.ObjectId(userInfo._id),
    fileName: req.files[0].filename,
    fileSize: req.files[0].size,
    fileType: req.files[0].mimetype,
    realFileName: req.files[0].originalname
  };

  File.collection.insert(file, (err, result) => {
    if (err) throw err;
    const resultFile = result.ops[0];

    Account.findByIdAndUpdate(mongoose.Types.ObjectId(userInfo._id), {
      profileImage: resultFile.fileName
    }, (err, account) => {
      if (err) throw err;

      if (!account) {
        return res.status(401).json({
          code: 2,
          message: 'ACCOUNT NOT EXISTS'
        });
      }

      let session = req.session;
      session.userInfo.profileImage = resultFile.fileName;

      return res.json(session.userInfo);
    });
  });
});

export default router;