import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import StoryContainer from './StoryContainer';
import NooketDoc from '../src/NooketDoc';

storiesOf('NooketDoc', module).add('default', () => (
  <StoryContainer>
    <NooketDoc />
  </StoryContainer>
));
