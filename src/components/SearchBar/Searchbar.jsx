import { useState } from 'react';
import { ImSearch } from 'react-icons/im';
import css from './SearchBar.module.css';
import PropTypes from 'prop-types';
const SearchBar = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleChange = ({ target }) => {
    setValue(target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    onSubmit(value);
    setValue('');
  };

  return (
    <header className={css.header}>
      <form className={css.form} onSubmit={handleSubmit}>
        <button className={css.btn}>
          <ImSearch />
          <span className={css.btnLabel}>Search</span>
        </button>
        <input
          className={css.inp}
          onChange={handleChange}
          type="text"
          value={value}
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

export default SearchBar;

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
