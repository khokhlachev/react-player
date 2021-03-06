'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isequal');

var _lodash4 = _interopRequireDefault(_lodash3);

var _props2 = require('./props');

var _FilePlayer = require('./players/FilePlayer');

var _FilePlayer2 = _interopRequireDefault(_FilePlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactPlayer = function (_Component) {
  _inherits(ReactPlayer, _Component);

  function ReactPlayer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactPlayer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactPlayer.__proto__ || Object.getPrototypeOf(ReactPlayer)).call.apply(_ref, [this].concat(args))), _this), _this.seekTo = function (fraction) {
      if (_this.player) {
        _this.player.seekTo(fraction);
      }
    }, _this.getDuration = function () {
      if (!_this.player) return null;
      return _this.player.getDuration();
    }, _this.getCurrentTime = function () {
      if (!_this.player) return null;
      var duration = _this.player.getDuration();
      var fractionPlayed = _this.player.getFractionPlayed();
      if (duration === null || fractionPlayed === null) {
        return null;
      }
      return fractionPlayed * duration;
    }, _this.progress = function () {
      if (_this.props.url && _this.player) {
        var loaded = _this.player.getFractionLoaded() || 0;
        var played = _this.player.getFractionPlayed() || 0;
        var duration = _this.player.getDuration();
        var progress = {};
        if (loaded !== _this.prevLoaded) {
          progress.loaded = loaded;
          if (duration) {
            progress.loadedSeconds = progress.loaded * duration;
          }
        }
        if (played !== _this.prevPlayed) {
          progress.played = played;
          if (duration) {
            progress.playedSeconds = progress.played * duration;
          }
        }
        if (progress.loaded || progress.played) {
          _this.props.onProgress(progress);
        }
        _this.prevLoaded = loaded;
        _this.prevPlayed = played;
      }
      _this.progressTimeout = setTimeout(_this.progress, _this.props.progressFrequency);
    }, _this.ref = function (player) {
      _this.player = player;
    }, _this.renderPlayer = function (Player) {
      var active = Player.canPlay(_this.props.url);

      var _this$props = _this.props,
          youtubeConfig = _this$props.youtubeConfig,
          vimeoConfig = _this$props.vimeoConfig,
          dailymotionConfig = _this$props.dailymotionConfig,
          activeProps = _objectWithoutProperties(_this$props, ['youtubeConfig', 'vimeoConfig', 'dailymotionConfig']);

      var props = active ? _extends({}, activeProps, { ref: _this.ref }) : {};
      // Only youtube and vimeo config passed to
      // inactive players due to preload behaviour
      return _react2['default'].createElement(Player, _extends({
        key: Player.displayName
      }, props));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReactPlayer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.progress();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.progressTimeout);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.url !== nextProps.url || this.props.playing !== nextProps.playing || this.props.volume !== nextProps.volume || this.props.playbackRate !== nextProps.playbackRate || this.props.height !== nextProps.height || this.props.width !== nextProps.width || this.props.hidden !== nextProps.hidden || !(0, _lodash4['default'])(this.props.fileConfig, nextProps.fileConfig);
    }
  }, {
    key: 'renderPlayers',
    value: function renderPlayers() {
      // Build array of players to render based on URL and preload config
      var url = this.props.url;

      var players = [];
      if (url) {
        // Fall back to FilePlayer if nothing else can play the URL
        players.push(_FilePlayer2['default']);
      }
      // Render additional players if preload config is set
      return players.map(this.renderPlayer);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          width = _props.width,
          height = _props.height;

      var otherProps = (0, _lodash2['default'])(this.props, Object.keys(_props2.propTypes));
      var players = this.renderPlayers();
      return _react2['default'].createElement(
        'div',
        _extends({ style: _extends({}, style, { width: width, height: height }) }, otherProps),
        players
      );
    }
  }]);

  return ReactPlayer;
}(_react.Component);

ReactPlayer.displayName = 'ReactPlayer';
ReactPlayer.propTypes = _props2.propTypes;
ReactPlayer.defaultProps = _props2.defaultProps;
exports['default'] = ReactPlayer;