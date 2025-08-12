import axios from 'axios';

const BASE_URL = '/api';
const headers = { 'Content-Type': 'application/json' };

export default {
  async getCalendar(date) {
    const { data } = await axios.get(`${BASE_URL}/calendar`, {
      params: { date },
    });
    // console.log('/calendar: ' + JSON.stringify(data));
    return data;
  },
};
