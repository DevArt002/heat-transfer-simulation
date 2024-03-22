import * as d3 from 'd3';

import { ISimulatorDataUpdatedPayload, TXY } from 'src/types';

export class Visualizer {
  private _temperatureData: TXY[] = []; // Data of temperature. Array<[time, temperature]>
  private _line: d3.Line<TXY>;
  private _xScale: d3.ScaleLinear<number, number>;
  private _yScale: d3.ScaleLinear<number, number>;
  private _svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private _xAxis: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _yAxis: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _lineGraph: d3.Selection<SVGPathElement, unknown, null, undefined>;
  private _dimension: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0]; // Dimension of sub plot: [w, h, mt, mr, mb, ml]
  private _rangeX: TXY | null = null;
  private _rangeY: TXY | null = null;

  constructor(private readonly _container: HTMLDivElement) {
    this._line = d3.line();
    this._xScale = d3.scaleLinear();
    this._yScale = d3.scaleLinear();
    this._svg = d3.select(_container).append('svg');
    this._xAxis = this._svg.append('g');
    this._yAxis = this._svg.append('g');
    this._lineGraph = this._svg.append('path');
  }

  // Getter of container
  get container(): HTMLDivElement {
    return this._container;
  }

  // Getter of temperature data
  get temperatureData(): TXY[] {
    return this._temperatureData;
  }

  /**
   * Initialize
   */
  init(): void {
    this._onResize = this._onResize.bind(this);
    this.onSimulationDataUpdated = this.onSimulationDataUpdated.bind(this);

    this._updateDimension();
    this._initEventListeners();
  }

  /**
   * Initialize EventListeners
   */
  private _initEventListeners(): void {
    window.addEventListener('resize', this._onResize);
  }

  /**
   * Initialize EventListeners
   */
  private _disposeEventListeners(): void {
    window.removeEventListener('resize', this._onResize);
  }

  /**
   * Listener when window is resized
   */
  private _onResize(): void {
    this._updateDimension();
    // After re-calculating dimension, draw again
    this._draw();
  }

  /**
   * Simulation date update listener
   */
  onSimulationDataUpdated(e: Event): void {
    const { _temperatureData, _rangeX, _rangeY } = this;

    const { elapsed, temperature } = (e as CustomEvent<ISimulatorDataUpdatedPayload>).detail;

    _temperatureData.push([elapsed, temperature]);

    if (_rangeX === null || _rangeY === null) {
      this._rangeX = [elapsed, elapsed];
      this._rangeY = [0, temperature];
    } else {
      this._rangeX = [Math.min(_rangeX[0], elapsed), Math.max(_rangeX[1], elapsed)];
      this._rangeY = [Math.min(_rangeY[0], temperature), Math.max(_rangeY[1], temperature)];
    }

    this._draw();
  }

  /**
   * Listener when data is updated
   */
  private _draw() {
    const {
      _xScale,
      _yScale,
      _line,
      _svg,
      _xAxis,
      _yAxis,
      _lineGraph,
      _dimension,
      _rangeX,
      _rangeY,
      _temperatureData,
    } = this;
    const [w, h, mt, mr, mb, ml] = _dimension;

    if (_rangeX === null || _rangeY === null) return;

    // Update x axis scale
    _xScale.domain(_rangeX).range([ml, w - mr]);

    // Update y axis scale
    _yScale
      .domain(_rangeY)
      .nice()
      .range([h - mb, mt]);

    // Draw plot
    // Update svg wrapper
    _svg.attr('width', w);
    _svg.attr('height', h);

    // Draw x axis
    _xAxis
      .attr('transform', `translate(0, ${h - mb})`)
      .call(d3.axisBottom(_xScale).ticks(3).tickSize(0));

    // Draw y axis
    _yAxis.attr('transform', `translate(${ml}, 0)`).call(d3.axisLeft(_yScale).ticks(5).tickSize(0));

    // Draw line
    _lineGraph.attr('fill', 'none').attr('stroke', '#ff0000').attr('stroke-width', 1.5);
    _lineGraph.attr(
      'd',
      _line(_temperatureData.map(([time, temperature]) => [_xScale(time), temperature])),
    );
  }

  /**
   * Set dimension
   */
  private _updateDimension(): void {
    const { width } = this._container.getBoundingClientRect();

    this._dimension = [width, 150, 20, 20, 20, 40]; // Apply fixed value for height, top margin, right margin, bottom margin, left margin
  }

  /**
   * Dispose
   */
  dispose(): void {
    // Detach all event listeners
    this._disposeEventListeners();

    // Remove svg
    this._svg.remove();
  }
}
