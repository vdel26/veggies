/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

const React = require('react-native');
const LinearGradient = require('react-native-linear-gradient');
const Dimensions = require('Dimensions');

const {
  Animated,
  AppRegistry,
  Easing,
  InteractionManager,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = React;

const {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

const mockFruits = [
  'Apples',
  'Pears',
  'Oranges',
  'Pomelo',
  'Strawberries',
  'Kiwi',
  'Grapes',
  'Apricot',
  'Pomelo',
  'Strawberries',
  'Kiwi',
  'Grapes',
  'Apricot'
];
const mockVeggies = [
  'Celery',
  'Broccoli',
  'Cauliflower',
  'Kale',
  'Pumpkin',
  'Squash',
  'Mushroom',
  'Carrots',
  'Pumpkin',
  'Squash',
  'Mushroom',
  'Carrots'
];

const pages = {
  VEGGIES: {
    title: 'Veggies in Season Now',
    buttonText: 'Fruits',
    buttonTextColor: 'rgb(43, 116, 101)',
    titleColor: 'rgb(252, 179, 101)',
    itemColor: 'rgb(255, 255, 255)'
  },
  FRUITS: {
    title: 'Fruits in Season Now',
    buttonText: 'Veggies',
    buttonTextColor: 'rgb(255, 255, 255)',
    titleColor: 'rgb(19, 38, 29)',
    itemColor: 'rgb(43, 116, 101)'
  }
};

var Veggies = React.createClass({
  getInitialState: function() {
    return {
      loaded: false,
      page: 'veggies',
      title: 'Veggies in Season Now',
      circleScale: new Animated.Value(0),
      transition: new Animated.Value(0),
      listScale: new Animated.Value(0)
    };
  },
  componentDidMount: function () {
    this.state.circleScale.setValue(0.5);
    this.state.listScale.setValue(1);
    this.state.transition.setValue(0);

    this._itemColor = this.state.transition.interpolate({
        inputRange: [0, 1],
        outputRange: [pages.VEGGIES.itemColor, pages.FRUITS.itemColor]
    });
    this._titleColor = this.state.transition.interpolate({
        inputRange: [0, 1],
        outputRange: [pages.VEGGIES.titleColor, pages.FRUITS.titleColor]
    });
    this._buttonTextColor = this.state.transition.interpolate({
        inputRange: [0, 1],
        outputRange: [pages.VEGGIES.buttonTextColor, pages.FRUITS.buttonTextColor]
    });

    this.setState({
      loaded: true
    });
  },
  _onPressButton: function () {
    this._animateListInOut();
    if (this.state.page === 'veggies') {
      this._transition();
      Animated.spring(this.state.circleScale,
        {
          toValue: 22,
          friction: 6
        }
      ).start();
      this.setState({
        page: 'fruits',
      });
    }
    else {
      this._transition(true);
      Animated.timing(this.state.circleScale,
        {
          toValue: 0.5,
          duration: 400
        }
      ).start();
      this.setState({
        page: 'veggies',
      });
    }
  },
  _animateListInOut: function () {
    // Animated.sequence([
    //   Animated.spring(this.state.listScale, {
    //     toValue: 0.2
    //   }),
    //   Animated.spring(this.state.listScale, {
    //     toValue: 1
    //   })
    // ]).start();
  },
  _transition: function (reverse = false) {
    let toValue = reverse ? 0 : 1;
    Animated.timing(this.state.transition, {
      duration: 250,
      toValue: toValue
    }).start();
  },
  render: function() {

    return (
      <LinearGradient colors={['#2B7465', '#3CAA6B']}
                      style={styles.linearGradient}
                      start={[0.0, 0.25]} end={[0.5, 1.0]}>

        <View style={styles.container}>
          <Animated.View style={[
              styles.circleBg,
              {transform: [ {scale: this.state.circleScale} ]}
            ]}>
              <LinearGradient colors={['#CFFFA8', '#EAF2F0']}
                              style={styles.linearGradient}
                              start={[0.0, 0.25]} end={[0.5, 1.0]}>
              </LinearGradient>
          </Animated.View>

          <View style={styles.navBar}>
            <Animated.Text style={[styles.title, { color: this._titleColor }]}>
              { this.state.page === 'veggies' ? pages.VEGGIES.title : pages.FRUITS.title }
            </Animated.Text>
          </View>

          <ListsContainer itemColor={this._itemColor}
                   page={this.state.page}
                   listScale={this.state.listScale}
                   list1={mockVeggies}
                   list2={mockFruits} />

          <Button onPressButton={this._onPressButton}
                  itemColor={this._itemColor}
                  buttonTextColor={this._buttonTextColor}
                  page={this.state.page} />

        </View>
      </LinearGradient>
    );
  }
});

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

var Button = React.createClass({
  render: function () {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity activeOpacity={0.75} onPress={this.props.onPressButton}>
          <Animated.View style={[styles.button, { backgroundColor: this.props.itemColor }]}>
            <Animated.Text style={[ styles.buttonText, { color: this.props.buttonTextColor }]}>
              { this.props.page === 'veggies' ? pages.VEGGIES.buttonText : pages.FRUITS.buttonText }
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  navBar: {
    paddingTop: 30,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FCB365'
  },
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
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 64,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  button: {
    borderRadius: 22,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#2B7465',
    fontSize: 17,
    fontWeight: 'bold'
  },
  circleBg: {
    position: 'absolute',
    bottom: 12,
    left: (deviceWidth/2) - 30,
    backgroundColor: 'red',
    width: 60,
    height: 60,
    elevation: 1,
    borderRadius: 30,
    overflow: 'hidden'
  }
});

AppRegistry.registerComponent('Veggies', () => Veggies);
