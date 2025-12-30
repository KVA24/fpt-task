import {Bounce, toast} from 'react-toastify'

class ToastUtil {
  
  public info(message: string) {
    toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      closeButton: false
    })
  }
  
  public success(message: string, id?: any) {
    toast.success(message, {
      toastId: id,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      closeButton: false
    })
  }
  
  public warning(message: string, id?: any) {
    toast.warn(message, {
      toastId: id,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      closeButton: false
    })
  }
  
  public error(message: string, id?: any) {
    toast.error(message ?? "Đã có lỗi xảy ra!", {
      toastId: id,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      closeButton: false
    })
  }
}

export const toastUtil = new ToastUtil();

