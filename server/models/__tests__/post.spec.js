import request from 'supertest';
import app from '../../server';
import Post from '../post';
import { connectDB, dropDB } from '../../util/test-helpers';

// Initial posts added into test db
const posts = [
  new Post({ name: 'Prashant', title: 'Hello Mern', slug: 'hello-mern', cuid: 'f34gb2bh24b24b2', content: "All cats meow 'mern!'" }),
  new Post({ name: 'Mayank', title: 'Hi Mern', slug: 'hi-mern', cuid: 'f34gb2bh24b24b3', content: "All dogs bark 'mern!'" }),
];

beforeAll('connect to mockgoose', async () => {
  await connectDB();
});

beforeEach('connect and add two post entries', async () => {
  await Post.create(posts).catch(() => 'Unable to create posts');
});

test(async () => {
  await dropDB();
});

test('Should correctly give number of Posts', async () => {
  expect.assertions(2);

  const res = await request(app)
    .get('/api/posts')
    .set('Accept', 'application/json');

  expect(res.status).toBe(200);
  expect(posts.length).toEqual(res.body.posts.length);
});

test('Should send correct data when queried against a cuid', async () => {
  expect.assertions(2);

  const post = new Post({ name: 'Foo', title: 'bar', slug: 'bar', cuid: 'f34gb2bh24b24b2', content: 'Hello Mern says Foo' });
  post.save();

  const res = await request(app)
    .get('/api/posts/f34gb2bh24b24b2')
    .set('Accept', 'application/json');

  expect(res.status).toBe(200);
  expect(res.body.post.name).toBe(post.name);
});

test('Should correctly add a post', async () => {
  expect.assertions(2);

  const res = await request(app)
    .post('/api/posts')
    .send({ post: { name: 'Foo', title: 'bar', content: 'Hello Mern says Foo' } })
    .set('Accept', 'application/json');

  expect(res.status).toBe(200);

  const savedPost = await Post.findOne({ title: 'bar' }).exec();
  expect(savedPost.name).toBe('Foo');
});

test('Should correctly delete a post', async () => {
  expect.assertions(2);

  const post = new Post({ name: 'Foo', title: 'bar', slug: 'bar', cuid: 'f34gb2bh24b24b2', content: 'Hello Mern says Foo' });
  post.save();

  const res = await request(app)
    .delete(`/api/posts/${post.cuid}`)
    .set('Accept', 'application/json');

  expect(res.status).toBe(200);

  const queriedPost = await Post.findOne({ cuid: post.cuid }).exec();
  expect(queriedPost).toBe(null);
});
