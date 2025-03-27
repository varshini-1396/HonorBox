import React from "react";

const NotFound = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold text-error">404</h1>
                    <p className="py-6 text-lg text-base-content">
                        Oops! The page you are looking for does not exist.
                    </p>
                    <a href="/" className="btn btn-primary">
                        Go Back Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NotFound;