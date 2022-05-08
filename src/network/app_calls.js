import { host_url } from "./utils";

const generalInfo = () => {
    return fetch(`${host_url}apiauth/`)
}
 
export {generalInfo};