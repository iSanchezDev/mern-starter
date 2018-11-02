import callApi, { API_URL } from '../apiCaller';
import nock from 'nock';

test('method defaults to GET', () => {
  const reply = { foo: 'bar' };
  nock(API_URL)
    .get('/foo')
    .reply(200, reply);
  return callApi('foo').then(response => {
    expect(response).toEqual(reply);
  });
});

test('sends the body', () => {
  const body = { id: 5 };
  const reply = { foo: 'bar' };
  nock(API_URL)
    .post('/foo', body)
    .reply(200, reply);
  return callApi('foo', 'post', body).then(response => {
    expect(response).toEqual(reply);
  });
});

test('returns the error', () => {
  const reply = { message: 'Errrrrrrrrr' };
  nock(API_URL)
    .get('/send_error')
    .reply(500, reply);
  return callApi('send_error').then(error => {
    expect(error).toEqual(reply);
  });
});
