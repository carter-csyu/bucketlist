import React from 'react';
import PropTypes from 'prop-types';
import './Post.css';

const Post = ({
  history,
  title,
  content,
  openRange,
  files,
  onChange,
  onCreate,
  onSetCarousel,
  onSetChips,
  onChangeOpenRange,
  onChangeFile
}) => {
  let images, imageElements;

  if (files.length > 0) {
    console.log(files);
    images = files.map((image, idx) => {
      let src;

      if (image._id) {
        src = `http://localhost:3000/images/${image.fileName}`;
      } else {
        src = window.URL.createObjectURL(image);
      }

      return (
        <a className="carousel-item" key={idx}>
          <img alt={idx} src={src} />
        </a>
      );
    });

    imageElements = (
      <div 
        className="carousel carousel-slider upload-images"
        ref={ ref => onSetCarousel(ref) }
      >
        {images}
      </div>
    )
  } else {
    imageElements = (<div></div>);
  }

  return (
    <div className="PostWrite">
      <header className="page-header">
        <i 
          className="back-btn material-icons indigo-text darken-4"
          onClick={() => {
            history.goBack();
          }}
        >arrow_back</i>
        <div className="title">게시글 작성하기</div>
      </header>
      <div className="content">
        <h5>제목</h5>
        <div className="input-filed">
          <input 
            type="text" 
            name="title"
            className="validate" 
            placeholder="제목 입력"
            value={title}
            onChange={onChange}
          />
        </div>

        <h5>내용</h5>
        <div className="input-filed">
          <textarea
            name="content"
            className="materialize-textarea validate"
            placeholder="내용 입력"
            data-length="120"
            value={content}
            onChange={onChange}
          />
        </div>

        <h5>태그</h5>
        <div 
          className="chips validate"
          ref={ ref => onSetChips(ref) }>
        </div>

        <h5>이미지첨부</h5>
          {imageElements}
        <div className="filebox">
          <label 
            htmlFor="imageUpload"
            className="waves-effect waves-light btn indigo darken-4 btn-imageupload"
          >이미지 추가하기</label>
          <input 
            type="file" 
            name="imageUpload"
            id="imageUpload"
            multiple="multiple"
            accept="image/*"  
            onChange={onChangeFile}
          />
        </div>

        <h5>공개범위</h5>
        <div className="open-range">
          <label>
            <input name="open-range" type="radio" value="1"
              checked={openRange === "1"} 
              onChange={onChangeOpenRange}
            />
            <span className="radio-text black-text">전체공개</span>
          </label>
          <label>
            <input name="open-range" type="radio" value="2" 
              checked={openRange === "2"} 
              onChange={onChangeOpenRange}
            />
            <span className="radio-text black-text">팔로워공개</span>
          </label>
          <label>
            <input name="open-range" type="radio" value="3" 
              checked={openRange === "3"}  
              onChange={onChangeOpenRange}
            />
            <span className="radio-text black-text">나만보기</span>
          </label>
        </div>

        {/* 등록 버튼 */}
        <div className="col s12">
          <button 
            className="waves-effect waves-light btn light-blue darken-1 btn-create"
            onClick={onCreate}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  openRange: PropTypes.string,
  files: PropTypes.array,
  onChange: PropTypes.func,
  onCreate: PropTypes.func,
  onSetChips: PropTypes.func,
  onSetCarousel: PropTypes.func,
  onChangeOpenRange: PropTypes.func,
  onChangeFile: PropTypes.func
};

Post.defaultProps = {
  title: '',
  content: '',
  openRange: '1',
  files: [],
  onChange: () => console.warn('onChange not defined'),
  onCreate: () => console.warn('onCreate not defined'),
  onSetChips: () => console.warn('onSetChips not defined'),
  onSetCarousel: () => console.warn('onSetCarousel not defined'),
  onChangeOpenRange: () => console.warn('onChangeOpenRange not defined'),
  onChangeFile: () => console.warn('onChangeFile not defined')
};

export default Post;