import Stats from 'three/examples/jsm/libs/stats.module.js';
import { CAD } from 'src/helpers';

import { System } from './system';

export class StatsSystem extends System {
  private _stats: Stats = new Stats();
  private _statsContainer: HTMLDivElement = document.createElement('div');
  private _rendererInfoContainer: HTMLDivElement = document.createElement('div');

  constructor(cad: CAD) {
    super(cad);

    this.init();
  }

  // Getter of stats
  get stats(): Stats {
    return this._stats;
  }

  /**
   * Initialize
   */
  init() {
    // Add class names to stats dom nodes, so that custom styles can be applied
    this._stats.dom.className = 'stats';
    this._rendererInfoContainer.className = 'rendererInfo';
    this._statsContainer.className = 'statsContainer';
    // Append to cad container
    this._statsContainer.appendChild(this._rendererInfoContainer);
    this._statsContainer.appendChild(this._stats.dom);
    this._cad.container.appendChild(this._statsContainer);
  }

  /**
   * Update
   */
  update() {
    // Update stats
    this._stats.update();

    // Update renderer info
    const { memory, render, programs } = this._cad.renderer.info;
    this._rendererInfoContainer.innerHTML = `
      Frame number: ${render.frame} <br />
      Geometries: ${memory.geometries} <br />
      Textures: ${memory.textures} <br />
      Draw calls: ${render.calls} <br />
      Triangles: ${render.triangles} <br />
      Points: ${render.points} <br />
      Lines: ${render.lines} <br />
      Programs: ${programs?.length} <br />
    `;
  }

  /**
   * Dispose
   */
  dispose() {
    this._stats.end();
    this._statsContainer?.remove();
  }
}
