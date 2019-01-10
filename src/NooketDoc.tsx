import * as React from 'react';
import styled from 'styled-components';
import { Affix } from 'antd';
import classNames from 'classnames';
import { IViewPluginProps, InstanceViewModeEnum } from 'nooket-common';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
  SortableHandle,
} from 'react-sortable-hoc';

const MIN_ORDER = 0;

const ListElementContainer = styled.div`
  list-style: none;
  margin: 0;
  padding: 5px 10px;
  display: block;
  cursor: pointer;

  .drag-handle {
    display: inline-block;
    width: 11px;
    height: 11px;
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z" color="#000"></path></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.25;
    margin-right: 10px;
    cursor: row-resize;
  }

  &.menu-selected {
    color: #1890ff;
    font-weight: 500;
    border-right: 3px #1890ff solid;
  }
`;

const NooketDocContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  margin: 16px;

  .doc-index {
    height: calc(100vh - 70px - 32px);
    position: relative;
    width: 250px;
    background-color: #eee;
    overflow: auto;

    position: relative .menu {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }

  .doc-index::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    background-color: #eee;
  }
  .doc-index::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 5px;
  }

  .doc-body {
    flex: 1;
  }
`;

interface IMenuItem {
  _id: string;
  title: string;
  order: number;
}

interface ISortableListProps {
  items: IMenuItem[];
  selectedId: string;
  onClick: (id: string) => void;
}

interface ISortableItemProps {
  value: IMenuItem;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const DragHandle = SortableHandle(() => <div className="drag-handle" />);

const SortableItem = SortableElement(
  ({ value, onClick, isSelected }: ISortableItemProps) => {
    return (
      <ListElementContainer
        className={classNames({ 'menu-selected': isSelected })}
        onClick={() => onClick(value._id)}
      >
        <DragHandle />
        &nbsp;
        {value.title}
      </ListElementContainer>
    );
  }
);

const SortableList = SortableContainer(
  ({ items, selectedId, onClick }: ISortableListProps) => {
    return (
      <div className="menu">
        {items.map((value, index) => (
          <SortableItem
            key={value._id}
            isSelected={value._id === selectedId}
            index={index}
            value={value}
            onClick={onClick}
          />
        ))}
      </div>
    );
  }
);

class NooketDoc extends React.Component<IViewPluginProps, any> {
  public state = {
    selectedId: null,
    instanceView: null,
  };

  private helperContainerRef = React.createRef();

  private currentSortedMenu: IMenuItem[];

  private handleSortEnd = ({ oldIndex, newIndex }) => {
    const { onSaveState } = this.props;
    const instanceOrder = {};
    arrayMove(this.currentSortedMenu, oldIndex, newIndex).forEach(
      (item, index) => {
        instanceOrder[item._id] = index;
      }
    );
    onSaveState({ instanceOrder });
  };

  private handleMenuClick = id => {
    const { onRequestInstanceView } = this.props;
    this.setState({
      selectedId: id,
      instanceView: onRequestInstanceView(InstanceViewModeEnum.INLINE, id),
    });
  };

  private getSortedData(): IMenuItem[] {
    const {
      data,
      view: { state },
    } = this.props;
    const viewState = state || { instanceOrder: {} };

    const res: IMenuItem[] = [];

    data.forEach(instance => {
      res.push({
        _id: instance._id,
        title: instance.title,
        order: viewState.instanceOrder[instance._id] || MIN_ORDER,
      });
    });

    this.currentSortedMenu = res.sort(
      (item1, item2) => item1.order - item2.order
    );
    return this.currentSortedMenu;
  }

  public componentDidMount() {
    const element = this.helperContainerRef.current as HTMLElement;
    element.focus();
  }

  public render() {
    const items = this.getSortedData();
    const { onRequestInstanceView } = this.props;
    let { instanceView, selectedId } = this.state;

    if (instanceView == null && items.length > 0) {
      selectedId = items[0]._id;
      instanceView = onRequestInstanceView(
        InstanceViewModeEnum.INLINE,
        selectedId
      );
    }

    return (
      <NooketDocContainer ref={this.helperContainerRef}>
        <Affix
          offsetTop={18}
          target={() => {
            // must be the scrollable panel
            const htmlElement = this.helperContainerRef.current as HTMLElement;
            const parent = htmlElement.parentElement;
            return parent;
          }}
        >
          <div className="doc-index">
            <SortableList
              items={items}
              selectedId={selectedId}
              onSortEnd={this.handleSortEnd}
              hideSortableGhost={true}
              useDragHandle={true}
              onClick={this.handleMenuClick}
              helperContainer={this.helperContainerRef.current as HTMLElement}
            />
          </div>
        </Affix>
        <div className="doc-body">
          {instanceView}
          Lorem Ipsum "Neque porro quisquam est qui dolorem ipsum quia dolor sit
          amet, consectetur, adipisci velit..." "No hay nadie que ame el dolor
          mismo, que lo busque, lo encuentre y lo quiera, simplemente porque es
          el dolor." Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin gravida elit eu enim malesuada, sed cursus velit fermentum.
          Pellentesque porta nunc erat, eu rhoncus sapien gravida eu. Donec
          interdum felis quis dolor aliquet, vitae volutpat enim dictum. Aliquam
          a velit consectetur, sollicitudin ligula at, elementum tellus. Nullam
          eu elementum dui, at placerat nisl. Quisque id metus vel metus
          pulvinar lacinia. Praesent vitae nulla sed nulla posuere gravida.
          Quisque eget neque ac justo dapibus porta ac non velit. Etiam suscipit
          at enim in efficitur. Sed viverra felis ut nulla commodo pretium.
          Mauris id viverra nisl. Fusce a rutrum metus. Donec porta convallis
          tellus, a tincidunt erat hendrerit quis. Fusce laoreet nisl eget
          finibus scelerisque. Quisque aliquet vitae leo imperdiet feugiat.
          Nullam finibus nibh vel leo faucibus, at imperdiet felis commodo. Cras
          ac mauris pulvinar, placerat metus ac, sodales tellus. Aenean molestie
          ante leo, et facilisis neque pharetra nec. Nulla feugiat vitae tellus
          ut posuere. Nunc ac cursus elit. Suspendisse vitae efficitur turpis,
          eu congue tellus. Donec eu vulputate mauris. Donec efficitur, lorem
          vitae consectetur iaculis, nulla leo posuere erat, et auctor odio
          justo sit amet ex. Vestibulum commodo dui quis ipsum ullamcorper
          blandit. Aliquam et ipsum mollis, sodales nibh sed, pharetra tellus.
          Duis cursus aliquam magna eget porttitor. Nullam cursus gravida magna,
          non scelerisque neque sodales eu. Nullam quis tellus sit amet nibh
          tristique vestibulum a vitae lectus. Duis tempus ac neque a venenatis.
          Proin volutpat enim sit amet viverra facilisis. Vestibulum eu dui
          porttitor tellus elementum dapibus. Nam eu dignissim lacus. Duis nibh
          nibh, posuere et sagittis vel, iaculis eu sem. Praesent vel nisl nec
          metus dapibus cursus sed ullamcorper mi. Etiam nulla sem, luctus sit
          amet turpis at, bibendum egestas leo. Etiam eu lorem quis mi bibendum
          dignissim. Mauris vel bibendum mauris, ut faucibus est. Duis pretium
          pretium purus, et interdum urna. Vestibulum justo neque, lobortis id
          maximus id, pulvinar id dolor. Fusce vitae velit sodales, lobortis
          magna quis, convallis erat. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Suspendisse non odio varius, finibus risus non,
          tincidunt velit. Nulla vestibulum lorem pharetra, cursus quam a,
          pellentesque sem. Quisque non urna metus. Pellentesque consequat odio
          sed lacinia tempor. Nunc consequat ipsum diam, vel condimentum mauris
          commodo vitae. Mauris quis ante vel ipsum tempor aliquet at nec leo.
          Maecenas elit eros, scelerisque sit amet tincidunt quis, lacinia
          mollis felis. Sed pellentesque massa leo, porta auctor dolor fermentum
          eget. Nam metus quam, elementum sit amet nibh vel, sodales suscipit
          enim. Donec nec tempus justo. Praesent commodo iaculis rhoncus. Aenean
          a erat vitae velit ultrices euismod. Maecenas mauris purus, molestie
          auctor dignissim a, tincidunt nec metus. Quisque eget diam a ex
          gravida finibus id at tortor. Vestibulum nec bibendum risus. In at
          ligula quis mi sodales laoreet. Sed eu mi et est luctus consectetur.
          Integer quis risus posuere, commodo tortor dictum, sollicitudin arcu.
          Vivamus vitae consequat nisl, quis molestie mauris. Donec volutpat,
          lorem in suscipit lobortis, dolor ante posuere eros, in congue purus
          nulla sit amet tellus. Curabitur nulla dolor, condimentum sit amet
          metus non, tincidunt tempus orci. Integer rhoncus sit amet quam nec
          luctus. Ut id lacinia nulla. Donec finibus nisl id metus viverra, sed
          condimentum nunc tincidunt. Suspendisse ut fermentum sem. Aenean
          mattis sagittis mollis. Cras posuere eros nec odio dignissim accumsan
          eu in sem. Nullam vitae volutpat magna, ut luctus ipsum. Vestibulum
          non suscipit lectus. In semper massa a malesuada tincidunt.
          Pellentesque eu dignissim nulla. In accumsan nulla vel metus suscipit
          tristique. Maecenas iaculis aliquam quam vel scelerisque. Phasellus
          vestibulum cursus nibh sed aliquam. Quisque blandit odio eu felis
          malesuada pharetra. Fusce ut magna in velit maximus dignissim. Aliquam
          ac dignissim nisl. Sed eu eros vel orci ullamcorper lobortis.
          Curabitur auctor faucibus euismod. Nulla suscipit dui mi, tincidunt
          feugiat justo aliquam eu. Vestibulum facilisis ex tellus, eget congue
          justo posuere at. Maecenas pretium efficitur porttitor. Morbi
          tincidunt mauris at mi rutrum, et congue turpis varius. Vivamus
          venenatis augue dolor, at faucibus nibh sodales a. Nullam gravida diam
          odio, ac consequat nisi vulputate quis. Sed quis condimentum sapien.
          Donec mollis sodales gravida. In quis tellus scelerisque, placerat
          velit at, egestas nisi. Fusce sit amet aliquam nunc, ac dignissim
          sapien. Duis vulputate imperdiet vehicula. Mauris faucibus nibh non
          dapibus tempus. Quisque elementum justo pellentesque, rutrum dolor in,
          viverra tellus. Donec ac arcu sed nunc cursus rutrum. Aliquam
          tristique, mi a vehicula faucibus, nibh nisl ullamcorper augue, vitae
          ornare diam massa vitae magna. Duis eget dignissim lectus, ultrices
          semper metus. Vivamus ac auctor odio, ut tristique est. Nunc porta,
          sem quis pretium consequat, ex tellus vulputate sem, vel consequat
          tortor ligula eu sem. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Suspendisse auctor arcu et tellus viverra aliquet.
          Aliquam erat volutpat. Cras euismod pharetra eros, eu vehicula metus
          hendrerit in. Ut facilisis justo nulla, id interdum urna ultrices sit
          amet. Nulla tempus fringilla magna, vel sagittis sapien tincidunt a.
          Praesent eros urna, dictum a ex id, vestibulum maximus felis. Morbi in
          augue purus. Fusce a odio dolor. In et sollicitudin enim. Integer id
          ante odio. Nunc tempor lectus nec sapien porttitor tincidunt. Donec
          congue elit ac congue euismod. Suspendisse mi nisi, placerat nec
          iaculis et, condimentum at eros. Donec ante ante, semper tincidunt
          efficitur eget, bibendum non dolor. Donec lacinia congue malesuada.
          Maecenas dictum orci quam, placerat finibus ligula egestas vel. Duis
          placerat vitae urna eget euismod. Nulla in aliquet diam, at
          scelerisque nunc. Vivamus posuere elementum ultricies. Ut finibus
          consectetur ipsum ut tincidunt. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Proin id diam
          nec dolor cursus sodales quis quis quam. Nullam nibh libero, elementum
          accumsan tempor quis, eleifend nec dolor. Proin pulvinar volutpat
          iaculis. Maecenas laoreet iaculis interdum. Praesent vehicula ipsum
          eget egestas ultricies. Curabitur gravida ex ante, at sollicitudin
          sapien efficitur ac. Sed eget iaculis ante, at consequat massa. Cras
          posuere feugiat lectus ac lacinia. In urna arcu, porta id efficitur
          in, vulputate et ligula. Duis vehicula sagittis arcu, sit amet
          bibendum ipsum cursus in. Nulla commodo tortor volutpat eros imperdiet
          vestibulum. Aenean sed massa justo. In sed vehicula velit. Phasellus
          et vulputate massa. Aliquam aliquet leo quam, et tempus ante accumsan
          ac. Ut rhoncus scelerisque metus, nec molestie nulla condimentum
          vitae. Suspendisse vel purus sodales, mollis odio ut, ornare lorem.
          Sed vestibulum lacus sed lorem maximus consectetur ut ac eros. Duis
          tempor tortor erat, sit amet lacinia turpis ornare a. Proin orci
          lectus, consequat eu leo sit amet, lobortis fringilla risus.
          Suspendisse viverra posuere ex quis tempus. Aenean blandit vel mi at
          dictum. Sed vitae sem blandit, sollicitudin lacus vel, dapibus neque.
          Pellentesque in porta nulla, in tristique turpis. Fusce at vulputate
          metus, vel pellentesque neque. Vestibulum sed varius erat, eleifend
          commodo urna. Sed imperdiet eros sit amet lacus consequat varius.
          Suspendisse sed lobortis leo. Etiam in leo commodo sem luctus bibendum
          et et nunc. Donec semper turpis metus, vel cursus justo condimentum
          at. Donec semper lorem quis quam auctor, in facilisis arcu lacinia.
          Mauris consequat congue lorem nec vehicula. Mauris eu ornare leo.
          Aliquam ac dolor augue. Nulla quis ipsum quis est fringilla tempus
          vitae id odio. Sed bibendum urna lacinia, sagittis urna et, aliquam
          velit. Phasellus ultricies pharetra maximus. Fusce ornare vehicula
          risus, id hendrerit arcu bibendum non. Aenean elit felis, ultricies ut
          elementum sit amet, rhoncus quis nibh. Duis et mauris lectus.
          Curabitur scelerisque ligula arcu, id laoreet sapien aliquam vel.
          Curabitur malesuada dictum quam non lobortis. Praesent aliquet eget
          justo in ornare. Praesent vitae viverra est. Sed pellentesque sem
          efficitur facilisis ullamcorper. Fusce aliquam eget elit at laoreet.
          Etiam vulputate viverra felis, nec viverra ex ultrices eget. Duis
          sagittis vel turpis eget ultricies. In eu ante efficitur, lacinia leo
          sit amet, volutpat est. Phasellus ultricies at erat pharetra
          imperdiet. Donec tincidunt accumsan blandit. Duis placerat, mauris vel
          posuere fermentum, dui tortor bibendum dui, eu scelerisque lectus
          massa sit amet dui. Mauris accumsan feugiat luctus. Phasellus
          ultricies vel ligula sed tempor. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Aliquam varius, dolor a sollicitudin
          pharetra, ipsum lacus fermentum mi, nec tincidunt sapien metus posuere
          erat. Praesent eu nisi magna. Aenean justo nunc, ornare vel risus ut,
          ultricies rhoncus nulla. Aenean eget rhoncus neque. Suspendisse quis
          sollicitudin lectus. Integer tempor convallis facilisis. In tincidunt
          odio libero, vel ullamcorper lorem venenatis sed. Proin congue
          vulputate neque ut sagittis. Praesent quis posuere augue. Pellentesque
          ac rutrum urna. In mattis quam eu tristique accumsan. Aliquam eu
          sapien eu elit ultricies volutpat vitae sed justo. Integer faucibus
          quis turpis sit amet blandit. Orci varius natoque penatibus et magnis
          dis parturient montes, nascetur ridiculus mus. Nunc maximus metus
          eros, eget feugiat ligula congue vitae. Morbi vehicula libero quis
          risus hendrerit volutpat. Nullam tempor nulla luctus tempus
          ullamcorper. Nullam vel est erat. Pellentesque habitant morbi
          tristique senectus et netus et malesuada fames ac turpis egestas. Cras
          et odio nunc. Pellentesque id leo enim. Pellentesque ut elementum
          lorem. Praesent finibus mauris efficitur, tincidunt metus ac, aliquam
          lectus. Ut aliquet dictum leo, eget pellentesque magna interdum vitae.
          Duis condimentum non tellus et fermentum. Cras a finibus neque, a
          pretium augue. In semper erat nunc, eget imperdiet quam iaculis ac.
          Nam iaculis risus et dui semper auctor. Phasellus eu nisl dapibus,
          mollis justo id, rhoncus odio. Cras sed arcu id velit aliquam tempus.
          Vestibulum id porttitor enim, at facilisis quam. Donec accumsan quis
          eros euismod sollicitudin. Etiam sapien orci, tempus a nisl
          sollicitudin, mollis viverra risus. Integer varius erat eget justo
          fermentum mattis. Phasellus venenatis libero et sapien rhoncus
          ultrices. Quisque id magna eget tellus vehicula scelerisque. Duis eget
          ornare elit, ac accumsan sapien. Maecenas eget eros quis sem egestas
          sodales id vitae orci. Interdum et malesuada fames ac ante ipsum
          primis in faucibus. Donec maximus libero elit, fermentum varius sem
          cursus ut. Donec porttitor, nibh in iaculis tristique, nunc eros
          elementum mi, vitae tristique est quam ut est. Nullam vitae elit id
          turpis vehicula lobortis ut vitae odio. Maecenas nec feugiat augue,
          vitae sodales nulla. Morbi blandit, nulla at vulputate pulvinar, sem
          nunc pulvinar neque, vel rhoncus metus eros non urna. In accumsan
          purus sapien, in pharetra leo vestibulum sagittis. Ut sed elit non
          quam vulputate scelerisque eget ut erat. Nam id pretium lorem, non
          accumsan massa. Proin ornare mi vel tortor auctor auctor. Fusce
          interdum efficitur ipsum nec luctus. Curabitur viverra vitae mi in
          scelerisque. Donec at pellentesque nisi. Duis feugiat, nulla sed
          commodo egestas, tortor tellus malesuada nisl, eu tempus ligula erat
          ut lorem.
        </div>
      </NooketDocContainer>
    );
  }
}

export default NooketDoc;
