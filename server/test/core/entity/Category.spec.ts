import Category from '../../../src/core/entity/Category';

let category: Category;
const input = {
  id:          'id',
  name:        'name',
  description: 'description',
  userId:       'userId'
};

beforeEach(() => category = new Category(input.id, input.name, input.description, input.userId));

describe('success', () => {
  test('validate category instance', () => {
    expect(category.id).toBe(input.id);
    expect(category.name).toBe(input.name);
    expect(category.description).toBe(input.description);
    expect(category.userId).toBe(input.userId);
  });

  test('associate user id to category', () => {
    const newUserId = 'newUserId';
    category.associateUser(newUserId);
    expect(category.userId).toBe(newUserId);
  });
});

