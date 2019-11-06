import Pinboard from 'node-pinboard';

export default () => {
    return new Pinboard(process.env.PINBOARD_API_KEY);
}