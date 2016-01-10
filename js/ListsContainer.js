const React = require('react-native');

const {
  Animated,
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
      dataSource2: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },
  componentDidMount: function () {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.list1),
      dataSource2: this.state.dataSource.cloneWithRows(this.props.list2)
    });
  },
  _renderItem: function (item) {
    return (
      <View style={styles.item}>
        <Animated.Text style={[styles.itemText, { color: this.props.itemColor }]}>{ item }</Animated.Text>
      </View>
    );
  },
  render: function () {
    var AnimatedListView = Animated.createAnimatedComponent(ListView);

    if (this.props.page === 'veggies') {
      return (
        <View style={styles.listContainer}>
          <AnimatedListView
            dataSource={this.state.dataSource2}
            renderRow={this._renderItem}
            style={[styles.listView, { opacity: 0 } ]}
          />
          <AnimatedListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem}
            style={[styles.listView, { opacity: 1 } ]}
          />
        </View>
      )
    }
    else {
      return (
        <View style={styles.listContainer}>
          <AnimatedListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem}
            style={[styles.listView, { opacity: 0 } ]}
          />
          <AnimatedListView
            dataSource={this.state.dataSource2}
            renderRow={this._renderItem}
            style={[styles.listView, { opacity: 1 } ]}
          />
        </View>
      );
    }
  }
});

var styles = StyleSheet.create({
  listContainer: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: 'transparent',
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