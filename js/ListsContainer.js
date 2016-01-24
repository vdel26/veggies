'use strict';

import React from 'react-native';

const {
  Animated,
  Easing,
  ListView,
  StyleSheet,
  Text,
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
    // animate list swapping
    this._animateListInOut();

    // delay replacing list data, to allow animation to start
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.listData),
      });
    }, 50);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.dataSource !== this.state.dataSource) return true;
    return false;
  }

  _animateListInOut() {
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
  }

  _renderItem(item) {
    return (
      <View style={styles.item}>
        <Animated.Text style={[styles.itemText, { color: this.props.itemColor }]}>{ item }</Animated.Text>
      </View>
    );
  }

  render() {
    return (
      <Animated.View style={[styles.listContainer, { opacity: this.opacity, transform: [{ scale: this.state.scale }] } ]}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          initialListSize={1}
          style={styles.listView}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
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

ListsContainer.propTypes = {
  itemColor: PropTypes.object.isRequired,
  listData: PropTypes.array.isRequired
};

export default ListsContainer;
