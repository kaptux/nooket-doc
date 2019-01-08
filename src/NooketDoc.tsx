import * as React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {
  IViewPluginProps,
  IUser,
  ICategory,
  RuleTypeEnum,
  InstanceViewModeEnum,
} from 'nooket-common';
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

  .doc-index {
    height: calc(100vh - 70px);
    width: 250px;
    position: fixed;

    .menu {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }

  .doc-body {
    flex: 1;
    padding-left: 250px;
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
        className={classNames('menu-item', { 'menu-selected': isSelected })}
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
  public render() {
    const { instanceView, selectedId } = this.state;
    const items = this.getSortedData();

    return (
      <NooketDocContainer>
        <div className="doc-index">
          <SortableList
            items={items}
            selectedId={selectedId}
            onSortEnd={this.handleSortEnd}
            hideSortableGhost={true}
            useDragHandle={true}
            onClick={this.handleMenuClick}
          />
        </div>
        <div className="doc-body">{instanceView}</div>
      </NooketDocContainer>
    );
  }
}

export default NooketDoc;
