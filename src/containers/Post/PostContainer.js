import React, { Component } from 'react';
import Post from 'components/Post';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as postActions from 'store/modules/post';

class PostContainer extends Component {
  state = {
    mode: 'new',
    id: -1,
    writer: {},
    title: '',
    content: '',
    openRange: '1',
    tags: [],
    files: [],
    carousel: null,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleCreate = () => {
    const { mode, id, title, content, tags, files, openRange  } = this.state;
    const { PostActions } = this.props;

    if (title === null || title === "") {
      window.M.toast({
        html: '제목을 입력 후 다시 시도 바랍니다'
      });
      return;
    }

    if (content === null || content == "") {
      window.M.toast({
        html: '내용을 입력 후 다시 시도 바랍니다'
      })
    }

    if (tags.length < 1) {
      window.M.toast({
        html: '태그는 반드시 하나 이상 등록되어야 합니다'
      });
      
      return;
    }

    if (mode === 'new') {
      PostActions.createPostRequest(
        title,
        content,
        tags,
        files,
        openRange
      ).then(
        () => {
          const { create } = this.props;
          
          if (create.status === "SUCCESS") {
            window.M.toast({
              html: '성공적으로 등록되었습니다'
            });
  
            this.setState({
              title: '',
              content: '',
              tags: [],
              files: [],
              openRange: '1'
            }, () => {
              this.chipInstance.chipsData.forEach(() => {
                this.chipInstance.deleteChip();
              });
            })
          } else {
            window.M.toast({
              html: create.error.message
            });
          }
        }
      );
    } else if (mode === 'edit') {
      PostActions.editPostRequest(
        id,
        title,
        content,
        tags,
        files,
        openRange
      ).then(
        () => {
          const { edit } = this.props;

          if (edit.status === 'SUCCESS') {
            window.M.toast({
              html: '성공적으로 수정되었습니다'
            });

            this.retrievePost(id);

          } else {
            window.M.toast({
              html: edit.error.message
            });
          }
        }
      );
    } else {
      window.M.toast({
        html: '잘못된 접근 입니다'
      });
    }
  }

  handleSetChips = (ref) => {
    if (this.chips === undefined) {
      this.chips = ref;
      console.log('called handleSetChips');
    }
  }

  handleSetCarousel = (ref) => {
    if (this.carousel === undefined) {
      this.carousel = ref;

      this.setState({
        carousel: this.carousel
      }, () => {
        this.createCarouselInstance();
      });

      console.log('called handleSetCarousel');
    }
  }

  handleChipAdd = () => {
    const { chipInstance } = this;
    const tags = chipInstance.chipsData.map(({tag}) => {
      return tag;
    });

    this.setState({
      tags
    });
  }

  handleChipDelete = () => {
    const { chipInstance } = this;
    const tags = chipInstance.chipsData.map(({tag}) => {
      return tag;
    });

    this.setState({
      tags
    });
  }

  handleChangeOpenRange = (e) => {
    this.setState({
      openRange: e.target.value
    });
  }

  handleChangeFile = (e) => {
    console.log(e.target.files);
    this.setState({
      files: Array.from(e.target.files)
    }, (e) => {
      if (this.state.files.length > 0) {
        this.createCarouselInstance();
      }
    });

    window.M.toast({
      html: `${e.target.files.length} 개 파일이 선택되었습니다.`
    });
  }

  createCarouselInstance = () => {
    this.carouselInstance = window.M.Carousel.init(this.state.carousel, {
      fullWidth: true,
      noWrap: true,
      indicators: true
    });
  }

  setModeType = () => {
    const { url, path, params } = this.props.match;

    if (path === '/post/new') {
      this.setState({
        mode: 'new'
      });
    } else if (path === '/post/edit/:id') {
      this.setState({
        mode: 'edit',
        id: params.id
      });
    }
  }

  componentDidMount() {
    const {
      handleChipAdd,
      handleChipDelete
    } = this;
    const { match } = this.props;

    this.setModeType();

    this.chipInstance = window.M.Chips.init(this.chips, {
      placeholder: "태그 입력",
      secondaryPlaceholder: " + 태그",
      onChipAdd: handleChipAdd,
      onChipDelete: handleChipDelete
    });

    this.createCarouselInstance();

    if (match.path === "/post/edit/:id") {
      const { id } = match.params;
      
      this.retrievePost(id);
    }
  }

  retrievePost = (id) => {
    const { PostActions } = this.props;

    PostActions.getPostRequest(id).then(
      () => {
        const { data } = this.props;

        if (data.status === "SUCCESS") {
          const { info } = data;

          if (info[0].tags.length > 0) {
            info[0].tags.forEach(tag => {
              this.chipInstance.addChip({
                tag: tag
              });
            })
          }
          
          this.setState({
            mode: 'edit',
            writer: info[0].writer,
            id: info[0]._id,
            title: info[0].title,
            content: info[0].content,
            tags: info[0].tags,
            files: info[0].files,
            openRange: info[0].openRange
          });
        } else {
          window.M.toast({
            html: data.error.message
          });
        }
      }
    );
  }

  render() {
    const { history } = this.props;
    const { mode, id } = this.state;
    const { title, content, openRange, files, carousel } = this.state;
    const {
      handleChange,
      handleCreate,
      handleSetChips,
      handleSetCarousel,
      handleChangeOpenRange,
      handleChangeFile
    } = this;

    return (
      <Post 
        history={history}
        title={title}
        content={content}
        openRange={openRange}
        files={files}
        onChange={handleChange}
        onCreate={handleCreate}
        onSetChips={handleSetChips}
        onSetCarousel={handleSetCarousel}
        onChangeOpenRange={handleChangeOpenRange}
        onChangeFile={handleChangeFile}
      />
    )
  }
}

export default connect(
  ({post}) => ({
    create: post.create,
    edit: post.edit,
    data: post.data
  }),
  (dispatch) => ({
    PostActions: bindActionCreators(postActions, dispatch)
  })
)(PostContainer);