import axios from "axios";

const axiosInstance = axios.create({
	// baseURL: 'http://niot.sa-east-1.elasticbeanstalk.com/api'
	baseURL: "https://desk.niot.com.br/api"
	// baseURL: 'http://niot-env.eba-nj9qdzma.sa-east-1.elasticbeanstalk.com/api'
});

export default axiosInstance;
//
