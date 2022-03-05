import {LitElement, html, css} from 'lit';
import {
  Viewer,
  EllipsoidTerrainProvider,
  buildModuleUrl,
  TileMapServiceImageryProvider,
  Cartesian3,
  EasingFunction,
  Camera,
  Rectangle,
} from 'cesium';

const usingCesiumInNodeModules = true;
if (usingCesiumInNodeModules === true) {
  window.CESIUM_BASE_URL = 'node_modules/cesium/Source/';
} else {
  window.CESIUM_BASE_URL = '';
}


Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  53.560705,
  3.40787,
  135.094757,
  73.502655
);


export class LitCesium extends LitElement {
  static get properties() {
    return {
      title: {type: String},
    };
  }

  static get styles() {
    return css`
      #cesiumContainer {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        z-index: 100;
      }
    `;
  }

  constructor() {
    super();
    this.title = 'lit-cesium';
    this._viewer = null;
  }
  _afterInit(){
    this.shadowRoot.querySelector('.cesium-performanceDisplay-defaultContainer').style.top="unset";
    this.shadowRoot.querySelector('.cesium-performanceDisplay-defaultContainer').style.bottom = "100px";
    document.getElementById('loadingOverlay').style.display = 'none';
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    const viewer = new Viewer(
      this.shadowRoot.getElementById('cesiumContainer'),
      {
        animation: true,
        baseLayerPicker: true,
        vrButton: false,
        geocoder: true,
        homeButton: true,
        sceneModePicker: true,
        timeline: true,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        terrainProvider: new EllipsoidTerrainProvider(),
        imageryProvider: new TileMapServiceImageryProvider({
          url: buildModuleUrl('Assets/Textures/NaturalEarthII'),
        }),
        contextOptions: {
          requestWebgl2: true
        }
      }
    );
    viewer.scene.debugShowFramesPerSecond = true;
    if (viewer.scene.highDynamicRangeSupported) {
      viewer.scene.highDynamicRange = true;
    }
    this.viewer = viewer;
    window.viewer = viewer;
    viewer.camera.flyTo({
      destination: new Cartesian3(
        -1621955.9993612065, 21432578.37807922, 17086421.738428168
      ),
      duration: 1,
      easingFunction: EasingFunction.CUBIC_IN_OUT,
      orientation: {
        direction: new Cartesian3(
          0.05891674453707222, -0.7785277440136412, -0.6248386743905853
        ),
        up: new Cartesian3(
          0.04715117170919459, -0.6230570888936531, 0.780753886308494
        ),
      },
      complete: this._afterInit.bind(this),
      cancel:this._afterInit.bind(this),
    });
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="node_modules/cesium/Source/Widgets/widgets.css"
      />
      <div id="cesiumContainer" class="fullSize"></div>
    `;
  }
}

customElements.define('lit-cesium', LitCesium);
