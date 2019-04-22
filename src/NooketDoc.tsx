import * as React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { IViewPluginProps, InstanceViewModeEnum } from 'nooket-common';
import { Input } from 'antd';
import * as Fuse from 'fuse.js';
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

  &.menu-selected {
    color: #1890ff;
    font-weight: 500;
    border-right: 3px #1890ff solid;
  }

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

  .highlight {
    background-color: yellow;
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
  sanitizedTitle: string;
  order: number;
}

interface ISortableListProps {
  items: IMenuItem[];
  selectedId: string;
  searchResults: any;
  onClick: (id: string) => void;
}

interface ISortableItemProps {
  value: IMenuItem;
  isSelected: boolean;
  searchWords: string[];
  onClick: (id: string) => void;
}

const fuzeOptions = {
  shouldSort: true,
  tokenize: true,
  matchAllTokens: true,
  findAllMatches: true,
  includeMatches: true,
  threshold: 0.0,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ['sanitizedTitle'],
};
const DragHandle = SortableHandle(() => <div className="drag-handle" />);

const Highlight = ({ text, words }) => (
  <React.Fragment>
    {[...text].map((c, i) => {
      const highlight = words.find(a => i >= a[0] && i <= a[1]);
      return (
        <span key={`${i}`} className={classNames({ highlight })}>
          {c}
        </span>
      );
    })}
  </React.Fragment>
);

const sanitizeText = text =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const SortableItem = SortableElement(
  ({ value, onClick, isSelected, searchWords }: ISortableItemProps) => {
    return (
      <ListElementContainer
        className={classNames({ 'menu-selected': isSelected })}
        onClick={() => onClick(value._id)}
      >
        <DragHandle />
        &nbsp;
        {searchWords ? (
          <Highlight text={value.title} words={searchWords} />
        ) : (
          value.title
        )}
      </ListElementContainer>
    );
  }
);

const SortableList = SortableContainer(
  ({ items, selectedId, onClick, searchResults }: ISortableListProps) => {
    return (
      <React.Fragment>
        {items.map((value, index) => (
          <SortableItem
            key={value._id}
            isSelected={value._id === selectedId}
            index={index}
            value={value}
            onClick={onClick}
            searchWords={searchResults[value._id]}
          />
        ))}
      </React.Fragment>
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
    idx: null,
    searchTerm: null,
    filteredItems: null,
    searchResults: {},
  };

  public static getDerivedStateFromProps(nextProps, currentState) {
    const {
      data,
      view: { state },
      fetchTimestamp,
    } = nextProps;

    const { container, lastFetchTimestamp } = currentState;
    let {
      selectedId,
      instanceView,
      items,
      idx,
      searchTerm,
      filteredItems,
      searchResults,
    } = currentState;

    if (lastFetchTimestamp !== fetchTimestamp) {
      const viewState = state || { instanceOrder: {} };
      searchTerm = null;
      filteredItems = null;
      searchResults = {};
      items = NooketDoc.getSortedData(data, viewState);
      idx = new Fuse(items, fuzeOptions);
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
      idx,
      searchTerm,
      filteredItems,
      searchResults,
    };
  }

  private setContainerNode = node => {
    this.setState({ container: node });
  };

  private handelOnChangeSearch = e => {
    const { value } = e.target;
    const { idx, items } = this.state;

    let filteredItems = items;
    const searchResults = {};

    const searchTerm = value;
    const sanitizedText = sanitizeText(value.trim());

    if (sanitizedText !== '') {
      const results = idx.search(sanitizedText);
      if (results) {
        filteredItems = [];
        results.forEach(r => {
          if (r.matches.length > 0) {
            filteredItems.push(r.item);
            const indices = [];
            r.matches.forEach(m => indices.push(...m.indices));
            searchResults[r.item._id] = indices;
          }
        });
      }
    } else {
      filteredItems = null;
    }

    this.setState({
      searchTerm,
      filteredItems,
      searchResults,
    });
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
        sanitizedTitle: sanitizeText(instance.title),
        order: viewState.instanceOrder[instance._id] || MIN_ORDER,
      });
    });

    return res.sort((item1, item2) => item1.order - item2.order);
  }

  public render() {
    const {
      instanceView,
      selectedId,
      items,
      filteredItems,
      container,
      searchTerm,
      searchResults,
    } = this.state;

    return (
      <NooketDocContainer ref={this.setContainerNode}>
        <div className="doc-index">
          <div className="menu">
            <Input
              placeholder="search"
              onChange={this.handelOnChangeSearch}
              style={{ margin: 6, width: 'calc(100% - 12px)' }}
              value={searchTerm}
            />
            <SortableList
              items={filteredItems || items}
              selectedId={selectedId}
              onSortEnd={this.handleSortEnd}
              hideSortableGhost={true}
              useDragHandle={true}
              onClick={this.handleMenuClick}
              helperContainer={container}
              helperClass="helper-class"
              lockAxis="y"
              searchResults={searchResults}
            />
          </div>
        </div>
        <div className="doc-body plugin-scroll-panel">{instanceView}</div>
      </NooketDocContainer>
    );
  }
}

export default NooketDoc;
