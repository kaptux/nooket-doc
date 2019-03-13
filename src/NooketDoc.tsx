import * as React from 'react';
import styled from 'styled-components';
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
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50' xml:space='preserve'%3E %3Cpath color='rgb(0, 0, 0)' d='M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z'/%3E %3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.25;
    margin-right: 5px;
    cursor: row-resize;
  }

  &.menu-selected {
    color: #1890ff;
    font-weight: 500;
    border-right: 3px #1890ff solid;
  }
`;

const NooketDocContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  .doc-index {
    position: relative;
    width: 250px;
    position: relative;
    height: 100%;

    .menu {
      overflow: auto;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      background-color: #eee;
      margin-top: 16px;
      margin-left: 16px;
      margin-bottom: 16px;
    }
  }

  .menu::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    background-color: #eee;
  }
  .menu::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 5px;
  }

  .doc-body {
    flex: 1;
    overflow: auto;
    padding-right: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .helper-class {
    z-index: 100000;
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2),
      0 -5px 5px -5px rgba(0, 0, 0, 0.2);
    background-color: #eee;
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
    items: null,
    selectedId: null,
    instanceView: null,
    container: null,
    lastFetchTimestamp: null,
  };

  public static getDerivedStateFromProps(nextProps, currentState) {
    const {
      data,
      view: { state },
      fetchTimestamp,
    } = nextProps;

    const { container, lastFetchTimestamp } = currentState;
    let { selectedId, instanceView, items } = currentState;

    if (lastFetchTimestamp !== fetchTimestamp) {
      const viewState = state || { instanceOrder: {} };
      items = NooketDoc.getSortedData(data, viewState);
    }

    if (!selectedId && data.length > 0) {
      selectedId = items[0]._id;
      instanceView = nextProps.onRequestInstanceView(
        InstanceViewModeEnum.INLINE,
        selectedId
      );
    }

    return {
      items,
      selectedId,
      instanceView,
      container,
      lastFetchTimestamp: fetchTimestamp,
    };
  }

  private setContainerNode = node => {
    this.setState({ container: node });
  };

  private handleSortEnd = ({ oldIndex, newIndex }) => {
    const { onSaveState } = this.props;
    const { items } = this.state;

    const instanceOrder = {};
    const newOrderedItems = arrayMove(items, oldIndex, newIndex) as IMenuItem[];
    newOrderedItems.forEach((item, index) => {
      instanceOrder[item._id] = index;
    });

    this.setState({ items: newOrderedItems });
    onSaveState({ instanceOrder });
  };

  private handleMenuClick = id => {
    const { onRequestInstanceView } = this.props;
    this.setState({
      selectedId: id,
      instanceView: onRequestInstanceView(InstanceViewModeEnum.INLINE, id),
    });
  };

  private static getSortedData(data, viewState): IMenuItem[] {
    const res: IMenuItem[] = [];

    data.forEach(instance => {
      res.push({
        _id: instance._id,
        title: instance.title,
        order: viewState.instanceOrder[instance._id] || MIN_ORDER,
      });
    });

    return res.sort((item1, item2) => item1.order - item2.order);
  }

  public render() {
    const { instanceView, selectedId, items, container } = this.state;

    return (
      <NooketDocContainer ref={this.setContainerNode}>
        <div className="doc-index">
          <SortableList
            items={items}
            selectedId={selectedId}
            onSortEnd={this.handleSortEnd}
            hideSortableGhost={true}
            useDragHandle={true}
            onClick={this.handleMenuClick}
            helperContainer={container}
            helperClass="helper-class"
            lockAxis="y"
          />
        </div>
        <div className="doc-body plugin-scroll-panel">{instanceView}</div>
      </NooketDocContainer>
    );
  }
}

export default NooketDoc;
