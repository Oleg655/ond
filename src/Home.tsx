import React from 'react';

import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>This is the home page</h1>
            <Link to="about">Click to view our about page</Link>
        </div>
    );
};

export default Home;
