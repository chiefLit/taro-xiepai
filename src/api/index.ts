import axios from '../utils/axios'

export default {
  test(data) {
    const config = {
      method: 'post',
      url: '/h5/user/apply',
      mockData: require('../../mock/test.json'),
      data: data
    };
    return axios(config);
  },
}
