import { useState, useEffect } from 'react';
import SearchBar from 'components/SearchBar/Searchbar';
import { getImageWithQuery } from 'pixabayApi/pixabayApi';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';
import { Loader } from 'components/Loader/Loader';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import css from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [gallery, setGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [largeImage, setLargeImage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (query === '') return;

    setIsLoading(true);

    getImageWithQuery(query, page)
      .then(({ hits, totalHits }) => {
        if (hits.length === 0) {
          setGallery([]);
          setError('Sorry, you are entering an incorrect value');
          setIsLoading(false);

          return;
        }

        setGallery(prevState => {
          return [...prevState, ...hits];
        });
        setLoadMore(page < Math.ceil(totalHits / 12));
        setError(null);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error in createGallery:', error);
        setGallery([]);
        setError('Something is wrong with the request address'.toUpperCase());
        setIsLoading(false);
      });
  }, [query, page]);

  const handleFormSubmite = query => {
    setQuery(query);
  };

  const togleModal = () => {
    setShowModal(!showModal);
  };

  const onOpenModal = e => {
    const { image } = e.target.dataset;
    setLargeImage(image);
    togleModal();
  };
  const onLoadMoreImg = () => {
    setPage(page => page + 1);
  };

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleFormSubmite} />
      {isLoading && <Loader />}
      {showModal && (
        <Modal onClick={togleModal} onClose={togleModal} url={largeImage} />
      )}
      {error !== null ? <div>{error}</div> : null}
      <ImageGallery gallary={gallery} onClick={onOpenModal} />
      {loadMore && !error ? <Button onLoadMore={onLoadMoreImg} /> : null}
    </div>
  );
};

export default App;
