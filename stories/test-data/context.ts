import { categories } from './categories';
import { users } from './users';
import { IViewContext } from 'nooket-common';
import { arrayOfObjectsToHashmap } from '../../src/utils';

const userIds = ['1', '2', '3', '5'];

const userId = userIds[0];

export const context: IViewContext = {
  categoriesHashmap: arrayOfObjectsToHashmap('_id', categories),
  usersHashmap: arrayOfObjectsToHashmap('_id', users),
  userId,
};
