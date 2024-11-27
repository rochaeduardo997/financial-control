import IHTTP from "./HTTP.interface";
import AxiosAdapter from "./AxiosAdapter";

const HTTP: IHTTP = new AxiosAdapter();

export default HTTP;
