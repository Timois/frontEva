import Swal from "sweetalert2";

export const confirmDelete = async (message, confirmText = 'Si', cancelText = 'Cancelar') => {
   const result = await Swal.fire({
      title: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
   });
   return result.isConfirmed;
};