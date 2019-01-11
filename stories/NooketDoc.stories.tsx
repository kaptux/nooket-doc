import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { IViewPluginProps } from 'nooket-common';

import StoryContainer from './StoryContainer';
import NooketDoc from '../src/NooketDoc';

import { context } from './test-data/context';
import { instances } from './test-data/instances';

const propsNoSettings: IViewPluginProps = {
  view: {
    type: '',
    query: { categoryId: '2' },
    state: null,
    settings: null,
  },
  context,
  data: instances.filter(i => i.categoryId === '7'),
  onRequestEditorView: action('onRequestEditorView'),
  onRequestInstanceView: action('onRequestInstanceView'),
  onSaveInstance: action('onSaveInstance'),
  onSaveState: action('onSaveState'),
  onSaveSettings: action('onSaveSetings'),
  fetchTimestamp: new Date().getTime(),
};

import 'antd/dist/antd.min.css';

storiesOf('NooketDoc', module).add('default', () => (
  <StoryContainer>
    <NooketDoc {...propsNoSettings} />
  </StoryContainer>
));
