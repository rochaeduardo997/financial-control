import User, { UserRole } from '../../../src/core/entity/User';

let user: User;
const input = {
  id:        'id',
  name:      'name',
  username:  'username',
  email:     'email@email.com',
  password:  'password',
  status:    false,
  role:      UserRole.ADMIN,
  createdAt: new Date('2022-02-02T00:00:00'),
  updatedAt: new Date('2022-02-02T01:00:00')
};

beforeEach(() => user = new User(input.id, input.name, input.username, input.email, input.password, input.status, input.role, input.createdAt, input.updatedAt));

describe('success', () => {
  test('validate user instance', () => {
    expect(user.id).toBe(input.id);
    expect(user.name).toBe(input.name);
    expect(user.username).toBe(input.username);
    expect(user.email).toBe(input.email);
    expect(user.password).toBe(input.password);
    expect(user.status).toBe(input.status)
    expect(user.role).toBe(input.role)
    expect(user.createdAt).toBe(input.createdAt)
    expect(user.updatedAt).toBe(input.updatedAt)
  });

  test('validate user instance without status as parameter', () => {
    user = new User(input.id, input.name, input.username, input.email, input.password, undefined, input.role, input.createdAt, input.updatedAt);
    expect(user.status).toBeTruthy()
  });
});

describe('fail', () => {
  test('invalid email format', () => {
    expect(() => new User(input.id, input.name, input.username, 'invalid', input.password, input.status, input.role, input.createdAt, input.updatedAt))
      .toThrow('invalid email format');
  });
});

