import Category from '../../src/core/entity/Category';

export default (howMany: number = 1) => {
  const result: Category[] = [];
  for(let i = 1; i <= howMany; i++) {
    const input = {
      id:          `id${i}`,
      name:        `name${i}`,
      description: 'description'
    };
    result.push(new Category(input.id, input.name, input.description));
  }

  return result;
}

