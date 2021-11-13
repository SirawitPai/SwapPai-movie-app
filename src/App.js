import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieList from "./components/MovieList";
import MovieListHeading from "./components/MovieListHeading";

import SearchBox from "./components/SearchBox";

import AddFavourites from "./components/AddFavourites";
import RemoveFavourites from "./components/RemoveFavourites";

import { Button, Modal, Container, Row, Col } from "react-bootstrap";

import imagepay from "./images/payment.jpg";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);

  const [searchValue, setSearchValue] = useState("a");
  const [price, setPrice] = useState(0);

  const getMovieRequest = async (searchValue) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=e7b78e6147bc4ae31b83ab211e438146&query=${searchValue}`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.results) {
      setMovies(responseJson.results);
    }
  };

  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const movieFavourites = JSON.parse(
      localStorage.getItem("react-movie-app-favourites")
    );

    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem("react-movie-app-favourites", JSON.stringify(items));
  };

  const addFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    setPrice(price + movie.vote_count);
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.id !== movie.id
    );

    setPrice(price - movie.vote_count);
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const Deleteall = () => {
    setFavourites([]);
    setPrice(0);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setNum(60);
  };

  const [num, setNum] = useState(60);
  const [pause, setPause] = useState(false);

  let intervalRef = useRef();

  const decreaseNum = () => {
    if (num > 0) {
      setNum((prev) => prev - 1);
    } else {
      setShow(false);
      setNum(60);
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(decreaseNum, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="container-fluid movie-app">
      <div className="row d-flex align-items-center mt-4 mb-4">
        <div className="col">
          <h1>
            <b>
              Swap<span>Pai</span> Movies <span>APP</span>
            </b>
          </h1>
        </div>

        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className="row">
        <MovieList
          movies={movies}
          handleFavouritesClick={addFavouriteMovie}
          favouriteComponent={AddFavourites}
        />
      </div>
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Basket" list={favourites.length} />
        <button className="bynpay" onClick={handleShow}>
          PAY
        </button>
        <button onClick={Deleteall} type="button" className="btndeleteall">
          Clear
        </button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              <div className="textlist">
                List of all products : {favourites.length}
              </div>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Container>
              <Row>
                <Col xs={12} md={8}>
                  {favourites.map((list, index) => (
                    <p className="textlist">
                      {index + 1}.{list.original_title}{" "}
                    </p>
                  ))}
                </Col>
                <Col xs={6} md={4}>
                  {favourites.map((list, index) => (
                    <p className="textlist">Price : {list.vote_count}</p>
                  ))}
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={8}>
                  <p className="textlist">Total Price : </p>
                </Col>
                <Col xs={6} md={4}>
                  <p className="textlist">{price}</p>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={8}>
                  <div className="discount">
                    {favourites.length === 3 && <p>Discount 10% </p>}
                    {favourites.length >= 5 && <p>Discount 20% </p>}
                  </div>
                </Col>
                <Col xs={6} md={4}>
                  <div className="discount">
                    {favourites.length === 3 && <p>{(price / 100) * 90}</p>}
                    {favourites.length >= 5 && <p>{(price / 100) * 80}</p>}
                  </div>
                </Col>
              </Row>
              <Row>
                <h5 className="textlist">payment method </h5>
                <img
                  src={imagepay}
                  className="imagepay"
                  width="80%"
                  alt="movie"
                ></img>
              </Row>

              <div className="timeout">
                <h2>TIME OUT :{num}</h2>
              </div>
            </Container>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="row">
        <MovieList
          movies={favourites}
          handleFavouritesClick={removeFavouriteMovie}
          favouriteComponent={RemoveFavourites}
        />
      </div>
    </div>
  );
};

export default App;
