import { toast } from 'react-toastify';


export const notify = {
  success: (msg: string) => toast.success(msg || "Operation successful!"),
  error: (msg: string) => toast.error(msg || "Something went wrong!"),
  info: (msg: string) => toast.info(msg || "Here is some info!")
};