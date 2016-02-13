'use strict';

import React from 'react-native';
import DetailView from './DetailView';
import ListsContainer from './ListsContainer';
import PushFromRightFast from './animations';
import { pages } from './constants';

const {
  InteractionManager,
  Navigator,
  StyleSheet,
  Text,
  TouchableOpacity,
  PropTypes,
  View
} = React;

const getRouteMapper = page => {
  let color, mainTitle;
  switch (page) {
    case 'veggies':
      color = pages.VEGGIES.titleColor;
      mainTitle = pages.VEGGIES.title;
      break;
    case 'fruits':
      color = pages.FRUITS.titleColor;
      mainTitle = pages.FRUITS.title;
      break;
  }

  return {
    LeftButton: function (route, navigator, index, navState) {
      if (index > 0) {
        return (
          <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => navigator.pop()}>
            <Text style={[styles.navBarText, styles.title, { color: color }]}>
              Back
            </Text>
          </TouchableOpacity>
        );
      }
    },

    Title: function (route, navigator, index, navState) {
      const title = index === 0 ? mainTitle : route.item;
      return (
        <Text style={[styles.navBarText, styles.title, { color: color }]}>
          {title}
        </Text>
      );
    },

    RightButton: function (route, navigator, index, navState) {
      return null;
    }
  };
};

class AppNavigator extends React.Component {
  constructor(props) {
    super(props);
    this._seeDetail = this._seeDetail.bind(this);
  }

  _seeDetail(item) {
    this.refs.mainNav.push({
      id: 'detail',
      item: item
    });
  }

  render() {
    return (
      <Navigator
        ref='mainNav'
        initialRoute={{ id: 'list' }}
        configureScene={ route => PushFromRightFast }
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={getRouteMapper(this.props.page)}
            style={styles.navBar}
          />
        }
        renderScene={(route, nav) => {
          const Component = route.component;
          switch (route.id) {
            case 'list':
              return (
                <View style={{ flex: 1, paddingTop: 64 }}>
                  <ListsContainer itemColor={this.props.itemColor}
                                  listData={this.props.listData}
                                  page={this.props.page}
                                  seeDetail={this._seeDetail} />
                </View>
            );
            case 'detail':
              return <DetailView item={route.item} page={this.props.page} />
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    paddingTop: 30,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  navBarText: {
    marginVertical: 10
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FCB365'
  }
});

AppNavigator.propTypes = {
};

export default AppNavigator;
