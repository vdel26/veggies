'use strict';

import React from 'react-native';

const {
  Animated,
  Easing,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  PropTypes,
  View,
} = React;

class ListsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      scale: new Animated.Value(1)
    };
    // pre-bind methods to avoid creating new instances every time
    this._renderItem = this._renderItem.bind(this);
    this._seeDetail = this._seeDetail.bind(this);
  }

  componentDidMount() {
    this.opacity = this.state.scale.interpolate({
        inputRange: [0.9, 1],
        outputRange: [0, 1]
    });
    this.state.scale.setValue(0.9);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.listData),
    });

    Animated.timing(this.state.scale,
      {
        toValue: 1,
        duration: 300,
        delay: 500,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      this._animateListOut();
    }
    if (nextProps.listData !== this.props.listData) {
      this._animateListIn();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.listData),
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only render when data has changed (this.props.listData)
    // keep this.props.page as a trigger for animations but
    // do not re render when it changes
    if (nextState.dataSource !== this.state.dataSource) return true;
    return false;
  }

  _animateListIn() {
    Animated.timing(this.state.scale,
      {
        toValue: 1,
        duration: 250,
        easing: Easing.inOut(Easing.cubic),
        delay: 250
      }
    ).start();
  }

  _animateListOut() {
    Animated.timing(this.state.scale,
      {
        toValue: 0.9,
        duration: 150,
        easing: Easing.inOut(Easing.cubic)
      }
    ).start();
  }

  _seeDetail(item) {
    this.props.seeDetail(item);
  }

  _renderItem(item) {
    return (
      <TouchableOpacity style={styles.item} activeOpacity={0.6} onPress={() => this._seeDetail(item)}>
        <Animated.Text style={[styles.itemText, { color: this.props.itemColor }]}>{ item }</Animated.Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Animated.View style={[styles.listContainer, { opacity: this.opacity, transform: [{ scale: this.state.scale }] } ]}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem}
          initialListSize={1}
          style={styles.listView}
          automaticallyAdjustContentInsets={false}
          contentInset={{ top: 30, bottom: 60 }}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  listView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  item: {
    height: 64,
    paddingLeft: 60
  },
  itemText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF'
  }
});

ListsContainer.propTypes = {
  itemColor: PropTypes.object.isRequired,
  listData: PropTypes.array.isRequired,
  page: PropTypes.string.isRequired
};

export default ListsContainer;
