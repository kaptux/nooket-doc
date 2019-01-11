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
  onRequestInstanceView: () => handleRequestInstanceView(),
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

// #region Utilities
const handleRequestInstanceView = () => (
  <React.Fragment>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.Fusce rhoncus qua
    assa vulputate, ut molestie nulla mollis.Etiam eleifend imperdie , vitae
    gravida urna iaculis lobortis.Mauris metus sem, suscipit eget isis quis,
    posuere eget leo.Quisque interdum eros eu faucibus ornare.Cr sus euismod
    ultricies.Donec non pulvinar purus. Fusce hendrerit justo a it ultrices.In
    quis urna justo.Integer commodo velit in consectetur t Donec eu porttitor
    velit.In vestibulum turpis eget libero egesta us.Fusce porttitor dolor at
    mauris mattis, vitae vehicula ex dapibus. molestie nec diam ac
    tristique.Curabitur scelerisque odio ut arcu e , nec convallis est dictum.In
    hac habitasse platea dictumst.Sed sapien egestas non dui eget, volutpat
    placerat augue.Cras congue, neque at gravi giat, elit ligula dictum turpis,
    hendrerit vehicula nunc elit et nunc.Pha rutrum imperdiet augue, in
    hendrerit ipsum consequat sit amet.Morbi ornare urna, maximus bibendum
    leo.Sed aliquam commodo risus et posuere. sent laoreet euismod arcu.Integer
    faucibus a ex eu viverra.Vivamus ulla r velit vitae urna sollicitudin, ut
    eleifend mi feugiat.Duis vitae augu .Sed finibus dui porta ante maximus
    sodales.Donec sit amet sodales mas cenas venenatis sem a elementum
    convallis.Integer dignissim tristique rhoncus.Phasellus id eros velit.Donec
    finibus accumsan sodales.Lorem ips or sit amet, consectetur adipiscing elit.
    Ut dignissim tempor vulputate. l sapien, accumsan sed porttitor sed,
    tincidunt vel leo.Curabitur dictum tur porttitor.Aliquam interdum volutpat
    nibh eu tristique.Ut mollis metus a finibus tortor interdum ac.Aenean tempor
    nibh sem, et iaculis dui ali it amet.Cras vel nisl bibendum, dignissim lorem
    at, aliquam massa ec odio faucibus, pretium nunc aliquet, mollis
    orci.Quisque ac odio sed p pellentesque finibus.Sed at efficitur justo, eu
    pellentesque orci. sagittis enim elit, quis consectetur quam vulputate
    ut.Pellentesque orci eu velit cursus, in tristique libero tempor.Duis a
    gravida eros.U bus neque non nibh eleifend dapibus.Quisque a molestie
    tellus.In ha tasse platea dictumst.Integer scelerisque vitae arcu ac
    cursus.Nulla n rem, faucibus ut ultricies eu, suscipit a dui.Sed non odio id
    liber dit feugiat.Aenean faucibus placerat mauris nec vulputate.Mauris odio
    q lementum et sollicitudin eu, aliquam quis ipsum.Curabitur condimentum fel
    ligula malesuada faucibus.Orci varius natoque penatibus et magnis dis ient
    montes, nascetur ridiculus mus.Etiam tempus orci quis libero ferm
    rhoncus.Aliquam odio lectus, mollis at laoreet vitae, cursus non lor sellus
    ultricies mattis magna nec viverra.Donec convallis sollici elit, id
    tincidunt dui dapibus a.Nullam malesuada rhoncus sem id volut Suspendisse eu
    diam sodales odio viverra luctus.Proin sit amet pu n sapien egestas
    blandit.Proin vulputate rutrum eros ac convallis.Aenean erra diam sed
    sagittis pretium.Ut tristique elit sit amet sem gravi id egestas orci
    tempor.Interdum et malesuada fames ac ante ipsum primis cibus.Curabitur
    sollicitudin, justo quis vehicula varius, ex diam preti na, vel feugiat
    felis lacus ut eros.Etiam quis erat vestibulum, interdum eget, eleifend
    nibh.Curabitur tristique ante id accumsan pharetra.Morbi rat pharetra nulla
    ut tempus.Nam eleifend imperdiet nunc nec ultrices.C ur lacinia ligula in
    urna porta, id bibendum ligula mattis.Eti nisi vitae mi tristique
    blandit.Donec sodales sit amet odio at malesuad mus eleifend tincidunt
    interdum.Vestibulum eu nisl a erat sagitti ndum.Etiam mauris velit,
    imperdiet a mollis blandit, facilisis non li orbi euismod vel urna in
    vehicula.Duis vitae arcu vel est aliquam isis ac ut nunc.Vestibulum sed
    accumsan nisi.Ut elementum et ex ac isis. Quisque ipsum enim, sodales nec
    libero commodo, fermentum imper isus. Sed leo justo, tincidunt vel quam et,
    facilisis blandit felis. ulum eget sodales augue, at convallis
    risus.Maecenas volutpat ex non leo tique, ac ultrices ante tincidunt.Aliquam
    quis felis maximus, rutrum u tae, volutpat magna.Quisque lobortis nisl nec
    neque sodales tempus.Maecen vida nibh in ante tincidunt, id maximus risus
    imperdiet.Duis maximus fac consectetur.Class aptent taciti sociosqu ad
    litora torquent per co nostra, per inceptos himenaeos. Cras a rutrum mauris,
    quis volutpat arcu n nunc semper, lacinia ipsum vel, sodales lorem.Maecenas
    venenatis purus, a efficitur neque tincidunt eu.Aliquam nulla arcu, maximu
    isl aliquet, lobortis iaculis turpis.Interdum et malesuada fames e ipsum
    primis in faucibus.Vivamus blandit lectus sit amet sem commodo us.Nam
    vehicula nunc eu quam rutrum iaculis.Pellentesque nulla enim, nar non sapien
    sed, fringilla vulputate tortor.Duis dui ligula, pretium v condimentum et,
    varius eu mauris.Nullam consequat, risus eget trist imperdiet, massa magna
    tempor diam, eget consequat libero quam in m Nunc porttitor ligula
    nisl.Pellentesque vel felis eget tellus con lacinia.Aenean fermentum magna
    sed augue congue tempus.Vestibulum non por metus.Curabitur cursus varius
    arcu, nec condimentum mi blandit non.
  </React.Fragment>
);
//#endregion
