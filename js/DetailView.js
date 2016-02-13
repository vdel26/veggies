'use strict';

import React from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Parse from 'parse/react-native';
import { pages } from './constants';

const {
  InteractionManager,
  Text,
  TouchableOpacity,
  PropTypes,
  StyleSheet,
  View,
} = React;

class DetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      months: []
    };
  }

  componentDidMount() {
    const collection = Parse.Object.extend('Veggies');
    const query = new Parse.Query(collection);
    query.equalTo('name', this.props.item);

    // TODO: error state
    const onError = (error) => console.log("Error: " + error.code + " " + error.message);
    const onSuccess = (object) => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ months: object.get('bestMonths') });
      });
    };
    query.first().then(onSuccess, onError);
  }

  render() {
    const titleColor = this.props.page === 'veggies' ?
                       pages.VEGGIES.titleColor :
                       pages.FRUITS.titleColor;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, paddingTop: 100 }}>
          <Text>{ this.state.months.join(', ') }</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

DetailView.propTypes = {
  page: PropTypes.string.isRequired
};

export default DetailView;
