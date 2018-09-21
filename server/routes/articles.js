import express from 'express';
import mongoose from 'mongoose';
import Account from '../models/account';
import Article from '../models/article';
import File from '../models/file';
import Comment from '../models/comment';
import Notification from '../models/Notification';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/dev/github/bucketlist/server/uploads');
  },
  filename: (req, file, cb) => {
    const rs = Math.random().toString(36).slice(2, 10);
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, rs + '-' + Date.now() + ext);
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
  let { user, search, openRange, type, page } = req.query;
  let conditions = {};

  user !== undefined ? conditions.writer = user : null;
  search !== undefined ? conditions.tags = { $in: [new RegExp(search, 'i')]} : null;
  openRange !== undefined ? conditions.openRange = openRange : null;
  type !== undefined ? conditions.type = type : null;

  Article.find(conditions).sort({"created": -1}).skip((Number(page)-1)*5).limit(5)
  .populate('files')
  .populate({ path: 'writer', select: 'profileImage fullname nickname'})
  .populate({ path: 'comments', populate: { path: 'writer', select: 'nickname email'}})
  .exec((err, articles) => {
    if (err) throw err;

    if (articles.length < 1) {
      return res.status(404).json({
        code: 1,
        message: '등록 된 게시글이 없습니다'
      });
    }

    const viewArticles = articles.map( (article) => {
      return Object.assign({
        folding: false,
        comment: '',
        commentActive: false
      }, article._doc);
    });
    return res.json(viewArticles);
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

  Article.findById(mongoose.Types.ObjectId(id))
  .populate('files')
  .populate({ path: 'writer', select: 'profileImage fullname nickname'})
  .populate({ path: 'comments', populate: { path: 'writer', select: 'nickname email'}})
  .exec((err, article) => {
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
    3. 알 수 없는 요청 입니다 
*/
router.post('/', upload.any(), (req, res) => {
  const { type, title, content, items, tags,
          dueDate, openRange } = req.body;

  // session check
  if (typeof req.session.userInfo === 'undefined') {
    return res.status(401).json({
      error: 1,
      message: '사용자 정보를 찾을 수 없습니다'
    });
  }

  if ( type !== 'post' && type !== 'bucketlist') {
    return res.status(404).json({
      error: 3,
      message: '알 수 없는 요청 입니다'
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
        writer: mongoose.Types.ObjectId(userInfo._id),
        fileName: reqFile.filename,
        fileSize: reqFile.size,
        fileType: reqFile.mimetype,
        realFileName: reqFile.originalname
      };

      files.push(file);
    });

    File.collection.insert(files, (err, result) => {
      let articleFiles = [];

      if (result) {
        result.ops.forEach( file => {
          articleFiles.push(mongoose.Types.ObjectId(file._id));
        });
      }

      let article = new Article({
        writer: userInfo._id,
        type: type,
        title: title,
        openRange: openRange
      });

      if (type === 'post') {
        article.content = content;
        article.tags = tags.split(",");
        article.files = articleFiles;
      } else if (type === 'bucketlist') {
        article.items = JSON.parse(items).map(item => ({
          name: item.name,
          done: item.done
        }));
        article.tags = JSON.parse(items).map(item => (item.name));
        article.dueDate = dueDate;
      }

      article.save( (err, result) => {
        if (err) throw err;

        console.log(result);

        if (type == 'post') {
          account.posts = [
            ...account.posts,
            result._id 
          ];
        } else if (type === 'bucketlist') {
          account.bucketlists = [
            ...account.bucketlists,
            result._id
          ];
        }

        account.save( err => {
          if (err) throw err;

          return res.json(article);
        });
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
  const { type, title, content, items, tags,
    dueDate, openRange } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  if ( type !== 'post' && type !== 'bucketlist') {
    return res.status(404).json({
      error: 3,
      message: '알 수 없는 요청 입니다'
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
          writer: mongoose.Types.ObjectId(userInfo._id),
          fileName: reqFile.filename,
          fileSize: reqFile.size,
          fileType: reqFile.mimetype,
          realFileName: reqFile.originalname
        };

        files.push(file);
      });

      if (files.length > 0) {
        File.collection.insert(files, (err, result) => {
          if (err) throw err;
  
          let articleFiles = [];
  
          if (result) {
            result.ops.forEach( file => {
              articleFiles.push(mongoose.Types.ObjectId(file._id));
            });
          }
  
          article.title = title;
          article.openRange = openRange;
          if (type === 'post') {
            article.content = content;
            article.tags = tags.split(",");
            article.files = articleFiles;
          } else if (type === 'bucketlist') {
            article.items = JSON.parse(items);
            article.dueDate = dueDate;
          }
          article.modified = Date.now();
  
          article.save( err => {
            if (err) throw err;
  
            return res.json(article);
          });
        });
      } else {
        article.title = title;
        article.openRange = openRange;
        if (type === 'post') {
          article.content = content;
          article.tags = tags.split(",");
          article.files = articleFiles;
        } else if (type === 'bucketlist') {
          article.items = JSON.parse(items);
          article.dueDate = dueDate;
        }
        article.modified = Date.now();

        article.save( err => {
          if (err) throw err;

          return res.json(article);
        });
      }
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

    Article.findByIdAndRemove(mongoose.Types.ObjectId(id), (err, article) => {
      if (err) throw err;

      if (article.type === 'post') {
        account.posts = account.posts.filter( item => item.toString() !== id );
      } else if (article.type === 'bucketlist') {
        account.bucketlists = account.bucketlists.filter( item => item.toString() !== id);
      }

      account.save( err => {
        if (err) throw err;
        
        return res.json(article);
      });
    })
  });
});

router.post('/:id/likes', (req, res) => {
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

    Article.findById(mongoose.Types.ObjectId(id))
    .populate('files')
    .populate({ path: 'writer', select: 'profileImage fullname nickname'})
    .populate({ path: 'comments', populate: { path: 'writer', select: 'nickname email'}})
    .exec((err, article) => {
      if (err) throw err;

      if (!article) {
        return res.status(404).json({
          code: 2,
          message: '대상이 존재하지 않습니다'
        });
      }

      if (article.likes.indexOf(mongoose.Types.ObjectId(account._id)) > -1) {
        article.likes = article.likes.filter( like => {
          return JSON.stringify(like) !== JSON.stringify(account._id);
        });
      } else {
        article.likes = [
          ...article.likes,
          mongoose.Types.ObjectId(account._id)
        ];
      } 

      article.save( err => {
        if (err) throw err;

        // 남의 글에 좋아요를 누를 경우 게시자에게 알림 전달
        if (JSON.stringify(account._id) !== JSON.stringify(article.writer._id)) {

          Notifications.find({
            type: 'like',
            article: mongoose.Types.ObjectId(article._id)
          }).count().then(
            count => {
              if (count < 1 ) {
                let notification = new Notification({
                  from: account._id,
                  to: article.writer._id,
                  type: 'like',
                  article: article._id
                });
      
                notification.save( err => {
                  if (err) throw err;
                });
              }
            }
          )
        }

        return res.json(article);
      })
    });
  });
});

router.delete('/:id/comments/:commentId', (req, res) => {
  const { id, commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(416).json({
      code: 1,
      message: '유효하지 않은 접근입니다'
    });
  }

  if (typeof req.session.userInfo === 'undefined') {
    return res.status(401).json({
      code: 2,
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

    Comment.findByIdAndRemove(mongoose.Types.ObjectId(commentId), (err) => {
       if (err) throw err; 

       Article.findById(mongoose.Types.ObjectId(id))
      .populate('files')
      .populate({ path: 'writer', select: 'profileImage fullname, nickname'})
      .populate({ path: 'comments', populate: { path: 'writer', select: 'nickname email'}})
      .exec((err, article) => {
        if (err) throw err;

        if (!article) {
          return res.status(404).json({
            code: 2,
            message: '대상이 존재하지 않습니다'
          });
        }

        return res.json(article);
      });
    });
  });
});

router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

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

    Article.findById(mongoose.Types.ObjectId(id))
    .populate('files')
    .populate({ path: 'writer', select: 'profileImage fullname nickname'})
    .populate({ path: 'comments', populate: { path: 'writer', select: 'nickname email'}})
    .exec((err, article) => {
      if (err) throw err;

      if (!article) {
        return res.status(404).json({
          code: 2,
          message: '대상이 존재하지 않습니다'
        });
      }

      let comment = new Comment({ 
        article: mongoose.Types.ObjectId(article._id),
        writer: mongoose.Types.ObjectId(account._id),
        content: content
      });

      comment.save( (err, result) => {
        if (err) throw err;

        result.populate({ path: 'writer', select: 'nickname email' }).execPopulate()
        .then(() => {
          article.comments = [
            ...article.comments,
            result
          ];
  
          article.save( err => {
            if (err) throw err;

            // 남의 글에 좋아요를 누를 경우 게시자에게 알림 전달
            if (JSON.stringify(account._id) !== JSON.stringify(article.writer._id)) {

              Notifications.find({
                type: 'comment',
                article: mongoose.Types.ObjectId(article._id),
                read: false
              }).count().then(
                count => {
                  if (count < 1 ) {
                    let notification = new Notification({
                      from: account._id,
                      to: article.writer._id,
                      type: 'comment',
                      article: article._id
                    });
          
                    notification.save( err => {
                      if (err) throw err;
                    });
                  }
                }
              )
            }

            return res.json(article);
          });
        });
      });
    });
  });
});

export default router;