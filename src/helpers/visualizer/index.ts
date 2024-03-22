import * as d3 from 'd3';

import { ISimulatorDataUpdatedPayload, TXY } from 'src/types';

import { formatSeconds } from 'src/utils';

export class Visualizer {
  private _temperatureData: TXY[] = []; // Data of temperature. Array<[time, temperature]>
  private _line: d3.Line<TXY>;
  private _xScale: d3.ScalePoint<string>;
  private _xDummyScale: d3.ScaleLinear<number, number>;
  private _yScale: d3.ScaleLinear<number, number>;
  private _svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private _xAxis: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _yAxis: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _lineGraph: d3.Selection<SVGPathElement, unknown, null, undefined>;
  private _dimension: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0]; // Dimension of sub plot: [w, h, mt, mr, mb, ml]
  private _rangeX: TXY | null = null;
  private _rangeY: TXY | null = null;
  private _xTickValues: string[] = [];

  constructor(private readonly _container: HTMLDivElement) {
    this._line = d3.line();
    this._xScale = d3.scalePoint();
    this._xDummyScale = d3.scaleLinear();
    this._yScale = d3.scaleLinear();
    this._svg = d3.select(_container).append('svg');
    this._xAxis = this._svg.append('g');
    this._yAxis = this._svg.append('g');
    this._lineGraph = this._svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', '#ff0000')
      .attr('stroke-width', 1.5);
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
    this.onSimulationStarted = this.onSimulationStarted.bind(this);
    this.onSimulationStopped = this.onSimulationStopped.bind(this);
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
   * Simulation started listener
   */
  onSimulationStarted(): void {
    this._lineGraph.attr('d', '');
    this._xScale.domain([]);
    this._xDummyScale.domain([]);
    this._yScale.domain([]);
  }

  /**
   * Simulation stopped listener
   */
  onSimulationStopped(): void {
    this._temperatureData = [];
    this._rangeX = null;
    this._rangeY = null;
    this._xTickValues = [];
  }

  /**
   * Simulation date update listener
   */
  onSimulationDataUpdated(e: Event): void {
    const { _temperatureData, _rangeX, _rangeY } = this;

    const { elapsed, temperature } = (e as CustomEvent<ISimulatorDataUpdatedPayload>).detail;

    _temperatureData.push([elapsed, temperature]);

    // Reset axis ranges
    if (_rangeX === null || _rangeY === null) {
      this._rangeX = [elapsed, elapsed];
      this._rangeY = [0, temperature];
    } else {
      this._rangeX = [Math.min(_rangeX[0], elapsed), Math.max(_rangeX[1], elapsed)];
      this._rangeY = [Math.min(_rangeY[0], temperature), Math.max(_rangeY[1], temperature)];
    }

    // Get custom tick values for x axis
    const xTickCount = 10;
    const avgX = (this._rangeX[1] - this._rangeX[0]) / xTickCount;
    this._xTickValues = [];
    for (let i = 0; i < xTickCount; i++) {
      if (i === xTickCount - 0) {
        this._xTickValues.push(formatSeconds(this._rangeX[1]));
      } else {
        this._xTickValues.push(formatSeconds(this._rangeX[0] + i * avgX));
      }
    }

    this._draw();
  }

  /**
   * Listener when data is updated
   */
  private _draw() {
    const {
      _xScale,
      _xDummyScale,
      _yScale,
      _line,
      _xAxis,
      _yAxis,
      _lineGraph,
      _rangeX,
      _rangeY,
      _xTickValues,
      _temperatureData,
    } = this;

    if (_rangeX === null || _rangeY === null) return;

    // Set domain
    _xScale.domain(_xTickValues);
    _xDummyScale.domain(_rangeX);
    _yScale.domain(_rangeY);

    // Draw x axis
    _xAxis.call(d3.axisBottom(_xScale));

    // Draw y axis
    _yAxis.call(d3.axisLeft(_yScale).ticks(5));

    // Draw line
    _lineGraph.attr(
      'd',
      _line(
        _temperatureData.map(([time, temperature]) => [_xDummyScale(time), _yScale(temperature)]),
      ),
    );
  }

  /**
   * Set dimension
   */
  private _updateDimension(): void {
    const { _container, _xScale, _xDummyScale, _yScale, _svg, _xAxis, _yAxis } = this;
    const { width, height } = _container.getBoundingClientRect();

    const w = width;
    const h = height;
    const mt = 20;
    const mr = 20;
    const mb = 20;
    const ml = 40;

    _xScale.range([ml, w - mr]);
    _xDummyScale.range([ml, w - mr]);
    _yScale.nice().range([h - mb, mt]);
    _svg.attr('width', w);
    _svg.attr('height', h);
    _xAxis.attr('transform', `translate(0, ${h - mb})`);
    _yAxis.attr('transform', `translate(${ml}, 0)`);

    this._dimension = [w, h, mt, mr, mb, ml]; // Apply fixed value for height, top margin, right margin, bottom margin, left margin
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
