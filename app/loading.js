'use client';
import ClipLoader from "react-spinners/ClipLoader";
const override = {
    display: "block",
    margin: "100px auto",
    borderColor: "red",
};


const LoadingPage = () => {


    return (
        <ClipLoader color="#36d7b7" cssOverride={override} size={150} aria-label="Loading Spinner" />

    );
}

export default LoadingPage;
