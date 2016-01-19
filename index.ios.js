'use strict';

const React = require('react-native');
const LinearGradient = require('react-native-linear-gradient');
const Spinner = require('react-native-spinkit');
const Dimensions = require('Dimensions');
const Parse = require('parse/react-native');
const ParseReact = require('parse-react/react-native');

Parse.initialize('qPC9Rp7iB6Nz0ikjvwP8EwUuDtTD4cf5Nk4yGwcB', '5bHa7HWvR2xmtoxvIstnzoLJqBzTDHHICNDRIiaR');

const {
  Animated,
  AppRegistry,
  Easing,
  StyleSheet,
  Text,
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

  getInitialState: function() {
    return {
      loaded: false,
      page: 'veggies',
      title: pages.VEGGIES.title,
      circleScale: new Animated.Value(0),
      transition: new Animated.Value(0)
    };
  },

  componentDidMount: function () {
    this.state.circleScale.setValue(0.5);
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

    this._fetchData(this._getCurrentMonth().toLowerCase());
  },

  _fetchData: function (month) {
    var collection = Parse.Object.extend('Veggies');
    var query = new Parse.Query(collection);
    query.equalTo('bestMonths', month);

    // data will not change, so we do not need it as state
    this.data = this.data || {};

    // TODO: error state
    var onError = (error) => console.log("Error: " + error.code + " " + error.message);
    var onSuccess = (results) => {
      this.data.fruitsList = results.filter((item) => item.get('type') === 'fruit')
                                    .map((item) => item.get('name'));
      this.data.veggiesList = results.filter((item) => item.get('type') === 'veggie')
                                     .map((item) => item.get('name'));

      setTimeout(() => this.setState({ loaded: true }), 1000);
    };

    query.find().then(onSuccess, onError);
  },

  _getCurrentMonth: function () {
    const MONTHS = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    var currentMonth = (new Date()).getMonth();
    return MONTHS[currentMonth];
  },

  _onPressButton: function () {
    if (this.state.page === 'veggies') {
      this._transition();
      Animated.timing(this.state.circleScale,
        {
          toValue: 22,
          duration: 400,
          easing: Easing.inOut(Easing.cubic)
        }
      ).start();
      this.setState({ page: 'fruits' });
    }
    else {
      this._transition(true);
      Animated.timing(this.state.circleScale,
        {
          toValue: 0.5,
          duration: 300,
          easing: Easing.inOut(Easing.cubic)
        }
      ).start();
      this.setState({ page: 'veggies' });
    }
  },

  _transition: function (reverse = false) {
    let toValue = reverse ? 0 : 1;
    Animated.timing(this.state.transition, {
      duration: 250,
      toValue: toValue
    }).start();
  },

  _renderLoading: function() {
    var title = this._getCurrentMonth();

    return (
      <View style={[styles.loadingContainer]}>
        <Text style={{
            backgroundColor: 'transparent',
            color: '#FFF',
            fontWeight: '500',
            fontSize: 17,
            width: 220,
            textAlign: 'center' }}>
          Loading vegetables and fruits in season in <Text style={{ fontWeight: '800' }}>{ title }</Text>
        </Text>
        <Spinner style={{ marginTop: 40 }} isVisible={true} size={60} type='Bounce' color='#FFFFFF'/>
      </View>
    );
  },

  _renderContent: function() {
    var listData = this.state.page === 'veggies' ? this.data.veggiesList : this.data.fruitsList;

    return (
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
                        list1={listData} />

        <Button onPressButton={this._onPressButton}
                itemColor={this._itemColor}
                buttonTextColor={this._buttonTextColor}
                page={this.state.page} />
      </View>
    );
  },

  render: function() {
    var content = (() => {
      return this.state.loaded ? this._renderContent() : this._renderLoading();
    })();

    return (
      <LinearGradient colors={['#2B7465', '#3CAA6B']}
                      style={styles.linearGradient}
                      start={[0.0, 0.25]} end={[0.5, 1.0]}>
        { content }
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
  loadingContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
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
