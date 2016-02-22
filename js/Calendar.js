'use strict';

import React from 'react-native';
import { pages } from './constants';

const {
  Animated,
  Easing,
  InteractionManager,
  Text,
  PropTypes,
  StyleSheet,
  View,
} = React;

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0.25)
    };
  }

  componentWillReceiveProps(nextProps) {
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this.state.opacity,
        {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.cubic)
        }
      ).start();
    });
  }

  render() {
    const getBoxStyles = (page, month) => {
      const boxStyles = [
        styles.month,
        { backgroundColor: pages[page.toUpperCase()].monthBgColor }
      ];
      if (this.props.months[month]) {
        boxStyles.push({ opacity: this.state.opacity });
      }
      return boxStyles;
    };

    const getTextStyles = page => {
      return [styles.label, { color: pages[page.toUpperCase()].monthTextColor }];
    };

    const boxes = Object.keys(this.props.months).map((m, i) => {
      return (
        <Animated.View key={i} style={getBoxStyles(this.props.page, m)}>
          <Text style={getTextStyles(this.props.page)}>{m.slice(0,3)}</Text>
        </Animated.View>
      );
    });

    const makeRow = (elems, key) => (<View key={key} style={styles.row}>{elems}</View>);

    // lay out boxes in rows of 3
    const rows = boxes.map((x, i, xs) => {
      if ((i + 1) % 3 === 0) {
        return makeRow([xs[i-2], xs[i-1], xs[i]], i);
      }
    }).filter(x => x !== undefined);

    return <View style={styles.container}>{rows}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 260
  },
  month: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFF',
    opacity: 0.25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeMonth: {
    opacity: 1
  },
  label: {
    backgroundColor: 'transparent',
    fontWeight: '500',
  }
});

Calendar.propTypes = {
  months: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  page: PropTypes.string.isRequired
};

export default Calendar;
