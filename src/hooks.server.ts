import { server } from './mocks/server.js';

if (process.env.NODE_ENV === 'development') {
	server.listen();
}
