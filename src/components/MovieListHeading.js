import React, { useState } from "react";

const MovieListHeading = (props) => {
  return (
    <div className="col">
      <h1>
        <b>
          {props.heading} <span>{props.list}</span> list
        </b>
      </h1>
    </div>
  );
};

export default MovieListHeading;
