import Swal from "sweetalert2";

// SUCCESS ALERT
export const successAlert = (
  title: string,
  text?: string
) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
  });
};

// ERROR ALERT
export const errorAlert = (
  title: string,
  text?: string
) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
  });
};

// WARNING ALERT
export const warningAlert = (
  title: string,
  text?: string
) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
  });
};

// CONFIRM ALERT
export const confirmAlert = async (
  title: string,
  text?: string
) => {
  return Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });
};