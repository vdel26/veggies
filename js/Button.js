'use strict';

import React from 'react-native';
import { pages } from './constants';

const {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  PropTypes,
  View,
} = React;

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      translateY: new Animated.Value(0)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hidden === this.props.hidden) return;
    if (nextProps.hidden) {
      Animated.timing(this.state.translateY,
        {
          toValue: 200,
          duration: 250,
          easing: Easing.inOut(Easing.cubic)
        }
      ).start();
    }
    else {
      Animated.timing(this.state.translateY,
        {
          toValue: 0,
          duration: 250,
          easing: Easing.inOut(Easing.cubic)
        }
      ).start();
    }
  }

  render() {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity activeOpacity={0.9} onPress={this.props.onPressButton}>
          <Animated.View style={[styles.button,
                                { backgroundColor: this.props.itemColor },
                                { transform: [ { translateY: this.state.translateY }]}
                               ]}>
            <Animated.Text style={[ styles.buttonText, { color: this.props.buttonTextColor }]}>
              { this.props.page === 'veggies' ? pages.VEGGIES.buttonText : pages.FRUITS.buttonText }
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  }
});

Button.propTypes = {
  onPressButton: PropTypes.func.isRequired,
  itemColor: PropTypes.object.isRequired,
  page: PropTypes.string.isRequired,
  buttonTextColor: PropTypes.object.isRequired,
  hidden: PropTypes.bool.isRequired
};

export default Button;
