import express from 'express';
import mongoose from 'mongoose';
import Account from '../models/account';
import Post from '../models/post';
import File from '../models/file';
import multer from 'multer';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/dev/github/bucketlist/server/uploads');
  },
  filename: (req, file, cb) => {
    const rs = Math.random().toString(36).slice(2, 10);
    cb(null, rs + '-' + Date.now());
  }
})
const upload = multer({
  storage: storage 
});

/*
  CREATE POST: POST /api/posts/
  REQUEST BODY: { title, content, tags, files, openRange }
  ERROR CODES:
    1. 사용자 정보를 찾을 수 없습니다
    2. 로그인 후 다시 시도 바랍니다
*/
router.post('/', upload.any(), (req, res) => {
  const { title, content, tags, openRange } = req.body;

  // session check
  if (typeof req.session.userInfo === "undefined") {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  const { userInfo } = req.session;

  // validate check request body

  Account.findOne({ email: userInfo.email }, (err, account) => {
    if (err) throw err;

    if (!account) {
      req.session.destroy( destroyErr => {
        if (destroyErr) throw destroyErr;
      });

      return res.status(403).json({
        code: 2,
        message: '로그인 후 다시 시도 바랍니다'
      });
    }

    let docFiles = [];
    req.files.forEach( fileItem => {
      const docFile = {
        writer: {
          _id: userInfo._id
        },
        fileName: fileItem.filename,
        fileSize: fileItem.size,
        fileType: fileItem.mimetype,
        realFileName: fileItem.originalname
      };

      docFiles.push(docFile);
    });

    File.collection.insert(docFiles, (err, files) => {
      const postFiles = [];
      
      if (files) {
        files.ops.forEach( file => {
          postFiles.push({
            _id: file._id
          });
        });
      }

      const post = new Post({
        writer: {
          _id: account._id
        },
        title,
        content,
        tags: tags.split(","),
        files: postFiles,
        openRange
      });
  
      post.save( saveErr => {
        if (saveErr) throw saveErr;
  
        return res.json({
          success: true
        });
      });
    });
  });
 });

 /*
  EDIT POST: PUT /api/posts/:id
  REQUEST BODY: { id, title, content, tags, files, openRange }
  ERROR CODES:
    1. 유효하지 않은 접근입니다
    2. 사용자 정보를 찾을 수 없습니다
    3. 존재하지 않는 글 입니다
 */
router.put('/:id', (req, res) => {
  const { title, content, tags, files, openRange } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  // session check
  if (typeof req.session.userInfo === "undefined") {
    return res.status(401).json({
      error: 2,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  Post.findOne( { _id: mongoose.Types.ObjectId(id) }, (err, post) => {
    if (err) throw err;

    if (!post) {
      return res.status(416).json({
        code: 3,
        message: '존재하지 않는 글 입니다'
      });
    }

    post.title = title;
    post.content = content;
    post.tags = tags;
    post.openRange = openRange;
    post.modified = new Date();

    post.save( saveErr => {
      if (saveErr) throw saveErr;

      return res.json({
        success: true
      });
    });
  });
});

/*
  GET POST: GET /api/posts/:id
  REQUEST BODY: {}
  ERROR CODES:
    1. 유효하지 않은 접근입니다
    2. 사용자 정보를 찾을 수 없습니다
    2. 존재하지 않는 버킷리스트 입니다
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  /*
  // session check
  if (typeof req.session.userInfo === "undefined") {
    return res.status(401).json({
      error: 2,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }
  */


  Post.findOne({_id: mongoose.Types.ObjectId(id)}).populate('files').exec((err, post) => {
    if (err) throw err;

    if (!post) {
      return res.status(416).json({
        code: 3,
        message: '존재하지 않는 버킷리스트 입니다'
      });
    }

    return res.json(post);
  });
});

/*
  GET POSTS: GET /api/posts
  REQUEST BODY: {}
  ERROR CODES:
    1. 사용자 정보를 찾을 수 없습니다
    2. 로그인 후 다시 시도 바랍니다
    3. 등록된 게시글이 없습니다
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

  Account.findOne({ email: userInfo.email }, (err, account) => {
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

    Post.find({
      writer: {
        _id: mongoose.Types.ObjectId(account._id)
      }
    }, (err, post) => {
      if (err) throw err;
  
      if (!post) {
        return res.status(416).json({
          code: 3,
          message: '등록된 게시글이 없습니다'
        });
      }
  
      return res.json(post);
    });
  });
})

/*
  DELETE POST: DELETE /api/posts/:id
  REQUEST BODY: {}
  ERROR CODES: 
    1. 유효하지 않는 접근입니다
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  Post.deleteOne( { _id: mongoose.Types.ObjectId(id) }, (err, post) => {
    if (err) throw err;

    return res.json({
      success: true
    });
  });
});

export default router;