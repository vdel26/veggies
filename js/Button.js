'use strict';

import React from 'react-native';
import { pages } from './constants';

const {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  PropTypes,
  View,
} = React;

class Button extends React.Component {
  render() {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity activeOpacity={0.9} onPress={this.props.onPressButton}>
          <Animated.View style={[styles.button, { backgroundColor: this.props.itemColor }]}>
            <Animated.Text style={[ styles.buttonText, { color: this.props.buttonTextColor }]}>
              { this.props.page === 'veggies' ? pages.VEGGIES.buttonText : pages.FRUITS.buttonText }
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

var styles = StyleSheet.create({
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
  buttonTextColor: PropTypes.object.isRequired
};

export default Button;
