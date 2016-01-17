'use strict';

const React = require('react-native');

const {
  Animated,
  Easing,
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

var ListsContainer = React.createClass({
  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      scale: new Animated.Value(1)
    };
  },
  componentDidMount: function () {
    this.opacity = this.state.scale.interpolate({
        inputRange: [0.9, 1],
        outputRange: [0, 1]
    });
  },
  componentWillReceiveProps: function(nextProps) {
    // skip list swapping animation on first load
    if (this.state.dataSource.getRowCount() > 0) {
      this._animateListInOut();
    }

    // delay replacing list data, to allow animation to start
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.list1),
      });
    }, 50);
  },
  _animateListInOut: function() {
    Animated.sequence([
      Animated.timing(this.state.scale,
        {
          toValue: 0.9,
          duration: 150,
          easing: Easing.inOut(Easing.cubic)
        }
      ),
      Animated.timing(this.state.scale,
        {
          toValue: 1,
          duration: 250,
          easing: Easing.inOut(Easing.cubic),
          delay: 250
        }
      )
    ]).start();
  },
  _renderItem: function (item) {
    return (
      <View style={styles.item}>
        <Animated.Text style={[styles.itemText, { color: this.props.itemColor }]}>{ item }</Animated.Text>
      </View>
    );
  },
  render: function () {
    return (
      <Animated.View style={[styles.listContainer, { opacity: this.opacity, transform: [{ scale: this.state.scale }] } ]}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem}
          style={styles.listView}
        />
      </Animated.View>
    );
  }
});

var styles = StyleSheet.create({
  listContainer: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: 'transparent'
  },
  listView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingBottom: 16
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

module.exports = ListsContainer;