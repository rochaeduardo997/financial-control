import axios from "axios";
import IHTTP from "./HTTP.interface";

class AxiosAdapter implements IHTTP {
  constructor() {
    axios.defaults.headers.Accept = "application/json";
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(`bearer_token`);
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (err) => Promise.reject(err),
    );

    axios.interceptors.response.use(
      (value) => value,
      (err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem(`bearer_token`);
          localStorage.removeItem(`user_informations`);
          window.location.href = "/authentication/login";
        }
        return Promise.reject(err);
      },
    );
  }

  async get(url: string): Promise<any> {
    try {
      const { data, status } = await axios.get(url);
      return { data, status };
    } catch (err: any) {
      console.error("failed on axios get request, err_msg:", err.message);
      throw new Error(err);
    }
  }
  async post(url: string, body: any): Promise<any> {
    try {
      const { data, status } = await axios.post(url, body);
      return { data, status };
    } catch (err: any) {
      console.error("failed on axios post request, err_msg:", err.message);
      throw new Error(err);
    }
  }
  async put(url: string, body: any): Promise<any> {
    try {
      const { data, status } = await axios.put(url, body);
      return { data, status };
    } catch (err: any) {
      console.error("failed on axios put request, err_msg:", err.message);
      throw new Error(err);
    }
  }
  async delete(url: string): Promise<any> {
    try {
      const { data, status } = await axios.delete(url);
      return { data, status };
    } catch (err: any) {
      console.error("failed on axios delete request, err_msg:", err.message);
      throw new Error(err);
    }
  }
  async raw(config: any): Promise<any> {
    try {
      const { data, status } = await axios(config);
      return { data, status };
    } catch (err: any) {
      console.error("failed on axios raw request, err_msg:", err.message);
      throw new Error(err);
    }
  }
}

export default AxiosAdapter;
