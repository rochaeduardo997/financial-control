import User, { UserRole } from '../../src/core/entity/User';

export default (howMany: number = 1) => {
  const result: User[] = [];
  for(let i = 1; i <= howMany; i++) {
    const input = {
      id:        `id${i}`,
      name:      `name${i}`,
      username:  `username${i}`,
      email:     `email${i}@email.com`,
      password:  'password',
      status:    false,
      role:      UserRole.ADMIN,
      createdAt: new Date(`2022-02-0${i}T00:00:00`),
      updatedAt: new Date(`2022-02-0${i + 1}T01:00:00`)
    };
    result.push(new User(input.id, input.name, input.username, input.email, input.password, input.status, input.role, input.createdAt, input.updatedAt));
  }

  return result;
}

