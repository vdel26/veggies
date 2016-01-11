'use strict';

const React = require('react-native');
const LinearGradient = require('react-native-linear-gradient');
const Dimensions = require('Dimensions');
const Parse = require('parse/react-native');
const ParseReact = require('parse-react/react-native');

Parse.initialize('qPC9Rp7iB6Nz0ikjvwP8EwUuDtTD4cf5Nk4yGwcB', '5bHa7HWvR2xmtoxvIstnzoLJqBzTDHHICNDRIiaR');

const {
  Animated,
  AppRegistry,
  Easing,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = React;

const ListsContainer = require('./js/ListsContainer');
const Button = require('./js/Button');
const settings = require('./js/settings');

const mockVeggies = settings.mockVeggies;
const mockFruits = settings.mockFruits;
const pages = settings.pages;

const {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

var Veggies = React.createClass({
  // mixins: [ParseReact.Mixin],

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

  // observe: function(props, state) {
  //   return {
  //     items: new Parse.Query('Veggies')
  //   };
  // },
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

    this._fetchData(this._getCurrentMonth());

    this.setState({
      loaded: true
    });
  },
  _fetchData: function (month) {
    var collection = Parse.Object.extend('Veggies');
    var query = new Parse.Query(collection);
    query.equalTo('bestMonths', month);

    var onError = (error) => console.log("Error: " + error.code + " " + error.message);
    var onSuccess = (results) => {
      var fruitsList = results.filter((item) => item.get('type') === 'fruit');
      var veggiesList = results.filter((item) => item.get('type') === 'veggie');
      fruitsList.forEach((item) => console.log(item.get('name')));
      veggiesList.forEach((item) => console.log(item.get('name')));
    };

    query.find().then(onSuccess, onError);
  },
  _getCurrentMonth: function () {
    var today = new Date();
    var month = today.toLocaleString('en-us', { month: 'long' }).toLowerCase();
    return month;
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
                          list1={settings.mockVeggies}
                          list2={settings.mockFruits} />

          <Button onPressButton={this._onPressButton}
                  itemColor={this._itemColor}
                  buttonTextColor={this._buttonTextColor}
                  page={this.state.page} />

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
