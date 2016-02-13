import { Navigator } from 'react-native';
import PixelRatio from 'PixelRatio';
import Dimensions from 'Dimensions';
import buildStyleInterpolator from 'buildStyleInterpolator';

// use FloatFromRight as starting template
const BaseConfig = Navigator.SceneConfigs.FloatFromRight;

// create custom navigator transition
const PushFromRightFast = Object.assign({}, BaseConfig, {
  springFriction: 25,
  springTension: 300,
});

const FlatFadeToTheLeft = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: -Math.round(Dimensions.get('window').width * 0.5), y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  opacity: {
    from: 1,
    to: 0.3,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100,
  },
  translateX: {
    from: 0,
    to: -Math.round(Dimensions.get('window').width * 0.5),
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};

PushFromRightFast.animationInterpolators.out = buildStyleInterpolator(FlatFadeToTheLeft);

export default PushFromRightFast;
