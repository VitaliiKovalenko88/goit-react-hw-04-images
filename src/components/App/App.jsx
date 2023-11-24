import { Component, useState, useEffect } from 'react';
import SearchBar from 'components/SearchBar/Searchbar';
import { getImageWithQuery } from 'pixabayApi/pixabayApi';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';
import { Loader } from 'components/Loader/Loader';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import css from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [gallery, setgallery] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [largeImage, setLargeImage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    createGallery();
  }, [query, page]);

  const createGallery = async () => {
    setIsLoading(true);

    try {
      const { hits, totalHits } = await getImageWithQuery(query, page);

      if (hits.length === 0) {
        setgallery([]);
        setError('Sorry, you are entering an incorrect value');
        setIsLoading(false);
        return;
      }

      setgallery(prevState => [...prevState, ...hits]);
      setLoadMore(page < Math.ceil(totalHits / 12));
      setError(null);
      isLoading(false);
    } catch (error) {
      console.error('Error in createGallery:', error);
      setgallery([]);
      setError('Something is wrong with the request address'.toUpperCase());
      setIsLoading();
    }
  };

  return <div>App</div>;
};

class Apps extends Component {
  state = {
    query: '',
    gallery: [],
    page: 1,
    error: null,
    loadMore: false,
    isLoading: false,
    largeImage: '',
    showModal: false,
  };

  async componentDidUpdate(_, prevState) {
    try {
      const { query, page } = this.state;
      const prevQuery = prevState.query;
      const prevPage = prevState.page;

      if (query !== prevQuery || page !== prevPage) {
        await this.createGallery();
      }
    } catch (error) {
      console.error('Error in componentDidUpdate:', error);
    }
  }

  handleFormSubmite = query => {
    this.setState({
      query,
      gallery: [],
      page: 1,
    });
  };

  createGallery = async () => {
    this.setState({ isLoading: true });
    const { query, page } = this.state;

    try {
      const { hits, totalHits } = await getImageWithQuery(query, page);

      if (hits.length === 0) {
        this.setState({
          gallery: [],
          error: 'Sorry, you are entering an incorrect value',
          isLoading: false,
        });
        return;
      }

      this.setState(prevState => ({
        gallery: [...prevState.gallery, ...hits],
        loadMore: this.state.page < Math.ceil(totalHits / 12),
        error: null,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error in createGallery:', error);
      this.setState({
        gallery: [],
        error: 'Something is wrong with the request address'.toUpperCase(),
        isLoading: false,
      });
    }
  };

  onLoadMoreImg = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  onOpenModal = e => {
    const { image } = e.target.dataset;
    this.setState({ largeImage: image });
    this.togleModal();
  };

  togleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const { gallery, largeImage, showModal, error, isLoading, loadMore } =
      this.state;

    return (
      <div className={css.container}>
        <SearchBar onSubmit={this.handleFormSubmite} />
        {isLoading && <Loader />}
        {showModal && (
          <Modal
            onClick={this.togleModal}
            onClose={this.togleModal}
            url={largeImage}
          />
        )}
        {error !== null ? <div>{error}</div> : null}
        <ImageGallery gallary={gallery} onClick={this.onOpenModal} />
        {loadMore ? <Button onLoadMore={this.onLoadMoreImg} /> : null}
      </div>
    );
  }
}

export default App;
