import express from 'express';
import mongoose from 'mongoose';
import Account from '../models/account';
import Article from '../models/article';
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
});

const upload = multer({
  storage: storage 
});

/*
  GET ARTICLE LIST: get /api/articles
  REQUEST BODY: {}
  ERROR CODES: 
    1. 등록된 게시글이 없습니다
*/
router.get('/', (req, res) => {
  Article.find().exec((err, articles) => {
    if (err) throw err;

    if (articles.length < 1) {
      return res.status(404).json({
        code: 1,
        message: '등록 된 게시글이 없습니다'
      });
    }

    return res.json(articles);
  });
});

/*
  GET ARTICLE: GET /api/articles/:id
  REQUEST BODY: {}
  ERROR CODES:
    1. 유효하지 않은 접근입니다
    2. 대상이 존재하지 않습니다
*/
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  Article.findById(mongoose.Types.ObjectId(id)).exec((err, article) => {
    if (err) throw err;

    if (!article) {
      return res.status(404).json({
        code: 2,
        message: '대상이 존재하지 않습니다'
      });
    }

    return res.json(article);
  })
});

/*
  CREATE ARTICLE: POST /api/articles
  REQUEST BODY: {}
  ERROR CODES:
    1. 사용자 정보를 찾을 수 없습니다
    2. 로그인 후 다시 시도 바랍니다
*/
router.post('/', upload.any(), (req, res) => {
  const { type, data } = req.body;

  // session check
  if (typeof req.session.userInfo === 'undefined') {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  const { userInfo } = req.session;

  Account.findOne({email: userInfo.email}, (err, account) => {
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

    let files = [];
    req.files.forEach( reqFile => {
      const file = {
        writer: userInfo.id,
        fileName: reqFile.filename,
        fileSize: reqFile.size,
        fileType: reqFile.mimetype,
        realFileName: reqFile.originalname
      };

      files.push(file);
    });

    File.collection.insert(files, (err, result) => {
      const articleFiles = [];

      if (result) {
        result.ops.forEach( file => {
          articleFiles.push(result._id);
        });
      }

      const article = new Article({
        writer: userInfo._id,
        type: data.type,
        title: data.title,
        content: data.content,
        items: data.items,
        tags: data.tags,
        files: articleFiles,
        dueDate: data.dueDate,
        openRange: data.openRange
      });

      article.save( err => {
        if (err) throw err;

        return res.json(article);
      });
    });
  });
});

/*
  EDIT ARTICLE: PUT /api/articles/:id
  REQUEST BODY: {}
  ERROR CODES:
    1. 유효하지 않은 접근입니다
    2. 사용자 정보를 찾을 수 없습니다
    3. 로그인 후 다시 시도 바랍니다
    4. 대상이 존재하지 않습니다
*/
router.put('/:id', upload.any(), (req, res) => {
  const { id } = req.params;
  const { type, data } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  if (typeof req.session.userInfo === 'undefined') {
    return res.status(401).json({
      error: 2,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  const { userInfo } = req.session;

  Account.findOne({email: userInfo.email}, (err, account) => {
    if (err) throw err;

    if (!account) {
      res.session.destroy( err => {
        if (err) throw err;
      });

      return res.status(403).json({
        code: 3,
        message: '로그인 후 다시 시도 바랍니다'
      });
    }

    Article.findById(mongoose.Types.ObjectId(id), (err, article) => {
      if (err) throw err;

      if (!article) {
        return res.status(404).json({
          code: 4,
          message: '대상이 존재하지 않습니다'
        });
      }

      let files = [];
      req.files.forEach( reqFile => {
        const file = {
          writer: userInfo.id,
          fileName: reqFile.filename,
          fileSize: reqFile.size,
          fileType: reqFile.mimetype,
          realFileName: reqFile.originalname
        };

        files.push(file);
      });

      File.collection.insert(files, (err, result) => {
        if (err) throw err;

        const articleFiles = [];

        if (result) {
          result.ops.forEach( file => {
            articleFiles.push(result._id);
          });
        }

        article.title = data.title;
        article.content = data.content;
        article.items = data.items;
        article.tags = data.tags;
        article.files = articleFiles;
        article.openRange = data.openRange;
        article.dueDate = data.dueDate;
        article.modifed = Date.now();

        article.save( err => {
          if (err) throw err;

          return res.json(article);
        });
      });
    });
  });
});

/*
  DELETE ARTICLE: DELETE /api/articles/:id
  REQUEST BODY: {}
  ERROR CODES:
    1. 유효하지 않은 접근입니다
    2. 사용자 정보를 찾을 수 없습니다
    3. 로그인 후 다시 시도 바랍니다
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  if (typeof req.session.userInfo === 'undefined') {
    return res.status(401).json({
      error: 2,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  const { userInfo } = req.session;

  Account.findOne({email: userInfo.email}, (err, account) => {
    if (err) throw err;

    if (!account) {
      res.session.destroy( err => {
        if (err) throw err;
      });

      return res.status(403).json({
        code: 3,
        message: '로그인 후 다시 시도 바랍니다'
      });
    }

    Article.findByIdRemove(mongoose.Types.ObjectId(id), (err, article) => {
      if (err) throw err;

      return res.json({
        article
      });
    })
  });
});

/*
router.get('/', (req, res) => {
  let articles = [];

  BucketList.find().limit(3).exec((err, bucketlists) => {
    if (err) throw err;
    articles = [].concat(bucketlists);

    Post.find().limit(3).exec((err, posts) => {
      if (err) throw err;
      articles = articles.concat(posts);

      articles.sort((a, b) => {
        return a.created - b.created;
      });
      
      const responseData = articles.map( article => {
        return {
          id: article._id,
          type: article.type, // type(1: bucketlist, 2: post)
          writer: bucketlist.writer,
          title: bucketlist.title,
          content: '',
          items: bucketlist.items,
          openRange: bucketlist.openRange,
          folding: false,
          chips: article.chips,
          files: article.files,
          likes: [],
          comments: [],
          comment: '',
          commentActive: false
        }
      });

      return res.json(articles);
    });
  });
});

router.get('/:type/:id', (req, res) => {
  const { type, id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: "유효하지 않은 접근입니다"
    });
  }

  if (type === "bucketlist") {
    BucketList.findOne({_id: mongoose.Types.ObjectId(id)}).populate('writer').exec((err, bucketlist) => {
      if (err) throw err;

      if (!bucketlist) {
        return res.status(404).json({
          code: 2,
          message: '존재하지 않는 버킷리스트 입니다'
        });
      }

      return res.json({
        id: bucketlist._id,
        type: 1, // type(1: bucketlist, 2: post)
        writer: bucketlist.writer,
        title: bucketlist.title,
        content: '',
        items: bucketlist.items,
        openRange: bucketlist.openRange,
        folding: false,
        chips: [],
        files: [],
        likes: [],
        comments: [],
        comment: '',
        commentActive: false
      });
      
    });
  } else if (type === "post") {
    Post.findOne({_id: mongoose.Types.ObjectId(id)}, (err, post) => {
      if (err) throw err;

      if (!post) {
        return res.status(404).json({
          code: 3,
          message: '존재하지 않는 게시 글 입니다'
        });
      }

      return res.json({
        id: post._id,
        type: 2, // type(1: bucketlist, 2: post)
        writer: post.writer,
        title: post.title,
        content: post.content,
        items: [],
        openRange: post.openRange,
        folding: false,
        chips: post.chips,
        files: [],
        likes: [],
        comments: [],
        comment: '',
        commentActive: false
      })
    });
  }
});
*/

export default router;