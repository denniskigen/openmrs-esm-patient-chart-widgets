import React from "react";

import { Tile } from "carbon-components-react";

import EmptyStateIllustration from "../empty-state/empty-state-illustration.component";

const EmptyState = ({ name, showComponent, addComponent, displayText }) => {
  // return <EmptyStateIllustration />;
  return (
    <Tile style={{ width: "35.563rem", height: "12.375rem" }}>
      <h1>Vitals</h1>
      <p>There are no {displayText}</p>
      <a href="#">Add a {displayText}</a>
    </Tile>
  );
};

export default EmptyState;
