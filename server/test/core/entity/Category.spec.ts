import Category from '../../../src/core/entity/Category';

let category: Category;
const input = {
  id:          'id',
  name:        'name',
  description: 'description'
};

beforeEach(() => category = new Category(input.id, input.name, input.description));

describe('success', () => {
  test('validate category instance', () => {
    expect(category.id).toBe(input.id);
    expect(category.name).toBe(input.name);
    expect(category.description).toBe(input.description);
  });
});

