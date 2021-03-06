'use strict';

import React from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-spinkit';
import Dimensions from 'Dimensions';
import Parse from 'parse/react-native';
import Button from './js/Button';
import AppNavigator from './js/AppNavigator';
import { pages, MONTHS } from './js/constants';

Parse.initialize('qPC9Rp7iB6Nz0ikjvwP8EwUuDtTD4cf5Nk4yGwcB', '5bHa7HWvR2xmtoxvIstnzoLJqBzTDHHICNDRIiaR');

const {
  Animated,
  AppRegistry,
  Easing,
  InteractionManager,
  Navigator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = React;

const {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      page: 'veggies',
      title: pages.VEGGIES.title,
      circleScale: new Animated.Value(0),
      transition: new Animated.Value(0),
      hideButton: false,
      pageData: []
    };

    // pre-bind methods to avoid creating new instances every time
    this._onPressButton = this._onPressButton.bind(this);
    this._slideUpButton = this._slideUpButton.bind(this);
    this._slideDownButton = this._slideDownButton.bind(this);
  }

  componentDidMount() {
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
    this._circleOpacity = this.state.circleScale.interpolate({
      inputRange: [0.5, 10],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    this._fetchData(this._getCurrentMonth().toLowerCase());
  }

  _fetchData(month) {
    const collection = Parse.Object.extend('Veggies');
    const query = new Parse.Query(collection);
    query.equalTo('bestMonths', month);

    // data will not change, so we do not need it as state
    this.data = this.data || {};

    // TODO: error state
    const onError = (error) => console.log("Error: " + error.code + " " + error.message);
    const onSuccess = (results) => {
      this.data.fruitsList = results.filter((item) => item.get('type') === 'fruit')
                                    .map((item) => item.get('name'));
      this.data.veggiesList = results.filter((item) => item.get('type') === 'veggie')
                                     .map((item) => item.get('name'));

      setTimeout(() => this.setState({
        loaded: true,
        pageData: this.data.veggiesList }),
      1000);
    };

    query.find().then(onSuccess, onError);
  }

  _getCurrentMonth() {
    const currentMonth = (new Date()).getMonth();
    return MONTHS[currentMonth];
  }

  _onPressButton() {
    if (this.state.page === 'veggies') {
      this._transition();
      Animated.timing(this.state.circleScale,
        {
          toValue: 25,
          duration: 400,
          easing: Easing.inOut(Easing.cubic)
        }
      ).start();
      this.setState({ page: 'fruits' });
      InteractionManager.runAfterInteractions(() => {
        this.setState({ pageData: this.data.fruitsList });
      });
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
      InteractionManager.runAfterInteractions(() => {
        this.setState({ pageData: this.data.veggiesList });
      });
    }
  }

  _slideDownButton() {
    this.setState({ hideButton: true });
  }

  _slideUpButton() {
    this.setState({ hideButton: false });
  }

  _transition(reverse = false) {
    let toValue = reverse ? 0 : 1;
    Animated.timing(this.state.transition, {
      duration: 250,
      toValue: toValue
    }).start();
  }

  _renderLoading() {
    const title = this._getCurrentMonth();

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
  }

  _renderContent() {
    return (
      <View style={styles.container}>
        <Animated.View style={[
            styles.circleBg,
            {
              transform: [ {scale: this.state.circleScale} ],
              opacity: this._circleOpacity
            }
          ]}>
            <LinearGradient colors={['#CFFFA8', '#EAF2F0']}
                            style={styles.linearGradient}
                            start={[0.0, 0.25]} end={[0.5, 1.0]}>
            </LinearGradient>
        </Animated.View>

        <AppNavigator itemColor={this._itemColor}
                      listData={this.state.pageData}
                      page={this.state.page}
                      onRoutePop={this._slideUpButton}
                      onRoutePush={this._slideDownButton} />

        <Button onPressButton={this._onPressButton}
                itemColor={this._itemColor}
                buttonTextColor={this._buttonTextColor}
                page={this.state.page}
                hidden={this.state.hideButton} />
      </View>
    );
  }

  render() {
    const content = this.state.loaded ?
                    this._renderContent() :
                    this._renderLoading();

    return (
      <LinearGradient colors={['#2B7465', '#3CAA6B']}
                      style={styles.linearGradient}
                      start={[0.0, 0.0]} end={[1.0, 1.0]}>
        { content }
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
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
  navBarText: {
    marginVertical: 10
  },
  navTitle:{
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FCB365'
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

AppRegistry.registerComponent('Veggies', () => Main);
