import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Article.css';

const Article = ({
  session,
  article,
  onChange,
  onKeyDown,
  onAddComment,
  onClickLike,
  onClickComment,
  onRemoveComment,
  onClickShare,
  onRouteToArticle,
  onCopyLink,
  onFollowStatus,
  onClickViewMore
}) => {
  const { 
    id, type, writer, title, content, items, folding, openRange, 
    chips, files, likes, comments, comment, commentActive } = article;

  const imageFiles = files.map(
    (file, idx) => {
      return (
        <a className="carousel-item" key={idx}>
          <img alt={idx} src={file.src} />
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

  const index = likes.findIndex( like => like.email === session.email);
  let favorite;
  if (index > -1) {
    favorite = "favorite";
  } else {
    favorite = "favorite_border";
  }
  
  const chatBubble = commentActive ? 'chat_bubble' : 'chat_bubble_outline';
  
  const commentItems = comments.map(
    ({id: commentId, email, nickname, content}, idx) => {
      
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

  const bucketItems = items.map(
    ({id, name, done}, idx) => {
      return (
        <li key={id} className="collection-item bucketlist-item">
          <span className="indigo-text text-darken-4">{idx + 1}.</span> {name}
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
  
  return (
    <article key={id} className="article-wrapper">
      <header className="writer">
        <img 
          className="circle responsive-img"
          src={writer.profileImage} 
          alt={writer.name} />
        <div className="username">
          <a className="grey-text text-darken-4">{writer.name}</a>
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
          <i className="material-icons">more_horiz</i>
        </div>

        <ul id={`dropdown-more-${id}`} className='dropdown-content'>
          <li><Link to={`/post/${id}`} onClick={() => onRouteToArticle(id)}>게시물로 이동</Link></li>
          <li><a onClick={() => onCopyLink(id)}>링크 복사하기</a></li>
          <li><a onClick={() => onFollowStatus(id)}>팔로우 취소</a></li>
          <li><a>취소</a></li>
        </ul>
      </header>
      <div className="info">
        <div className="info-title">
          {title}
        </div>
        <div className="info-content">
          { type === 1 
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
          className="validate" 
          placeholder="댓글 달기..."
          value={comment}
          disabled={!commentActive}
          onChange={(e) => onChange(e, id)}
          onKeyDown={(e) => onKeyDown(e, id)}
        />
        <div className="btn-flat" onClick={() => onAddComment(id)}>
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
      name: PropTypes.string,
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
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onAddComment: PropTypes.func,
  onClickLike: PropTypes.func,
  onClickComment: PropTypes.func,
  onClickShare: PropTypes.func,
  onRouteToArticle: PropTypes.func,
  onCopyLink: PropTypes.func,
  onFollowStatus: PropTypes.func,
  onClickViewMore: PropTypes.func,
};

Article.defaultProps = {
  session: {},
  article: {
    id: 1,
    type: 2,
    writer: {
      name: 'chunsang.yu',
      profileImage: 'https://materializecss.com/images/yuna.jpg'
    },
    title: '어딘가의 호수',
    content: '어딘가의 호수',
    items: [],
    folding: false,
    openRange: '1',
    chips: ['태그1-1', '태그2-2'],
    files: [{
      src: 'https://materializecss.com/images/sample-1.jpg'
    },{
      src: 'https://materializecss.com/images/yuna.jpg'
    }],
    likes: [{
      email: "chunsang.yu@gmail.com",
      nickname: "chunsang.yu"
    }, {
      email: "chundol42@github.com",
      nickname: "chundol42"
    }],
    comments: [{
      id: 0,
      email: "chunsang.yu@gmail.com",
      nickname: "chunsang.yu",
      content: "어디에 위치한 호수인가요?"
    }, {
      id: 1,
      email: "chundol42@github.com",
      nickname: "chundol42",
      content: "저도 궁금해요"
    }],
    comment: '',
    commentActive: false
  },
  onChange: () => console.warn('onChange not defined'),
  onKeyDown: () => console.warn('onKeyDown not defined'),
  onAddComment: () => console.warn('onAddComment not defined'),
  onClickLike: () => console.warn('onClickLike not defined'),
  onClickComment: () => console.warn('onclickComment not defined'),
  onClickShare: () => console.warn('onClickShare not defined'),
  onRouteToArticle: () => console.warn('onRouteToArticle not defined'),
  onCopyLink: () => console.warn('onCopyLink not defined'),
  onFollowStatus: () => console.warn('onFollowStatus not defined'),
  onClickViewMore: () => console.warn('onClickViewMore not defined')
};

export default Article;