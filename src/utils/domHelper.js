import Swal from "sweetalert2";

/**
 * Closes a modal form by its ID.
 *
 * This function hides the modal with the specified ID by removing the 'show' class
 * and setting its display style to 'none'. It also removes any modal backdrop elements
 * from the DOM.
 *
 * @param {string} id - The ID of the modal to close.
 */
export const closeFormModal = (id) => {
    const modalHTML = document.getElementById(id);

    if (!modalHTML) {
        console.error(`Modal ID not found: ${id}`);
        return;
    }

    modalHTML.classList.remove('show');
    modalHTML.style.display = 'none';
    const backdrop = document.querySelectorAll('.modal-backdrop');
    backdrop.forEach(element => element.remove());
}

/**
 * Displays a custom alert using SweetAlert2.
 *
 * @param {string} message - The message to display in the alert.
 * @param {string} [type='success'] - The type of alert (e.g., 'success', 'error', 'warning', 'info', 'question').
 * @param {string} [position='top-end'] - The position of the alert on the screen (e.g., 'top', 'top-start', 'top-end', 'center', 'center-start', 'center-end', 'bottom', 'bottom-start', 'bottom-end').
 */
export const customAlert = (message, type = 'success', position = 'center-end') => {
    Swal.fire({
        timer: 2000,
        showConfirmButton: false,
        title: message,
        icon: type,
        willOpen: () => {
            const popup = Swal.getPopup();
            popup.style.position = 'absolute';
            popup.style.top = '-200px';
            popup.style.left = '40%';
            popup.style.transform = 'none'; // Disable default centering
        }
    });
}