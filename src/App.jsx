import React, { useState } from 'react';
import './App.scss';

import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import usersFromServer from './api/users';

export const App = () => {
  const [filteredProducts, setFilteredProducts] = useState(productsFromServer);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categoriesMap = categoriesFromServer.reduce((map, category) => {
    return {
      ...map,
      [category.id]: category,
    };
  }, {});

  const usersMap = usersFromServer.reduce((map, user) => {
    return {
      ...map,
      [user.id]: user,
    };
  }, {});

  const handleUserFilter = userId => {
    if (userId === selectedUser) {
      setSelectedUser(null);
      filterProducts(null, searchTerm);
    } else {
      setSelectedUser(userId);
      filterProducts(userId, searchTerm);
    }
  };

  const handleSearch = event => {
    const value = event.target.value.toLowerCase();

    setSearchTerm(value);
    filterProducts(selectedUser, value);
  };

  const filterProducts = (userId, searchValue) => {
    const filtered = productsFromServer.filter(product => {
      const productName = product.name.toLowerCase();
      const matchesSearch = productName.includes(searchValue);
      const matchesUser = userId ? product.categoryId === userId : true;

      return matchesSearch && matchesUser;
    });

    setFilteredProducts(filtered);
  };

  const clearSearch = () => {
    setSearchTerm('');
    filterProducts(selectedUser, '');
  };

  const resetFilters = () => {
    setSelectedUser(null);
    setSearchTerm('');
    setFilteredProducts(productsFromServer);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUser === null ? 'is-active' : ''}
                onClick={() => handleUserFilter(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUser === user.id ? 'is-active' : ''}
                  onClick={() => handleUserFilter(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className={`delete ${searchTerm ? 'is-block' : 'is-invisible'}`}
                    onClick={clearSearch}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => resetFilters()}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                  onClick={() => filterProducts(null, searchTerm)}
                >
                  {category.icon} - {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">ID</span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">Product</span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">Category</span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">User</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map(({ id, name, categoryId }) => (
                <tr key={id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {id}
                  </td>

                  <td data-cy="ProductName">{name}</td>

                  <td data-cy="ProductCategory">
                    {categoriesMap[categoryId].icon} -{' '}
                    {categoriesMap[categoryId].title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={
                      usersMap[categoriesMap[categoryId].ownerId].sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'
                    }
                  >
                    {usersMap[categoriesMap[categoryId].ownerId].name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
