const Arrow = ({
    collpase = true,
}) => collpase ? (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.7 13.7L5 13l4.6-4.6L5 3.7l.7-.7 5 5v.7l-5 5z"></path></svg>
    ) : (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.976 10.072l4.357-4.357.619.618L8.285 11h-.618L3 6.333l.619-.618 4.357 4.357z"></path></svg>
    )

export default Arrow;