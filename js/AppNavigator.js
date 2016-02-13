'use strict';

import React from 'react-native';
import DetailView from './DetailView';
import ListsContainer from './ListsContainer';
import PushFromRightFast from './animations';
import { pages } from './constants';

const {
  Navigator,
  StyleSheet,
  Text,
  TouchableOpacity,
  PropTypes,
  View
} = React;

class AppNavigator extends React.Component {
  constructor(props) {
    super(props);
    this._seeDetail = this._seeDetail.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this._getRouteMapper = this._getRouteMapper.bind(this);
    this._onNavigatorPop = this._onNavigatorPop.bind(this);
  }

  _seeDetail(item) {
    this.props.onRoutePush();
    this.refs.mainNav.push({
      id: 'detail',
      item: item
    });
  }

  _onNavigatorPop(navigator) {
    navigator.pop();
    this.props.onRoutePop();
  }

  _getRouteMapper(page) {
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

    let _this = this;
    return {
      LeftButton: function (route, navigator, index, navState) {
        if (index > 0) {
          return (
            <TouchableOpacity style={{ paddingLeft: 10 }}
                              onPress={() => _this._onNavigatorPop(navigator)}>
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

      RightButton: function (route, navigator, index, navState) { return null }
    };
  }

  _renderScene(route, nav) {
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
  }

  render() {
    return (
      <Navigator
        ref='mainNav'
        initialRoute={{ id: 'list' }}
        configureScene={ route => PushFromRightFast }
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={this._getRouteMapper(this.props.page)}
            style={styles.navBar} />
        }
        renderScene={this._renderScene} />
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
  itemColor: PropTypes.object.isRequired,
  listData: PropTypes.array.isRequired,
  page: PropTypes.string.isRequired,
  onRoutePush: PropTypes.func.isRequired,
  onRoutePop: PropTypes.func.isRequired
};

export default AppNavigator;
