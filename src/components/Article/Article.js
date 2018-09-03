import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import './Article.css';

const Article = ({
  session,
  article,
  onRemoveArticle,
  onChange,
  onKeyDown,
  onAddComment,
  onClickLike,
  onClickComment,
  onRemoveComment,
  onClickShare,
  onRouteToArticle,
  onFollowStatus,
  onClickViewMore
}) => {
  const { 
    _id: id, type, writer, title, content, items, folding, openRange, 
    chips, files, likes, comments, comment, commentActive } = article;
  
  const { protocol, host, pathname } = window.location;
  const url = `${protocol}//${host}`;

  const imageFiles = files.map(
    (file, idx) => {
      return (
        <a className="carousel-item" key={idx}>
          <img alt={idx} src={`/images/${file.fileName}`} />
        </a>
      )
    }
  );

  let imageItems;
  let carouselInstance;
  if (files.length > 0) {
    imageItems = (
      <div 
        className="carousel carousel-slider upload-images"
        ref={ ref => carouselInstance = window.M.Carousel.init(ref, {
          fullWidth: true,
          noWrap: true,
          indicators: true,
        }) }
      >
        {imageFiles}
      </div>
    )
  } else {
    imageItems = (<div></div>);
  }

  const index = likes.findIndex( like => like === session._id);
  let favorite;
  if (index > -1) {
    favorite = "favorite";
  } else {
    favorite = "favorite_border";
  }
  
  const chatBubble = commentActive ? 'chat_bubble' : 'chat_bubble_outline';
  
  const commentItems = comments.map(
    ({_id: commentId, writer, content}, idx) => {
      const { nickname, email } = writer;
      const removeItem = email === session.email
        ? (
          <a className="comment-remove-icon" 
            onClick={() => onRemoveComment(id, commentId)}>
            <i className="material-icons light-blue-text text-darken-4">clear</i>
          </a>
          )
        : (<div></div>);
      
      return (
        <div key={idx} className="comment">
          <div className="comment-nickname">
          {`${nickname} `}
          </div>
          &nbsp;
          <div className="comment-content">
          {`${content}`}
          </div>
          {removeItem}
        </div>
      )
    }
  );

  if (typeof writer.profileImage === 'undefined') {
    writer.profileImage = `default-profile.png`;
  }

  const bucketItems = items.map(
    ({_id: id, name, done}, idx) => {
      return (
        <li key={id} className="collection-item bucketlist-item">
          <span className="indigo-text text-darken-4">{idx + 1}.</span> {name} {done ? <i className="material-icons indigo-text">done</i> : null}
        </li>
      )
    }
  );

  const allBucketItems = items.map(
    ({id, name, done}, idx) => {
      
      return (
        <li key={id} className="collection-item bucketlist-item">
          <span className="indigo-text text-darken-4">{idx + 1}.</span> {name}
        </li>
      )
    }
  );

  const viewMore = items.length > 3 
  ? (
      <div className="view-more" onClick={() => onClickViewMore(id)}>
        { folding ? '접기' : '더 보기' }
      </div>
    )
  : ( <div></div> );

  /* 드롭다운리스트 설정 */
  const routeToArticle = pathname.indexOf('/article/') < 0
  ? (<li><Link to={`/article/${id}`} onClick={() => onRouteToArticle(id)}>게시물로 이동</Link></li>) : null; 
  
  const editArticle = session._id === writer._id
  ? (<li><Link to={`/${type}/edit/${id}`}>수정</Link></li>) : null;

  const deleteArticle = session._id === writer._id
  ? (<li><a onClick={() => onRemoveArticle(id)}>삭제</a></li>) : null;

  const cancleFollow = session._id !== writer._id
  ? (<li><a onClick={() => onFollowStatus(id)}>팔로우 취소</a></li>) : null;

  const dropdownList = (
    <ul id={`dropdown-more-${id}`} className='dropdown-content'>
      {routeToArticle}
      {editArticle}
      {deleteArticle}
      <li>
        <CopyToClipboard text={`${url}/article/${id}`}>
          <a onClick={() => window.M.toast({ html: '복사되었습니다'})}>링크 복사하기</a>
        </CopyToClipboard>
      </li>
      <li><a>취소</a></li>
    </ul>
  );
  
  return (
    <article key={id} className="article-wrapper">
      <Link className="writer" to={`${writer.nickname}/bucketlist`}>
        <img 
          className="circle responsive-img"
          src={`/images/profiles/${writer.profileImage}`} 
          alt={writer.nickname} />
        <div className="username">
          <a className="grey-text text-darken-4">{writer.nickname}</a>
        </div> 
        <div 
          className="btn-more dropdown-trigger"
          data-target={`dropdown-more-${id}`}
          ref={
            (ref) => {
              window.M.Dropdown.init(ref, {
                contrainWidth: true
              });
          }}
        >
          <i className="material-icons indigo-text text-darken-4">more_horiz</i>
        </div>
        {/* 드롭다운 리스트 */}
        {dropdownList}
      </Link>
      <div className="info">
        <div className="info-title">
          {title}
        </div>
        <div className="info-content">
          { type === 'bucketlist'
            ? ( 
                <div>
                  <ul className="collection">
                    {folding ? bucketItems : bucketItems.slice(0, 3)}
                  </ul>
                  {viewMore}
                </div>
              )
            : content }
        </div>
        {imageItems}
      </div>
      <footer className="article-footer">
          <i 
            className={`material-icons ${favorite === "favorite" ? 'red-text text-accent-4': ''}`}
            onClick={ () => {
              onClickLike(id);
            }}
          >
            {favorite}
          </i>
          <i 
            className="material-icons"
            onClick={ () => {
              onClickComment(id);
            }}
          >
            {chatBubble}
          </i>

          <div className="footer-flex"></div>
          <i styles={{width: "24px"}}></i>
          <i 
            className="material-icons"
            onClick={ () => {
              onClickShare(id);
            }}
          >
            share
          </i>
      </footer>
      <div className="article-likes">
        {`좋아요 ${likes.length}개`}
      </div>
      <div className="article-comments">
        {commentItems}
      </div>
      <div className={`article-comment-input ${commentActive ? 'active' : ''}`}>
        <input 
          type="text" 
          name="comment"
          className='validate'
          placeholder="댓글 달기..."
          value={comment}
          disabled={!commentActive}
          onChange={(e) => onChange(e, id)}
          onKeyDown={(e) => onKeyDown(e, id)}
        />
        <div className={`btn-flat ${comment === '' ? 'disabled': ''}`}  onClick={() => onAddComment(id)}>
          게시
        </div>
      </div>
    </article>
  )
};

Article.propTypes = {
  session: PropTypes.shape({
    email: PropTypes.string,
    nickname: PropTypes.string
  }),
  articles: PropTypes.shape({
    id: PropTypes.string, 
    type: PropTypes.string, 
    writer: PropTypes.shape({
      nickname: PropTypes.string,
      profileImage: PropTypes.string
    }),
    title: PropTypes.string, 
    content: PropTypes.string, 
    items: PropTypes.array, 
    folding: PropTypes.boolean, 
    openRange: PropTypes.string, 
    chips: PropTypes.array, 
    files: PropTypes.array, 
    likes: PropTypes.array, 
    comments: PropTypes.array, 
    comment: PropTypes.string, 
    commentActive: PropTypes.boolean
  }),  
  onRemoveArticle: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onAddComment: PropTypes.func,
  onClickLike: PropTypes.func,
  onClickComment: PropTypes.func,
  onClickShare: PropTypes.func,
  onRouteToArticle: PropTypes.func,
  onFollowStatus: PropTypes.func,
  onClickViewMore: PropTypes.func,
};

Article.defaultProps = {
  session: {},
  article: {
    id: -1,
    type: 1,
    writer: {
      nickname: '',
      profileImage: 'default-profile.png'
    },
    title: '',
    content: '',
    items: [],
    folding: false,
    openRange: '1',
    chips: [],
    files: [],
    likes: [],
    comments: [],
    comment: '',
    commentActive: false
  },
  onRemoveArticle: () => console.warn('onRemoveArticle not defined'),
  onChange: () => console.warn('onChange not defined'),
  onKeyDown: () => console.warn('onKeyDown not defined'),
  onAddComment: () => console.warn('onAddComment not defined'),
  onClickLike: () => console.warn('onClickLike not defined'),
  onClickComment: () => console.warn('onclickComment not defined'),
  onClickShare: () => console.warn('onClickShare not defined'),
  onRouteToArticle: () => console.warn('onRouteToArticle not defined'),
  onFollowStatus: () => console.warn('onFollowStatus not defined'),
  onClickViewMore: () => console.warn('onClickViewMore not defined')
};

export default Article;