import axios from 'axios';

const BASE_URL = '/api/winner-stats';
const headers = { 'Content-Type': 'application/json' };

export default {
  async getRegionAge(region, date) {
    const { data } = await axios.get(`${BASE_URL}/region-age`, {
      params: { region, date },
    });
    console.log('/region-age: ' + JSON.stringify(data));
    return data;
  },

  async getLowPopular(region, reside, rank) {
    const { date } = await axios.get(`${BASE_URL}/low-popular`, {
      params: { region, reside, rank },
    });
    console.log('/low-popular: ' + data);
    return data;
  },
};
