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
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
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
        outputRange: ['rgb(255, 255, 255)', 'rgb(43, 116, 101)']
    });
    this._titleColor = this.state.transition.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(252, 179, 101)', 'rgb(19, 38, 29)']
    });
    this._buttonTextColor = this.state.transition.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(43, 116, 101)', 'rgb(255, 255, 255)']
    });

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(mockVeggies),
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
        dataSource: this.state.dataSource.cloneWithRows(mockFruits)
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
        dataSource: this.state.dataSource.cloneWithRows(mockVeggies)
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
  renderItem: function (item) {
    return (
      <View style={styles.item}>
        <Animated.Text style={[styles.itemText, { color: this._itemColor }]}>{ item }</Animated.Text>
      </View>
    );
  },
  render: function() {
    var AnimatedListView = Animated.createAnimatedComponent(ListView);
    return (
      <LinearGradient colors={['#2B7465', '#3CAA6B']}
                      style={styles.linearGradient}
                      start={[0.0, 0.25]} end={[0.5, 1.0]}>

        <View style={styles.container}>
          <Animated.View style={[
              styles.circleBg,
              {transform: [ {scale: this.state.circleScale} ], overflow: 'hidden'}
            ]}>
              <LinearGradient colors={['#CFFFA8', '#EAF2F0']}
                              style={styles.linearGradient}
                              start={[0.0, 0.25]} end={[0.5, 1.0]}>
              </LinearGradient>
          </Animated.View>

          <View style={styles.navBar}>
            <Animated.Text style={[styles.title, { color: this._titleColor }]}>
              { this.state.page === 'veggies' ? 'Veggies in Season Now' : 'Fruits in Season Now' }
            </Animated.Text>
          </View>

          <AnimatedListView
            dataSource={this.state.dataSource}
            renderRow={this.renderItem}
            style={[styles.listView, { transform: [{scale: this.state.listScale}]} ]}
          />

          <View style={styles.tabBar}>
            <TouchableOpacity activeOpacity={0.75} onPress={this._onPressButton}>
              <Animated.View style={[styles.button, { backgroundColor: this._itemColor }]}>
                <Animated.Text style={[ styles.buttonText, { color: this._buttonTextColor }]}>
                  { this.state.page === 'veggies' ? 'Fruits' : 'Veggies' }
                </Animated.Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

        </View>
      </LinearGradient>
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
  listView: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: 'transparent'
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
    borderRadius: 30
  }
});

AppRegistry.registerComponent('Veggies', () => Veggies);
