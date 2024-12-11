/* eslint-disable react/prop-types */

export const SidebarCloseButton = ({ onClick }) => (
    <button
        className="btn btn-close btn-close-white d-md-none position-absolute top-0 end-0 m-2"
        aria-label="Close"
        onClick={onClick}
    ></button>
)
